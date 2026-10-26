import { generateFixtures } from "../../../packages/core/schema-fixtures.js";

export { generateFixtures };

export const schemaFixtures = {
  id: "fixtures",
  placeholder: '{\n  "type": "object",\n  "required": ["id", "email"],\n  "properties": {\n    "id": { "type": "integer", "minimum": 1 },\n    "email": { "type": "string", "format": "email" }\n  }\n}',
  run(input) {
    const count = document.querySelector("#fixtures-count")?.value ?? "1";

    try {
      const fixtures = generateFixtures(JSON.parse(input), count);
      const pluralSuffix = fixtures.length === 1 ? "" : "s";
      return {
        output: JSON.stringify(fixtures.length === 1 ? fixtures[0] : fixtures, null, 2),
        status: `${fixtures.length} fixture${pluralSuffix} generado${pluralSuffix}`,
      };
    } catch (error) {
      return { error: `No se pudieron generar fixtures: ${error.message}` };
    }
  },
};
