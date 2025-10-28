import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthenticated" });

  if (req.method !== "GET") return res.status(405).end();

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ payments });
}
