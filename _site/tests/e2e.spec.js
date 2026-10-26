import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const baseURL = process.env.PAYLOADFORGE_E2E_URL ?? "http://127.0.0.1:4173";

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("persists favorites and exposes them in quick access", async ({ page }) => {
  const favorite = page.locator("#tool-favorite-toggle");
  await expect(favorite).toHaveAttribute("aria-pressed", "false");

  await favorite.click();
  await expect(favorite).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#favorite-tools-list")).toContainText("Generador de JSON Schema");

  await page.reload();
  await expect(page.locator("#tool-favorite-toggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#favorite-tools-list")).toContainText("Generador de JSON Schema");
});

test("records recently visited tools", async ({ page }) => {
  await page.locator('[data-tool="formatter"]').first().click();
  await expect(page.locator("#tool-title")).toContainText("Formateador JSON");
  await expect(page.locator("#recent-tools-list")).toContainText("Formateador JSON");
});

test("collapses onboarding persistently", async ({ page }) => {
  const guide = page.locator("#workflow-guide");
  await page.locator("#workflow-guide-toggle").click();
  await expect(guide).toHaveClass(/is-collapsed/);
  await expect(page.locator("#workflow-guide-toggle")).toHaveAttribute("aria-expanded", "false");

  await page.reload();
  await expect(guide).toHaveClass(/is-collapsed/);
});

test("translates the complete onboarding content", async ({ page }) => {
  await page.locator("#language-select").selectOption("en");

  await expect(page.locator("#workflow-guide-title")).toHaveText("Paste, run, and reuse");
  await expect(page.locator(".workflow-guide-eyebrow")).toHaveText("QUICK FLOW");
  await expect(page.locator(".workflow-steps")).toContainText("Paste or import a payload");
  await expect(page.locator(".workflow-shortcuts")).toHaveText("Search tools");
});

test("reports the input cursor line and column", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill("first\nsecond");
  await editor.evaluate((node) => {
    node.focus();
    node.setSelectionRange(9, 9);
    node.dispatchEvent(new Event("select"));
  });

  await expect(page.locator("#input-position")).toHaveText("Línea 2, columna 4");
});

test("finds and selects input editor matches with keyboard navigation", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill('{"service":"PayloadForge","owner":"PayloadForge"}');
  await editor.press("Control+f");

  await expect(page.locator("#editor-find")).toBeVisible();
  await page.locator("#editor-find-query").fill("PayloadForge");
  await expect(page.locator("#editor-find-count")).toHaveText("1/2");
  await expect(editor).toBeFocused();

  await page.locator("#editor-find-query").press("Enter");
  await expect(page.locator("#editor-find-count")).toHaveText("2/2");
  await page.locator("#editor-find-query").press("Escape");
  await expect(page.locator("#editor-find")).toBeHidden();
});

test("translates local preset management to English", async ({ page }) => {
  await page.locator("#language-select").selectOption("en");
  await expect(page.locator("#save-preset-button")).toHaveText("Save preset");
  await expect(page.locator("#load-preset-button")).toHaveText("Load preset");

  await page.locator("#save-preset-button").click();
  await expect(page.locator("#preset-title")).toHaveText("Save local preset");
  await expect(page.locator("#preset-description")).toContainText("Results are not stored");
  await expect(page.locator("#preset-name")).toHaveAttribute("placeholder", "E.g. User payload");
  await expect(page.locator("#preset-save")).toHaveText("Save locally");
});

test("opens local preset saving with Ctrl/Cmd+S", async ({ page }) => {
  await page.locator("#input-editor").fill('{"source":"shortcut"}');
  await page.locator("#input-editor").press("Control+s");

  await expect(page.locator("#preset-dialog")).toBeVisible();
  await expect(page.locator("#preset-name")).toBeFocused();
});

test("opens local preset saving from the Command Palette", async ({ page }) => {
  await page.locator("#input-editor").fill('{"source":"palette"}');
  await page.locator("#input-editor").press("Control+k");
  await expect(page.locator("#command-dialog")).toBeVisible();

  await page.locator("#command-search").fill("Guardar preset local");
  await page.locator("#command-search").press("Enter");

  await expect(page.locator("#command-dialog")).toBeHidden();
  await expect(page.locator("#preset-dialog")).toBeVisible();
  await expect(page.locator("#preset-name")).toBeFocused();
});

test("saves a local input preset only after explicit confirmation", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill('{"environment":"staging"}');
  await page.locator("#save-preset-button").click();

  await expect(page.locator("#preset-dialog")).toBeVisible();
  await expect(page.locator("#preset-name")).toBeFocused();
  await page.locator("#preset-name").fill("Staging payload");
  await page.locator("#preset-save").click();

  await expect(page.locator("#preset-dialog")).toBeHidden();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("payloadforge.presets")));
  expect(stored.schema[0]).toMatchObject({
    name: "Staging payload",
    input: '{"environment":"staging"}',
  });
});

test("loads and removes a local preset with explicit deletion confirmation", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("payloadforge.presets", JSON.stringify({
      schema: [{ name: "Reusable user", input: '{"user":"Ada"}', at: "2026-01-01T00:00:00.000Z" }],
    }));
  });
  await page.reload();

  await page.locator("#load-preset-button").click();
  await expect(page.locator("#presets-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Reusable user" }).click();

  await expect(page.locator("#input-editor")).toHaveValue('{"user":"Ada"}');
  await expect(page.locator("#presets-dialog")).toBeHidden();

  await page.locator("#load-preset-button").click();
  const remove = page.getByRole("button", { name: "Eliminar" });
  await remove.click();
  await expect(remove).toHaveText("¿Confirmar?");
  await remove.click();
  await expect(page.locator("#presets-list")).toContainText("No hay presets guardados");
});

test("translates bulk preset cleanup to English", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("payloadforge.presets", JSON.stringify({
      schema: [{ name: "English preset", input: '{"language":"en"}', at: "2026-01-01T00:00:00.000Z" }],
    }));
  });
  await page.reload();
  await page.locator("#language-select").selectOption("en");
  await page.locator("#load-preset-button").click();

  const clear = page.locator("#presets-clear");
  await expect(clear).toHaveText("Clear presets for this tool");
  await clear.click();
  await expect(clear).toHaveText("Confirm clear?");
});

test("exports only active-tool preset inputs in the portable format", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("payloadforge.presets", JSON.stringify({
      schema: [{ name: "Exported preset", input: '{"exported":true}', at: "2026-01-01T00:00:00.000Z" }],
    }));
  });
  await page.reload();
  await page.locator("#load-preset-button").click();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#presets-export").click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("payloadforge-schema-presets.json");
  const downloadPath = await download.path();
  const exported = JSON.parse(await readFile(downloadPath, "utf8"));
  expect(exported).toEqual({
    version: 1,
    tool: "schema",
    presets: [{ name: "Exported preset", input: '{"exported":true}', at: "2026-01-01T00:00:00.000Z" }],
  });
  expect(JSON.stringify(exported)).not.toContain("output");
});

test("imports valid active-tool presets and rejects mismatched files", async ({ page }) => {
  await page.locator("#load-preset-button").click();
  const importFile = page.locator("#presets-import-file");

  await importFile.setInputFiles({
    name: "schema-presets.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      version: 1,
      tool: "schema",
      presets: [{ name: "Imported preset", input: '{"imported":true}', at: "2026-01-01T00:00:00.000Z" }],
    })),
  });
  await expect(page.locator("#presets-list")).toContainText("Imported preset");

  await importFile.setInputFiles({
    name: "wrong-tool.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ version: 1, tool: "formatter", presets: [] })),
  });
  await expect(page.locator("#presets-list")).toContainText("Imported preset");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("payloadforge.presets")));
  expect(stored.schema).toHaveLength(1);
});

test("rejects preset import files above the local 1 MB limit", async ({ page }) => {
  await page.locator("#load-preset-button").click();
  const oversized = JSON.stringify({
    version: 1,
    tool: "schema",
    presets: [{ name: "Oversized", input: "x".repeat(1024 * 1024), at: "2026-01-01T00:00:00.000Z" }],
  });

  await page.locator("#presets-import-file").setInputFiles({
    name: "oversized-presets.json",
    mimeType: "application/json",
    buffer: Buffer.from(oversized),
  });

  await expect(page.locator("#presets-list")).toContainText("No hay presets guardados");
  const stored = await page.evaluate(() => localStorage.getItem("payloadforge.presets"));
  expect(stored).toBeNull();
});

test("clears only presets for the active tool after confirmation", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("payloadforge.presets", JSON.stringify({
      schema: [{ name: "Schema preset", input: '{"schema":true}', at: "2026-01-01T00:00:00.000Z" }],
      formatter: [{ name: "Formatter preset", input: '{"format":true}', at: "2026-01-01T00:00:00.000Z" }],
    }));
  });
  await page.reload();

  await page.locator("#load-preset-button").click();
  const clear = page.locator("#presets-clear");
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(clear).toHaveText("¿Confirmar limpieza?");
  await clear.click();

  await expect(page.locator("#presets-list")).toContainText("No hay presets guardados");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("payloadforge.presets")));
  expect(stored.schema).toBeUndefined();
  expect(stored.formatter).toHaveLength(1);
});

test("reuses a generated result as the next input locally", async ({ page }) => {
  await page.locator('[data-tool="formatter"]').first().click();
  const input = page.locator("#input-editor");
  const output = page.locator("#output-editor");

  await input.fill('{"service":"PayloadForge"}');
  await page.locator("#execute-button").click();
  await expect(output).toHaveValue(/PayloadForge/);

  const reuse = page.locator("#use-output-button");
  await expect(reuse).toBeEnabled();
  await reuse.click();

  await expect(input).toHaveValue(/PayloadForge/);
  await expect(output).toHaveValue("");
  await expect(input).toBeFocused();
  await expect(reuse).toBeDisabled();
});

test("goes directly to a requested editor line", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill("first\nsecond\nthird\nfourth");
  await editor.press("Control+g");

  await expect(page.locator("#editor-find")).toBeVisible();
  await expect(page.locator("#editor-goto-line")).toBeFocused();
  await page.locator("#editor-goto-line").fill("3");
  await page.locator("#editor-goto-line").press("Enter");

  await expect(editor).toBeFocused();
  const selectionStart = await editor.evaluate((node) => node.selectionStart);
  expect(selectionStart).toBe(13);
});

test("navigates to syntax errors by line and column", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill('{\n  "name": "Ada",\n  "active":\n}');
  await page.locator("#execute-button").click();

  await expect(editor).toHaveAttribute("aria-invalid", "true");
  await expect(editor).toBeFocused();
  const selectionStart = await editor.evaluate((node) => node.selectionStart);
  expect(selectionStart).toBeGreaterThan(0);
  await expect(page.locator("#input-status")).toContainText(/línea|line/i);
});

test("marks invalid input and restores the editor as the recovery target", async ({ page }) => {
  const editor = page.locator("#input-editor");
  await editor.fill('{"invalid": }');
  await page.locator("#execute-button").click();

  await expect(editor).toHaveAttribute("aria-invalid", "true");
  await expect(editor).toBeFocused();
  await expect(page.locator(".editor-input")).toHaveClass(/has-error/);

  await editor.fill('{"valid": true}');
  await expect(editor).not.toHaveAttribute("aria-invalid");
});
