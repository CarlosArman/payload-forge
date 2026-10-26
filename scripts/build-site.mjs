import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = "_site";
const modulesDirectory = join(outputDirectory, "assets", "js", "modules");
const moduleFiles = [
  "compare.js",
  "curl-generator.js",
  "diff.js",
  "encoder-decoder.js",
  "formatter.js",
  "jsonpath-explorer.js",
  "jwt-inspector.js",
  "mock-generator.js",
  "openapi-explorer.js",
  "regex-tester.js",
  "schema-fixtures.js",
  "schema-generator.js",
  "schema-validator.js",
  "secrets-redactor.js",
  "typescript-generator.js",
  "uuid-generator.js",
  "xpath-generator.js",
  "yaml-converter.js",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp("web", outputDirectory, { recursive: true });
await cp("packages", join(outputDirectory, "packages"), { recursive: true });

await Promise.all(moduleFiles.map(async (file) => {
  const path = join(modulesDirectory, file);
  const source = await readFile(path, "utf8");
  const updated = source.replaceAll("../../../../packages/core/", "../../../packages/core/");
  await writeFile(path, updated);
}));

const serviceWorkerPath = join(outputDirectory, "sw.js");
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
await writeFile(serviceWorkerPath, serviceWorker.replaceAll("../packages/", "./packages/"));

console.log(`Built Pages-compatible site in ${outputDirectory}/`);
