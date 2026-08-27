import fs from "node:fs";
import path from "node:path";

const distPublic = path.resolve("dist/public");
const targetPublic = path.resolve("public");

if (fs.existsSync(distPublic)) {
  fs.rmSync(targetPublic, { recursive: true, force: true });
  fs.mkdirSync(targetPublic, { recursive: true });
  fs.cpSync(distPublic, targetPublic, { recursive: true });
  console.log("Successfully copied dist/public to public/");
} else {
  console.warn("dist/public does not exist yet. Run build first.");
}
