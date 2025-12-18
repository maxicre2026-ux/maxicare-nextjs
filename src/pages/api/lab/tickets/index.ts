import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session) return res.status(401).json({ error: "Unauthenticated" });

  if (req.method === "GET") {
    // Users can only see their own tickets
    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id as string },
      include: { messages: true, files: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ tickets });
  }

  if (req.method === "POST") {
    const { subject, description, attachmentUrl } = req.body as {
      subject?: string;
      description?: string;
      attachmentUrl?: string;
    };

    if (!subject || typeof subject !== "string") {
      return res.status(400).json({ error: "subject required" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description: description && typeof description === "string" ? description : undefined,
        attachment: attachmentUrl && typeof attachmentUrl === "string" ? attachmentUrl : undefined,
        userId: session.user.id as string,
      },
    });
    return res.status(201).json({ ticket });
  }

  res.status(405).end();
}
