import { generateUuids, isUuidV4 } from "../../../../packages/core/uuid.js";

function readCount() {
  const value = Number(document.querySelector("#uuid-count")?.value ?? 1);
  return Number.isInteger(value) && value >= 1 && value <= 1000 ? value : 1;
}

export { generateUuids, isUuidV4 };

export const uuidGenerator = {
  id: "uuid",
  placeholder: "550e8400-e29b-41d4-a716-446655440000",
  run(input) {
    const mode = document.querySelector("#uuid-mode")?.value ?? "generate";

    if (mode === "generate") {
      const values = generateUuids(readCount());
      const pluralSuffix = values.length === 1 ? "" : "s";
      return {
        output: values.join("\n"),
        status: `${values.length} UUID v4 generado${pluralSuffix}`,
      };
    }

    const values = input.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
    if (!values.length) return { error: "Añade al menos un UUID para validarlo." };

    const results = values.map((value) => `${isUuidV4(value) ? "✓ Válido" : "✗ Inválido"}  ${value}`);
    const validCount = values.filter(isUuidV4).length;
    return {
      output: results.join("\n"),
      status: `${validCount} de ${values.length} UUID v4 válidos`,
    };
  },
};
