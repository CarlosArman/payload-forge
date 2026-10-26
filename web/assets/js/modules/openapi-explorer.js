import { listOpenApiOperations, operationToCurl, operationToFetch } from "../../../../packages/core/openapi.js";

function escapeHtml(value) {
  return value
    .replaceAll("&", String.fromCodePoint(38, 97, 109, 112, 59))
    .replaceAll("<", String.fromCodePoint(38, 108, 116, 59))
    .replaceAll(">", String.fromCodePoint(38, 103, 116, 59));
}

function operationSummary(operation) {
  if (!operation.summary) return "";
  return ` · ${escapeHtml(operation.summary)}`;
}

function operationRow(operation) {
  return `<div class="path-row"><code>${operation.method}</code><code>${escapeHtml(operation.path)}${operationSummary(operation)}</code></div>`;
}

function parameterText(parameter) {
  const requiredMark = parameter.required ? " *" : "";
  return `${parameter.in}: ${parameter.name}${requiredMark}`;
}

function responseText(response) {
  const description = response.description ? ` ${response.description}` : "";
  return `${response.status}${description}`;
}

function operationDetails(operation, index) {
  const parameters = operation.parameters.length
    ? operation.parameters.map(parameterText).join(" · ")
    : "No parameters";
  const requestBody = operation.requestBody
    ? operation.requestBody.contentTypes.join(", ") || "Request body"
    : "No request body";
  const responses = operation.responses.map(responseText).join(" · ") || "No responses";

  return `<details class="operation-card"><summary><code>${operation.method}</code> ${escapeHtml(operation.path)}${operationSummary(operation)}</summary><p><strong>Parameters:</strong> ${escapeHtml(parameters)}</p><p><strong>Body:</strong> ${escapeHtml(requestBody)}</p><p><strong>Responses:</strong> ${escapeHtml(responses)}</p><div class="operation-actions"><button class="copy-path" type="button" data-openapi-snippet="fetch" data-openapi-index="${index}">Copy Fetch</button><button class="copy-path" type="button" data-openapi-snippet="curl" data-openapi-index="${index}">Copy cURL</button></div></details>`;
}

function operationResults(result) {
  const rows = result.operations.map(operationRow).join("");
  const cards = result.operations.map(operationDetails).join("");
  const emptyState = '<p class="result-empty">No se encontraron operaciones.</p>';
  const content = rows || emptyState;
  return `<article class="result-card"><div class="result-card-header">${result.version} · ${result.operations.length} endpoints</div><div class="result-card-body"><input class="path-filter" id="openapi-filter" type="search" placeholder="Filter endpoints…" aria-label="Filter endpoints"><div class="path-list" id="openapi-list">${content}</div><div class="operation-list" id="openapi-details">${cards || emptyState}</div></div></article>`;
}

function operationLine(operation) {
  const summary = operation.summary ? ` — ${operation.summary}` : "";
  return `${operation.method} ${operation.path}${summary}`;
}

function filterOperations(operations, query) {
  const normalized = query.toLowerCase();
  return operations.filter((operation) => `${operation.method} ${operation.path} ${operation.summary} ${operation.tags.join(" ")}`.toLowerCase().includes(normalized));
}

function renderOperationRows(operations) {
  return operations.map(operationRow).join("") || '<p class="result-empty">No matching operations.</p>';
}

function renderOperationCards(operations, sourceOperations) {
  return operations.map((operation) => operationDetails(operation, sourceOperations.indexOf(operation))).join("")
    || '<p class="result-empty">No matching operations.</p>';
}

export { listOpenApiOperations, operationToCurl, operationToFetch };

export const openApiExplorer = {
  id: "openapi",
  placeholder: '{\n  "openapi": "3.0.3",\n  "info": { "title": "Example API", "version": "1.0.0" },\n  "paths": {\n    "/users": { "get": { "summary": "List users" }, "post": { "summary": "Create user" } }\n  }\n}',
  run(input) {
    try {
      const result = listOpenApiOperations(JSON.parse(input));
      const output = result.operations.map(operationLine).join("\n");
      return {
        output,
        status: `${result.operations.length} endpoint(s) detectado(s)`,
        results: operationResults(result),
        bindResults(container, { copy, toast }) {
          container.querySelector("#openapi-filter").addEventListener("input", (event) => {
            const filtered = filterOperations(result.operations, event.target.value);
            container.querySelector("#openapi-list").innerHTML = renderOperationRows(filtered);
            container.querySelector("#openapi-details").innerHTML = renderOperationCards(filtered, result.operations);
          });
          container.addEventListener("click", (event) => {
            const button = event.target.closest("[data-openapi-snippet]");
            if (!button) return;
            const operation = result.operations[Number(button.dataset.openapiIndex)];
            const snippet = button.dataset.openapiSnippet === "fetch"
              ? operationToFetch(operation)
              : operationToCurl(operation);
            copy(snippet).then(() => toast(`${button.dataset.openapiSnippet} copied`, "success"));
          });
        },
      };
    } catch (error) {
      return { error: `No se pudo explorar el documento: ${error.message}` };
    }
  },
};
