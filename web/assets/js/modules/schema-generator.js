import { inferSchema, removeRequiredFields } from "../../../../packages/core/schema-generator.js";
import { formatJson, parseJson } from "../utils.js";

export { inferSchema };

export const schemaGenerator = {
  id: "schema",
  category: "Data tool",
  title: "JSON Schema Generator",
  description: "Genera un JSON Schema preciso a partir de cualquier payload JSON válido.",
  inputLabel: "Input JSON",
  outputLabel: "JSON Schema",
  executeLabel: "Generate schema",
  placeholder: '{\n  "user": {\n    "id": 42,\n    "active": true\n  }\n}',
  options: `<label class="option-control"><input id="schema-required" type="checkbox" checked> Marcar campos requeridos</label>`,
  run(input) {
    const parsed = parseJson(input);
    if (parsed.error) return { error: parsed.error };

    const schema = { $schema: "https://json-schema.org/draft/2020-12/schema", ...inferSchema(parsed.value) };
    const includeRequired = document.querySelector("#schema-required")?.checked;
    if (!includeRequired) removeRequiredFields(schema);

    return { output: formatJson(schema), status: "Schema generated successfully" };
  },
};
