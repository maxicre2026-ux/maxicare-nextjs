import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const hash = await bcrypt.hash("pass1234", 10);
await prisma.user.upsert({
  where: { email: "admin@maxi.com" },
  update: {},
  create: { name: "Admin", email: "admin@maxi.com", password: hash, role: "ADMIN" },
});
console.log("Admin created  →  admin@maxi.com / pass1234");
process.exit(0);