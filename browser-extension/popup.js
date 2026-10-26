import { encodeBase64, formatJson, parseJson, redactSecrets } from "./core/index.js";

const input = document.querySelector("#input");
const output = document.querySelector("#output");
const statusElement = document.querySelector("#status");

function transformInput(action, value) {
  if (action === "format") {
    const parsed = parseJson(value);
    if (parsed.error) throw new Error(parsed.error);
    return formatJson(parsed.value);
  }
  if (action === "base64") return encodeBase64(value);
  if (action === "redact") return redactSecrets(value).output;
  throw new Error("Choose a valid action.");
}

function run(action) {
  try {
    const value = input.value;
    if (!value.trim()) throw new Error("Paste or select text first.");

    output.value = transformInput(action, value);
    statusElement.textContent = "Done locally.";
  } catch (error) {
    statusElement.textContent = error.message;
  }
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => run(button.dataset.action));
});

document.querySelector("#copy").addEventListener("click", async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  statusElement.textContent = "Result copied.";
});

chrome.storage.local.get("selectedText", ({ selectedText }) => {
  if (!selectedText) return;
  input.value = selectedText;
  chrome.storage.local.remove("selectedText");
  statusElement.textContent = "Loaded selected text.";
});
