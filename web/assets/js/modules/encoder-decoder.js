import { decodeBase64, encodeBase64 } from "../../../../packages/core/base64.js";

export { decodeBase64, encodeBase64 };

export const encoderDecoder = {
  id: "encoder",
  placeholder: "PayloadForge: transforma texto localmente",
  run(input) {
    const mode = document.querySelector("#encoder-mode")?.value ?? "base64-encode";

    try {
      const operations = {
        "base64-encode": () => encodeBase64(input),
        "base64-decode": () => decodeBase64(input),
        "base64url-encode": () => encodeBase64(input, true),
        "base64url-decode": () => decodeBase64(input, true),
        "url-encode": () => encodeURIComponent(input),
        "url-decode": () => decodeURIComponent(input),
      };
      const output = operations[mode]?.();

      if (output === undefined) return { error: "Selecciona una operación válida." };
      return { output, status: "Transformación completada localmente" };
    } catch (error) {
      return { error: error.message };
    }
  },
};
