import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const coreSource = resolve("packages/core");
const targets = [
  resolve("browser-extension/core"),
  resolve("vscode-extension/core"),
];

await Promise.all(targets.map(async (target) => {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await cp(coreSource, target, { recursive: true });
}));

console.log("Synced packages/core to extension packages.");
