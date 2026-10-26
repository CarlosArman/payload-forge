import { getXpaths, MAX_XPATH_NODES, parseXml } from "../../../packages/core/xpath.js";
import { escapeHtml } from "../utils.js";

function rows(paths) {
  return paths.map((path) => `<div class="path-row"><code>${escapeHtml(path)}</code><button class="copy-path" data-copy-path="${escapeHtml(path)}" aria-label="Copiar ${escapeHtml(path)}">Copy</button></div>`).join("");
}

function xpathWarning(truncated) {
  if (!truncated) return "";
  return `<p class="warning-text">Se muestran los primeros ${MAX_XPATH_NODES} XPath para mantener el rendimiento.</p>`;
}

function xpathResults(root, paths, truncated) {
  const nodeCount = truncated ? `${MAX_XPATH_NODES}+` : String(paths.length);
  return `<div class="result-card"><div class="result-card-header"><span>XML tree · ${root.tagName}</span><span>${nodeCount} nodes</span></div><div class="result-card-body">${xpathWarning(truncated)}<input class="path-filter" id="path-filter" type="search" placeholder="Buscar XPath…" aria-label="Buscar XPath"><div class="path-list" id="path-list">${rows(paths)}</div></div></div>`;
}

export { getXpaths, parseXml };

export const xpathGenerator = {
  id: "xpath",
  category: "Transform tool",
  title: "XML → XPath Generator",
  description: "Genera XPath indexados de elementos y atributos, con soporte para nombres con namespace.",
  inputLabel: "Input XML",
  outputLabel: "Generated XPath",
  executeLabel: "Generate XPath",
  placeholder: '<catalog>\n  <book id="1"><title>Payload Engineering</title></book>\n  <book id="2"><title>API Quality</title></book>\n</catalog>',
  run(input) {
    const parsed = parseXml(input);
    if (parsed.error) return parsed;

    const root = parsed.value.documentElement;
    const paths = getXpaths(root);
    const truncated = paths.length === MAX_XPATH_NODES;
    const summary = truncated ? `${MAX_XPATH_NODES}+ XPath generated (limited)` : `${paths.length} XPath generated`;
    return {
      output: paths.join("\n"),
      status: summary,
      results: xpathResults(root, paths, truncated),
      bindResults(container, { copy, toast }) {
        container.querySelector("#path-filter").addEventListener("input", (event) => {
          const query = event.target.value.toLowerCase();
          container.querySelector("#path-list").innerHTML = rows(paths.filter((path) => path.toLowerCase().includes(query)));
        });
        container.addEventListener("click", (event) => {
          const path = event.target.closest("[data-copy-path]")?.dataset.copyPath;
          if (path) copy(path).then(() => toast("XPath copiado", "success"));
        });
      },
    };
  },
};
