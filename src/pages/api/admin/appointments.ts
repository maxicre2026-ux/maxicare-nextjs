import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only GET for now
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return res.status(401).json({ error: "Unauthorized" });

  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "asc" },
    include: {
      user: {
        include: { payments: true },
      },
      reportFiles: true,
    },
  });

  res.json({ appointments });
}
