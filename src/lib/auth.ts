import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Role } from "@/lib/permissions";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId?: string | null;
};

const cookieName = "tronicase_session";

function secret() {
  return process.env.AUTH_SECRET || "local-tronicase-development-secret";
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createToken(user: SessionUser) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    })
  );
  const unsigned = `${header}.${payload}`;
  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyToken(token?: string): SessionUser | null {
  if (!token) return null;
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  const expected = sign(`${header}.${payload}`);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return {
    id: parsed.sub,
    name: parsed.name,
    email: parsed.email,
    role: parsed.role,
    branchId: parsed.branchId
  };
}

export function getCurrentUser() {
  return verifyToken(cookies().get(cookieName)?.value);
}

export function attachSession(response: NextResponse, user: SessionUser) {
  response.cookies.set(cookieName, createToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/"
  });
  return response;
}
