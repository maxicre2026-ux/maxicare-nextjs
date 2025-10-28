import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: "Invalid id" });

  const form = formidable({ multiples: false });

  try {
    const { files }: { files: any } = await new Promise((resolve, reject) => {
      form.parse(req, (err: Error, fields: formidable.Fields, f: formidable.Files) => (err ? reject(err) : resolve({ files: f })));
    });

    const up = files.file as formidable.File | formidable.File[] | undefined;
    const file = Array.isArray(up) ? up[0] : up;
    if (!file || !(file as any).filepath) return res.status(400).json({ error: "file required" });

    const destDir = path.join(process.cwd(), "public", "prescriptions");
    fs.mkdirSync(destDir, { recursive: true });
    const filename = `${Date.now()}_${file.originalFilename}`;
    await fs.promises.copyFile((file as any).filepath, path.join(destDir, filename));

    await prisma.appointment.update({
      where: { id },
      data: { prescriptionFile: filename },
    });

    return res.status(201).json({ prescriptionFile: filename });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
