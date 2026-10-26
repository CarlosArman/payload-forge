import { validateSchema } from "../../../packages/core/schema-validator.js";
import { escapeHtml } from "../utils.js";

function validationResults(errors) {
  if (!errors.length) {
    return `<article class="result-card"><div class="result-card-header">Validation</div><div class="result-card-body"><p class="success-text">✓ El payload cumple el JSON Schema.</p></div></article>`;
  }

  const rows = errors.map((error) => `<div class="path-row"><code>${escapeHtml(error.path)}</code><span>${escapeHtml(error.message)}</span><button class="copy-path" type="button" data-schema-path="${escapeHtml(error.path)}">Copy path</button></div>`).join("");
  return `<article class="result-card"><div class="result-card-header">${errors.length} validation error(s)</div><div class="result-card-body"><div class="path-list">${rows}</div></div></article>`;
}

export { validateSchema };

export const schemaValidator = {
  id: "validator",
  placeholder: '{\n  "email": "ada@example.com",\n  "age": 42\n}',
  run(input) {
    const schemaInput = document.querySelector("#validation-schema")?.value ?? "";

    try {
      const value = JSON.parse(input);
      const schema = JSON.parse(schemaInput);
      const errors = validateSchema(value, schema);
      return {
        output: errors.length
          ? errors.map((error) => `${error.path}: ${error.message}`).join("\n")
          : "El payload cumple el JSON Schema.",
        status: errors.length ? `${errors.length} error(es) de validación` : "Payload válido",
        results: validationResults(errors),
        bindResults(container, { copy, toast }) {
          container.addEventListener("click", (event) => {
            const path = event.target.closest("[data-schema-path]")?.dataset.schemaPath;
            if (path) copy(path).then(() => toast("JSONPath copiado", "success"));
          });
        },
      };
    } catch (error) {
      return { error: `JSON inválido: ${error.message}` };
    }
  },
};
