import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// time helpers
function generateSlotsCairo(date: Date) {
  const slots: string[] = [];
  // date parameter is local-agnostic (UTC midnight). We'll create times in Africa/Cairo zone (UTC+2 standard)
  const tz = 'Africa/Cairo';
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  const startUtc = Date.UTC(y, m, d, 13, 0, 0); // 13:00 UTC = 15:00 Cairo
  for (let i = 0; i < 12; i++) {
    slots.push(new Date(startUtc + i * 30 * 60 * 1000).toISOString());
  }
  return slots;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { date } = req.query; // YYYY-MM-DD
    if (!date || typeof date !== "string") return res.status(400).json({ error: "date query required" });
    const day = new Date(date + "T00:00:00");
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const booked = await prisma.appointment.findMany({
      where: {
        date: {
          gte: day,
          lt: nextDay,
        },
      },
      select: { date: true },
    });
    const bookedIso = booked.map((b) => b.date.toISOString());
    // if Friday (getDay = 5), no slots
    if (day.getDay() === 5) return res.json({ available: [] });

    const allSlots = generateSlotsCairo(day);
    const available = allSlots.filter((s) => !bookedIso.includes(s));
    return res.json({ available });
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthenticated" });

    const { dateTime, doctor } = req.body; // ISO string
    if (!dateTime) return res.status(400).json({ error: "Missing dateTime" });
    if (!doctor) return res.status(400).json({ error: "Missing doctor" });
    const date = new Date(dateTime);

    // simple conflict check
    const exist = await prisma.appointment.findFirst({ where: { date } });
    if (exist) return res.status(400).json({ error: "Slot taken" });

    await prisma.appointment.create({
      data: {
        date,
        doctor,
        userId: session.user.id as string,
      },
    });
    return res.status(201).json({ ok: true });
  }

  return res.status(405).end();
}
