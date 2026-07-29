import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import {
  ensureSchema,
  countAdminUsers,
  insertAdminUser,
  findAdminPasswordHash,
} from "./pieces";

/**
 * Bashir&Co — admin authentication.
 *
 * Passwords are bcrypt-hashed, never stored or compared in plaintext.
 * The session is a signed cookie (HMAC-SHA256 over the payload with
 * ADMIN_SECRET) — signed rather than merely set, so a visitor cannot
 * forge one by editing the cookie value in their browser. It's
 * httpOnly + secure + sameSite=lax, so JavaScript on the page can't read
 * it and it isn't sent along on cross-site requests.
 *
 * No session table: the signature itself is the proof, which keeps the
 * whole thing stateless and means a database blip can't log the client
 * out mid-edit.
 */

const COOKIE = "bashir_admin";
const MAX_AGE_S = 60 * 60 * 12; // 12 hours

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SECRET is missing or too short — set a random string of at least 16 characters in the environment."
    );
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Creates the first admin user if none exists yet. */
export async function ensureAdminUser(): Promise<void> {
  await ensureSchema();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  if ((await countAdminUsers()) > 0) return;

  const hash = await bcrypt.hash(password, 12);
  await insertAdminUser(email, hash);
}

/** Verifies credentials. Returns true only on an exact bcrypt match. */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<boolean> {
  await ensureAdminUser();
  const hash = await findAdminPasswordHash(email);
  if (!hash) {
    // Hash a dummy anyway, so a missing user and a wrong password take
    // the same time — otherwise the response time leaks which emails exist.
    await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinv");
    return false;
  }
  return bcrypt.compare(password, hash);
}

/** Issues a signed session cookie. */
export async function createSession(email: string): Promise<void> {
  const issued = Date.now().toString();
  const nonce = randomBytes(8).toString("hex");
  const payload = `${email.toLowerCase()}|${issued}|${nonce}`;
  const value = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;

  const store = await cookies();
  store.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** True when the caller holds a valid, unexpired, correctly signed session. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return false;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature) return false;

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString();
  } catch {
    return false;
  }

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false; // ADMIN_SECRET not set — treat as unauthenticated
  }
  if (!safeEqual(signature, expected)) return false;

  const [, issued] = payload.split("|");
  const age = (Date.now() - Number(issued)) / 1000;
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_S) return false;

  return true;
}
