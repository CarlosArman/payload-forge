import { jsonToTypeScript } from "../../../../packages/core/json-to-typescript.js";

export { jsonToTypeScript };

export const typescriptGenerator = {
  id: "typescript",
  placeholder: '{\n  "id": 42,\n  "name": "Ada",\n  "active": true\n}',
  run(input) {
    const rootName = document.querySelector("#typescript-name")?.value.trim() || "Payload";

    try {
      return {
        output: jsonToTypeScript(JSON.parse(input), rootName),
        status: "Tipos TypeScript generados",
      };
    } catch (error) {
      return { error: `JSON inválido: ${error.message}` };
    }
  },
};
