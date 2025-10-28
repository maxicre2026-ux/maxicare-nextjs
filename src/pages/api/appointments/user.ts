import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthenticated" });
  const userId = (session.user as any).id as string;
  const bookings = await prisma.appointment.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    include: {
      reportFiles: true,
    },
  });
  res.json({ bookings });
}
