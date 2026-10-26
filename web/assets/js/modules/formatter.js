import { formatJson, minifyJson, parseJson } from "../../../../packages/core/json.js";

export { formatJson, minifyJson, parseJson };

export const formatter = {
  id: "formatter",
  category: "Data tool",
  title: "JSON Formatter",
  description: "Formatea, compacta y valida JSON con diagnóstico preciso de sintaxis.",
  inputLabel: "Input JSON",
  outputLabel: "Formatted JSON",
  executeLabel: "Beautify JSON",
  placeholder: '{"service":"PayloadForge","active":true,"tools":["schema","diff"]}',
  options: `<label class="option-control">Modo <select id="format-mode"><option value="beautify">Beautify</option><option value="minify">Minify</option><option value="validate">Validate only</option></select></label>`,
  run(input) {
    const parsed = parseJson(input);
    if (parsed.error) return { error: parsed.error };

    const mode = document.querySelector("#format-mode")?.value ?? "beautify";
    if (mode === "validate") return { output: "✓ JSON válido. No se encontraron errores de sintaxis.", status: "JSON is valid" };

    const output = mode === "minify" ? minifyJson(parsed.value) : formatJson(parsed.value);
    const status = mode === "minify" ? "JSON minified" : "JSON beautified";
    return { output, status };
  },
};
