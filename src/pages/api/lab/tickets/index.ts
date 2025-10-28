import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { put } from "@vercel/blob";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session) return res.status(401).json({ error: "Unauthenticated" });

  const role = (session.user as any).role;
  if (role !== "LAB_CLIENT" && role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  if (req.method === "GET") {
    const tickets = await prisma.ticket.findMany({
      where: role === "ADMIN" ? {} : { userId: session.user.id as string },
      include: { messages: true, files: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ tickets });
  }

  if (req.method === "POST") {
    const form = formidable({ multiples: false });
    const { fields, files }: { fields: formidable.Fields; files: formidable.Files } = await new Promise((ok, err) =>
      form.parse(req, (e, flds, fls) => (e ? err(e) : ok({ fields: flds, files: fls })))
    );

    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    if (!subject) return res.status(400).json({ error: "subject required" });
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    let attachment: string | undefined;
    const up = files.file as formidable.File | formidable.File[] | undefined;
    const file = Array.isArray(up) ? up[0] : up;
    if (file && (file as any).filepath) {
      const buffer = await fs.promises.readFile(file.filepath);
      const ext = path.extname(file.originalFilename || "");
      const blob = await put(`tickets/${Date.now()}${ext}`, buffer, { access: "public" });
      attachment = blob.url;
    }

    const ticket = await prisma.ticket.create({
      data: { subject, description, attachment, userId: session.user.id as string },
    });
    return res.status(201).json({ ticket });
  }

  res.status(405).end();
}
