import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "LAB_CLIENT"))
    return res.status(403).json({ error: "Forbidden" });

  if (method !== "PATCH") return res.status(405).end();

  const { response, status }: { response?: string; status?: TicketStatus } = req.body;
  if (!response && !status)
    return res.status(400).json({ error: "Nothing to update" });

  try {
    const ticket = await prisma.ticket.update({
      where: { id: id as string },
      data: {
        ...(response !== undefined ? { response } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });
    return res.json({ ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
