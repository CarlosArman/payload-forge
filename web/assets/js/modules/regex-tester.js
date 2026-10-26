import { testRegex } from "../../../../packages/core/regex.js";

const MAX_MATCHES = 500;

const HTML_ENTITIES = Object.freeze({
  amp: String.fromCodePoint(38, 97, 109, 112, 59),
  lt: String.fromCodePoint(38, 108, 116, 59),
  gt: String.fromCodePoint(38, 103, 116, 59),
  quote: String.fromCodePoint(38, 113, 117, 111, 116, 59),
});

function escapeHtml(value) {
  return value
    .replaceAll("&", HTML_ENTITIES.amp)
    .replaceAll("<", HTML_ENTITIES.lt)
    .replaceAll(">", HTML_ENTITIES.gt)
    .replaceAll('"', HTML_ENTITIES.quote);
}

function matchResults(result) {
  if (!result.matched) {
    return `<article class="result-card"><div class="result-card-header">Coincidencias</div><div class="result-card-body"><p class="result-empty">No se encontraron coincidencias.</p></div></article>`;
  }

  const rows = result.matches.map((match, index) => {
    const groups = match.groups.filter((group) => group !== undefined);
    const groupText = groups.length ? ` · Grupos: ${groups.map((group) => escapeHtml(group)).join(", ")}` : "";
    return `<div class="path-row"><code>#${index + 1} · ${match.index}</code><code>${escapeHtml(match.value)}${groupText}</code></div>`;
  }).join("");

  const warning = result.truncated
    ? `<p class="result-warning">Se muestran las primeras ${MAX_MATCHES} coincidencias.</p>`
    : "";

  return `<article class="result-card"><div class="result-card-header">Coincidencias (${result.matches.length})</div><div class="result-card-body">${warning}<div class="path-list">${rows}</div></div></article>`;
}

function regexOptions() {
  const flags = ["g", "i", "m", "s", "u"];
  return flags
    .map((flag) => `<label class="option-control"><input type="checkbox" data-regex-flag="${flag}"${flag === "g" ? " checked" : ""}> ${flag}</label>`)
    .join("");
}

function matchStatus(result) {
  if (!result.matched) return "Sin coincidencias";
  const pluralSuffix = result.matches.length === 1 ? "" : "s";
  return `${result.matches.length} coincidencia${pluralSuffix} encontrada${pluralSuffix}`;
}

export { parseRegex, testRegex } from "../../../../packages/core/regex.js";

export const regexTester = {
  id: "regex",
  placeholder: "Escribe el texto donde quieres buscar coincidencias.",
  options: String.raw`<label class="option-control">Patrón <input id="regex-pattern" type="text" value="\b\w+@\w+\.\w+\b" spellcheck="false"></label>${regexOptions()}`,
  run(input) {
    const pattern = document.querySelector("#regex-pattern")?.value ?? "";
    const flags = [...document.querySelectorAll("[data-regex-flag]:checked")]
      .map((inputElement) => inputElement.dataset.regexFlag)
      .join("");

    if (!pattern) return { error: "Añade un patrón de expresión regular." };
    if (!input) return { error: "Añade texto para probar la expresión regular." };

    try {
      const result = testRegex(pattern, input, flags);
      const output = result.matches.map((match) => match.value).join("\n");
      return { output, status: matchStatus(result), results: matchResults(result) };
    } catch (error) {
      return { error: error.message };
    }
  },
};
