import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { put } from "@vercel/blob";
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
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: "Invalid id" });

  const form = formidable({ multiples: false });

  try {
    const { files }: { files: any } = await new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: any, f: any) => (err ? reject(err) : resolve({ files: f })));
    });

    const up = files.file as any;
    const file: any = Array.isArray(up) ? up[0] : up;
    if (!file || !(file as any).filepath) {
      return res.status(400).json({ error: "file required" });
    }

    const ext = path.extname(file.originalFilename || "");
    const buffer = await fs.promises.readFile(file.filepath);
    const blob = await put(`reports/${id}${ext}`, buffer, { access: "public" });

    // record in DB
    await prisma.reportFile.create({
      data: { filename: blob.url, appointmentId: id },
    });

    return res.status(201).json({ filename: blob.url });
  } catch (err) {
    console.error("Report upload error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
