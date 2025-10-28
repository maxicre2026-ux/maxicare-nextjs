import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("pass1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@maxi.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@maxi.com",
      password: hash,
      role: "ADMIN",
    },
  });
  console.log("Admin created => admin@maxi.com / pass1234");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
