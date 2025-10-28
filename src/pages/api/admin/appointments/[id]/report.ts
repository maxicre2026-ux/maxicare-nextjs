import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import formidable from "formidable";
import fs from "fs";
import { put } from "@vercel/blob";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false, // formidable will parse
  },
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({ onError })
  .use(async (req, res, next) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "ADMIN") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  })
  .post(async (req, res) => {
    const id = req.query.id as string;
    const form = formidable({ multiples: false });

    const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file as formidable.File;
    if (!file) return res.status(400).json({ error: "file required" });

    const ext = path.extname(file.originalFilename || "");
    const dataBuffer = await fs.promises.readFile(file.filepath);
    const blob = await put(`reports/${id}${ext}`, dataBuffer, { access: "public" });

    // record in DB
    await prisma.reportFile.create({
      data: { filename: blob.url, appointmentId: id },
    });

    res.json({ ok: true, url: blob.url });
  });

export default handler;

function onError(err: any, req: NextApiRequest, res: NextApiResponse) {
  console.error(err);
  res.status(500).json({ error: "upload failed" });
}
