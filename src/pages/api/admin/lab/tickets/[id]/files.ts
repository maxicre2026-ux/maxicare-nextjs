import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  const { id } = req.query;
  const form = formidable({ multiples: false });

  try {
    const { files }: { files: formidable.Files } = await new Promise((resolve, reject) =>
      form.parse(req, (err, _f, fl) => (err ? reject(err) : resolve({ files: fl })))
    );

    const raw = files.file as formidable.File | formidable.File[] | undefined;
    const file = Array.isArray(raw) ? raw[0] : raw;
    if (!file) return res.status(400).json({ error: "file required" });

    const ext = path.extname(file.originalFilename || "");
    const destDir = path.join(process.cwd(), "public", "tickets", "results");
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const filename = `${Date.now()}${ext}`;
    await fs.promises.copyFile(file.filepath, path.join(destDir, filename));

    const dbFile = await prisma.ticketFile.create({
      data: { filename, ticketId: id as string },
    });

    return res.status(201).json({ file: dbFile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
