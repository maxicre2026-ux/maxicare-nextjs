import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, password, phone, address, country } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email exists" });
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      phone: phone || null,
      address: address || null,
      country: country || null,
      role: "LAB_CLIENT",
    },
  });
  return res.status(201).json({ ok: true });
}
