import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const hash = await bcrypt.hash("pass1234", 10);
await prisma.user.upsert({
  where: { email: "admin@maxi.com" },
  update: {},
  create: { name: "Admin", email: "admin@maxi.com", password: hash, role: "ADMIN" },
});
await prisma.user.upsert({
  where: { email: "clinicadmin@maxi.com" },
  update: {},
  create: { name: "Clinic Admin", email: "clinicadmin@maxi.com", password: hash, role: "ADMIN" },
});
await prisma.user.upsert({
  where: { email: "labadmin@maxi.com" },
  update: {},
  create: { name: "Lab Admin", email: "labadmin@maxi.com", password: hash, role: "LAB_CLIENT" },
});
console.log("Users created → clinicadmin@maxi.com, labadmin@maxi.com / pass1234");
process.exit(0);