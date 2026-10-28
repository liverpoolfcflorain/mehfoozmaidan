import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

// This app's browser entry is already plain JavaScript; no transpilation is needed.
const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  ...["index.html", "main.js", "styles.css"].map((file) =>
    cp(resolve(root, file), resolve(output, file)),
  ),
  cp(resolve(root, "public"), resolve(output, "public"), { recursive: true }),
]);
await cp(
  resolve(root, "node_modules/@lovable.dev/cloud-auth-js/dist/index.js"),
  resolve(output, "public/cloud-auth.js"),
);
console.log("Browser files prepared in dist.");