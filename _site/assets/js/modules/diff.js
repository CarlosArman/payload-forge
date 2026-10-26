import { collectDifferences, splitComparisonDocuments } from "../../../packages/core/json-compare.js";
import { formatJson, parseJson } from "../../../packages/core/json.js";
import { differencesView, bindDifferenceResults } from "./compare.js";

function patchSign(type) {
  if (type === "added") return "+";
  if (type === "removed") return "-";
  return "~";
}

function patchValue(item) {
  return item.type === "removed" ? item.before : item.after;
}

export const jsonDiff = {
  id: "diff",
  category: "Validation tool",
  title: "JSON Diff",
  description: "Revisa cambios de payloads con una vista semántica tipo Git.",
  inputLabel: "Before JSON",
  outputLabel: "Git-style patch",
  executeLabel: "Build diff",
  placeholder: '{\n  "version": 1,\n  "enabled": false\n}\n\n---\n\n{\n  "version": 2,\n  "enabled": true,\n  "environment": "production"\n}',
  options: `<span class="option-control"><span class="success-text">● Added</span> <span class="danger-text">● Removed</span> <span class="warning-text">● Modified</span></span>`,
  run(input) {
    const documents = splitComparisonDocuments(input);
    if (documents.error) return documents;
    const before = parseJson(documents.left);
    const after = parseJson(documents.right);
    if (before.error) return { error: `Documento anterior: ${before.error}` };
    if (after.error) return { error: `Documento nuevo: ${after.error}` };
    const differences = collectDifferences(before.value, after.value);
    const patch = differences.map((item) => `${patchSign(item.type)} ${item.path}\n  ${formatJson(patchValue(item))}`).join("\n\n");
    return {
      output: patch || "No changes detected.",
      status: differences.length ? `${differences.length} changes in patch` : "Documents are identical",
      results: differencesView(differences),
      bindResults: bindDifferenceResults,
    };
  },
};
