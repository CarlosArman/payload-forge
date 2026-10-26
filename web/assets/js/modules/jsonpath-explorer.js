import { collectPaths, MAX_EXPLORER_NODES } from "../../../../packages/core/jsonpath.js";
import { parseJson, escapeHtml } from "../utils.js";

function renderPaths(paths) {
  return paths.map((path) => `<div class="path-row"><code>${escapeHtml(path)}</code><button class="copy-path" data-copy-path="${escapeHtml(path)}" aria-label="Copiar ${escapeHtml(path)}">Copy</button></div>`).join("");
}

function pathWarning(truncated) {
  if (!truncated) return "";
  return `<p class="warning-text">Se muestran los primeros ${MAX_EXPLORER_NODES} paths para mantener el rendimiento.</p>`;
}

function pathResults(paths, truncated) {
  const nodeCount = truncated ? `${MAX_EXPLORER_NODES}+` : String(paths.length);
  return `<div class="result-card"><div class="result-card-header"><span>Path navigator · ${nodeCount} nodes</span></div><div class="result-card-body">${pathWarning(truncated)}<input class="path-filter" id="path-filter" type="search" placeholder="Filtrar paths…" aria-label="Filtrar JSONPath"><div class="path-list" id="path-list">${renderPaths(paths)}</div></div></div>`;
}

export { collectPaths };

export const jsonPathExplorer = {
  id: "jsonpath",
  category: "Data tool",
  title: "JSONPath Explorer",
  description: "Explora cada nodo de un payload y obtén sus JSONPath copiables.",
  inputLabel: "Input JSON",
  outputLabel: "Paths (text)",
  executeLabel: "Explore paths",
  placeholder: '{\n  "user": { "id": 42, "profile": { "name": "Ada" } }\n}',
  run(input) {
    const parsed = parseJson(input);
    if (parsed.error) return { error: parsed.error };
    const paths = collectPaths(parsed.value);
    const truncated = paths.length === MAX_EXPLORER_NODES;
    const summary = truncated ? `${MAX_EXPLORER_NODES}+ paths found (limited)` : `${paths.length} paths found`;
    return {
      output: paths.join("\n"),
      status: summary,
      results: pathResults(paths, truncated),
      bindResults(container, { copy, toast }) {
        container.querySelector("#path-filter").addEventListener("input", (event) => {
          const query = event.target.value.toLowerCase();
          container.querySelector("#path-list").innerHTML = renderPaths(paths.filter((path) => path.toLowerCase().includes(query)));
        });
        container.addEventListener("click", (event) => {
          const path = event.target.closest("[data-copy-path]")?.dataset.copyPath;
          if (path) copy(path).then(() => toast("JSONPath copiado", "success"));
        });
      },
    };
  },
};
