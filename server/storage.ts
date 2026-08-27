import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve(import.meta.dirname, "..", "client", "public");

function normalizeKey(relKey: string) {
  return relKey.replace(/^\/+/, "").replace(/\.\.+/g, ".");
}

function appendHashSuffix(relKey: string) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const dot = relKey.lastIndexOf(".");
  return dot === -1 ? `${relKey}_${hash}` : `${relKey.slice(0, dot)}_${hash}${relKey.slice(dot)}`;
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, _contentType?: string) {
  const key = appendHashSuffix(normalizeKey(relKey));
  const publicKey = path.join("uploads", key);
  const destination = path.join(publicDir, publicKey);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, data);
  return { key: publicKey, url: `/${publicKey.replaceAll(path.sep, "/")}` };
}

export async function storageGet(relKey: string) {
  const key = normalizeKey(relKey);
  return { key, url: `/${key}` };
}

export async function storageGetSignedUrl(relKey: string) {
  return `/${normalizeKey(relKey)}`;
}
