import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE = "renda_session";
const SESSION_DAYS = 7;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date() || !session.user.active) return null;
  return { id: session.user.id, email: session.user.email, role: session.user.role };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  cookieStore.delete(COOKIE);
}
