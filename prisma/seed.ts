import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password === "change-this-before-running-seed") {
    throw new Error("Configure ADMIN_EMAIL e uma ADMIN_PASSWORD forte no .env antes do seed.");
  }
  if (password.length < 14) throw new Error("ADMIN_PASSWORD deve ter pelo menos 14 caracteres.");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, active: true },
    create: { email: email.toLowerCase(), passwordHash, role: "ADMIN" },
  });
  console.log("Administrador configurado.");
}

main().finally(async () => prisma.$disconnect());
