import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const { id } = req.query;
  const { text } = req.body as { text?: string };
  if (!text) return res.status(400).json({ error: "text required" });

  try {
    const message = await prisma.ticketMessage.create({
      data: { text, author: "ADMIN", ticketId: id as string },
    });
    return res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
