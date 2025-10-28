import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = req.query.id as string;

  if (req.method === "PATCH") {
    const { approved, reportText } = req.body as {
      approved?: boolean;
      reportText?: string;
    };

    try {
      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          approved: approved ?? undefined,
          note: reportText ?? undefined,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
      return res.json({ appointment: updated });
    } catch (e) {
      return res.status(400).json({ error: "Update failed" });
    }
  }

  // unsupported
  return res.status(405).end();
}
