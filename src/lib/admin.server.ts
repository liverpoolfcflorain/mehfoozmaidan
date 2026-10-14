import { createHash, timingSafeEqual } from "node:crypto";

export function checkAdminPassword(p: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) return false;
  const a = createHash("sha256").update(p).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
