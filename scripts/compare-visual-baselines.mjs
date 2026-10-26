import { access, mkdir, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const baselineDirectory = "web/tests/visual-baselines";
const actualDirectory = "visual-reports";
const diffDirectory = "visual-reports/diff";
const screenshots = ["desktop.png", "mobile.png"];
const maxChangedPixels = 250;
const imageMagickCompare = "/usr/bin/compare";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const missingBaselines = [];
const failures = [];

await mkdir(diffDirectory, { recursive: true });

const comparisons = await Promise.all(screenshots.map(async (screenshot) => ({
  screenshot,
  baseline: join(baselineDirectory, screenshot),
  actual: join(actualDirectory, screenshot),
  diff: join(diffDirectory, screenshot),
  hasBaseline: await exists(join(baselineDirectory, screenshot)),
})));

for (const { screenshot, baseline, actual, diff, hasBaseline } of comparisons) {
  if (!hasBaseline) {
    missingBaselines.push(screenshot);
    continue;
  }

  const result = spawnSync(imageMagickCompare, ["-metric", "AE", baseline, actual, diff], {
    encoding: "utf8",
  });

  const changedPixels = Number.parseInt(result.stderr.trim(), 10);
  if (!Number.isFinite(changedPixels)) {
    console.error(`Could not compare ${screenshot}. Ensure ImageMagick is available in CI.`);
    process.exitCode = 1;
    continue;
  }

  console.log(`${screenshot}: ${changedPixels} changed pixels (maximum ${maxChangedPixels}).`);
  if (changedPixels > maxChangedPixels) failures.push({ screenshot, changedPixels });
}

if (missingBaselines.length) {
  console.warn(`Visual baselines pending: ${missingBaselines.join(", ")}.`);
  console.warn("Review visual-review artifacts and commit the approved images to web/tests/visual-baselines/.");
}

if (failures.length) {
  console.error("Visual regression threshold exceeded:");
  failures.forEach(({ screenshot, changedPixels }) => console.error(`- ${screenshot}: ${changedPixels} changed pixels`));
  process.exitCode = 1;
}

const generatedDiffs = await readdir(diffDirectory);
if (!generatedDiffs.length) console.log("No visual diff images generated.");
