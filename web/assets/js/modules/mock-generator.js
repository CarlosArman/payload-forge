import { formatJson } from "../../../../packages/core/json.js";
import { generateMockRecords } from "../../../../packages/core/mock-data.js";

export { generateMockRecords };

export const mockGenerator = {
  id: "mock",
  category: "Testing tool",
  title: "Mock Data Generator",
  description: "Crea fixtures realistas para pruebas API, QA Automation y desarrollo.",
  inputLabel: "Custom fields (optional JSON)",
  outputLabel: "Generated records",
  executeLabel: "Generate data",
  placeholder: '{\n  "team": "platform",\n  "environment": "staging"\n}',
  options: `<label class="option-control">Registros <input id="mock-count" type="number" min="1" max="1000" value="10" aria-label="Cantidad de registros"></label><span class="option-control">Incluye: UUID · contacto · dirección · fecha</span>`,
  run(input) {
    const count = Number(document.querySelector("#mock-count")?.value ?? 10);
    if (!Number.isInteger(count) || count < 1 || count > 1000) {
      return { error: "La cantidad debe estar entre 1 y 1000 registros." };
    }

    let custom = {};
    if (input.trim()) {
      try {
        custom = JSON.parse(input);
      } catch {
        return { error: "Los campos personalizados deben ser un objeto JSON válido." };
      }
      if (!custom || Array.isArray(custom) || typeof custom !== "object") {
        return { error: "Los campos personalizados deben ser un objeto JSON." };
      }
    }

    const generated = generateMockRecords(count, custom);
    return { output: formatJson(generated), status: `${count} mock records generated` };
  },
};
