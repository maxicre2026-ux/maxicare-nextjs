import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "LAB_CLIENT"))
    return res.status(403).json({ error: "Forbidden" });

  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        messages: true,
        files: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
