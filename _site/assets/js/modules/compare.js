import { collectDifferences, splitComparisonDocuments } from "../../../packages/core/json-compare.js";
import { formatJson, parseJson } from "../../../packages/core/json.js";
import { escapeHtml } from "../utils.js";

export { collectDifferences, splitComparisonDocuments };

export function differencesView(differences) {
  const stats = ["added", "removed", "changed"].map((type) => ({
    type,
    count: differences.filter((item) => item.type === type).length,
    label: { added: "Added", removed: "Removed", changed: "Modified" }[type],
  }));
  const cards = stats.map(({ type, count, label }) => `<div class="stat-card ${type}"><span>${label}</span><strong>${count}</strong></div>`).join("");
  const filters = ["all", "added", "removed", "changed"].map((type) =>
    `<button class="diff-filter${type === "all" ? " is-active" : ""}" type="button" data-diff-filter="${type}" aria-pressed="${type === "all"}">${type === "all" ? "All" : type}</button>`
  ).join("");
  const rows = differences.map((item, index) =>
    `<div class="diff-row ${item.type}" data-diff-index="${index}" data-diff-type="${item.type}"><span class="diff-type">${item.type}</span><code>${escapeHtml(item.path)}</code><code>${escapeHtml(item.before === undefined ? "—" : formatJson(item.before))}</code><code>${escapeHtml(item.after === undefined ? "—" : formatJson(item.after))}</code></div>`
  ).join("") || `<div class="diff-row"><span class="diff-type">Equal</span><code>$</code><code>—</code><code>No differences</code></div>`;
  return `<div class="stats-grid">${cards}</div><div class="diff-toolbar" role="toolbar" aria-label="Navegación y filtros de diferencias"><div class="diff-filters">${filters}</div><div class="diff-navigation"><button class="editor-action" type="button" data-diff-nav="previous" ${differences.length ? "" : "disabled"}>← Prev</button><span id="diff-position" aria-live="polite">${differences.length ? "1 / " + differences.length : "0 / 0"}</span><button class="editor-action" type="button" data-diff-nav="next" ${differences.length ? "" : "disabled"}>Next →</button></div></div><div class="diff-list" role="region" aria-label="Lista de diferencias">${rows}</div>`;
}

function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function bindDifferenceResults(container) {
  let filter = "all";
  let activeIndex = 0;
  const rows = () => [...container.querySelectorAll("[data-diff-index]")];
  const visibleRows = () => rows().filter((row) => filter === "all" || row.dataset.diffType === filter);

  const render = () => {
    const visible = visibleRows();
    if (activeIndex >= visible.length) activeIndex = Math.max(visible.length - 1, 0);
    rows().forEach((row) => row.classList.remove("is-focused"));
    visible.forEach((row, index) => row.classList.toggle("is-focused", index === activeIndex));
    container.querySelector("#diff-position").textContent = visible.length ? `${activeIndex + 1} / ${visible.length}` : "0 / 0";
  };

  container.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-diff-filter]");
    if (filterButton) {
      filter = filterButton.dataset.diffFilter;
      activeIndex = 0;
      container.querySelectorAll("[data-diff-filter]").forEach((button) => {
        const active = button === filterButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      rows().forEach((row) => row.classList.toggle("is-filtered", filter !== "all" && row.dataset.diffType !== filter));
      render();
      return;
    }

    const direction = event.target.closest("[data-diff-nav]")?.dataset.diffNav;
    if (!direction) return;
    const visible = visibleRows();
    if (!visible.length) return;
    activeIndex = direction === "next" ? (activeIndex + 1) % visible.length : (activeIndex - 1 + visible.length) % visible.length;
    render();
    visible[activeIndex].scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
  });

  render();
}

export const jsonCompare = {
  id: "compare",
  category: "Validation tool",
  title: "JSON Compare",
  description: "Compara dos JSON y encuentra campos agregados, eliminados o modificados.",
  inputLabel: "Base JSON",
  outputLabel: "Comparison JSON",
  executeLabel: "Compare JSON",
  placeholder: '{\n  "id": 1,\n  "status": "draft"\n}\n\n---\n\n{\n  "id": 1,\n  "status": "published"\n}',
  options: `<span class="option-control">Separa ambos JSON con una línea <strong>---</strong></span>`,
  run(input) {
    const documents = splitComparisonDocuments(input);
    if (documents.error) return documents;
    const left = parseJson(documents.left);
    const right = parseJson(documents.right);
    if (left.error) return { error: `Documento base: ${left.error}` };
    if (right.error) return { error: `Documento comparado: ${right.error}` };
    const differences = collectDifferences(left.value, right.value);
    return {
      output: formatJson(differences),
      status: `${differences.length} differences found`,
      results: differencesView(differences),
      bindResults: bindDifferenceResults,
    };
  },
};
