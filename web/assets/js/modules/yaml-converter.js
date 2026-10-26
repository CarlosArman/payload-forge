import { formatJson, parseJson } from "../../../../packages/core/json.js";
import { fromYaml, toYaml } from "../../../../packages/core/yaml.js";

export { fromYaml, toYaml };

export const yamlConverter = {
  id: "yaml",
  category: "Transform tool",
  title: "JSON ↔ YAML Converter",
  description: "Convierte payloads entre JSON y YAML localmente, sin enviar datos fuera del navegador.",
  inputLabel: "Input",
  outputLabel: "Converted output",
  executeLabel: "Convert",
  placeholder: '{\n  "service": "PayloadForge",\n  "ports": [80, 443],\n  "enabled": true\n}',
  options: `<label class="option-control">Conversión <select id="yaml-direction"><option value="json-to-yaml">JSON → YAML</option><option value="yaml-to-json">YAML → JSON</option></select></label>`,
  run(input) {
    const direction = document.querySelector("#yaml-direction")?.value ?? "json-to-yaml";
    if (direction === "json-to-yaml") {
      const parsed = parseJson(input);
      return parsed.error ? { error: parsed.error } : { output: toYaml(parsed.value), status: "Converted JSON to YAML" };
    }

    try {
      return { output: formatJson(fromYaml(input)), status: "Converted YAML to JSON" };
    } catch (error) {
      return { error: `No fue posible convertir YAML: ${error.message}` };
    }
  },
};
