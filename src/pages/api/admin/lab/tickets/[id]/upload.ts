import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import { put } from "@vercel/blob";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const form = formidable({ multiples: false });
  try {
    const { files }: { files: formidable.Files } = await new Promise((resolve, reject) =>
      form.parse(req, (err, _fields, files) => (err ? reject(err) : resolve({ files })))
    );

    const rawFile = files.file as formidable.File | formidable.File[] | undefined;
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
    if (!file || !(file as any).filepath)
      return res.status(400).json({ error: "file required" });

    const ext = path.extname(file.originalFilename || "");
    const buffer = await fs.promises.readFile(file.filepath);
    const blob = await put(`tickets/results/${Date.now()}${ext}`, buffer, { access: "public" });

    const ticket = await prisma.ticket.update({
      where: { id: id as string },
      data: { resultFile: blob.url },
    });
    return res.status(200).json({ ticket, url: blob.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
