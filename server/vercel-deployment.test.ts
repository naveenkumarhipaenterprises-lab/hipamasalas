import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("Vercel deployment configuration", () => {
  it("exports the Express application from a Vercel-detectable root server entry", () => {
    const serverEntry = fs.readFileSync(path.join(projectRoot, "server.ts"), "utf8");
    const appSource = fs.readFileSync(path.join(projectRoot, "server", "index.ts"), "utf8");
    expect(serverEntry).toContain('export default app');
    expect(appSource).toContain('export function createApp()');
    expect(appSource).toContain('if (process.env.VERCEL)');
  });

  it("builds public assets and includes the production SSR entry for Vercel", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
    const vercel = JSON.parse(fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8"));
    expect(packageJson.scripts["vercel-build"]).toContain("copy-public.mjs");
    expect(vercel.buildCommand).toBe("npm run vercel-build");
    expect(vercel.outputDirectory).toBe("public");
    expect(vercel.functions["api/**/*.ts"].includeFiles).toBe("dist/server-ssr/**");
  });
});
