import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const { userId, from, to } = req.query as { userId?: string; from?: string; to?: string };

    const where: any = {};
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) {
        const end = new Date(to as string);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ payments });
  }

  if (req.method === "POST") {
    const { userId, amount, currency, notes } = req.body as {
      userId: string;
      amount: number;
      currency?: string;
      notes?: string;
    };
    if (!userId || !amount) return res.status(400).json({ error: "userId & amount required" });
    const payment = await prisma.payment.create({
      data: { userId, amount: parseFloat(amount as any), currency: currency || "EGP", notes },
      include: { user: true },
    });
    return res.status(201).json({ payment });
  }

  res.status(405).end();
}
