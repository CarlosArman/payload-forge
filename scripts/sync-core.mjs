import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coreSource = resolve(repositoryRoot, "packages/core");
const targets = [
  resolve(repositoryRoot, "browser-extension/core"),
  resolve(repositoryRoot, "vscode-extension/core"),
];

await Promise.all(targets.map(async (target) => {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(coreSource, target, { recursive: true });
}));

console.log("Synced packages/core to extension packages.");
