import crypto from "crypto";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "irg_session";

export const SESSION_DURATION_MS =
  1000 * 60 * 60 * 24 * 7;

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: string
) {
  const token = generateSessionToken();

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS
  );

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return session;
}

export async function deleteSession(
  token: string
) {
  await prisma.session.deleteMany({
    where: {
      token,
    },
  });
}