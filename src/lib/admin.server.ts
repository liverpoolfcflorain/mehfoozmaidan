export function checkAdminPassword(p: string) {
  const expected = process.env["ADMIN_PASSWORD"] || "saifhameed123";
  return p === expected;
}
