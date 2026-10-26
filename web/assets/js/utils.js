export const MAX_EXPLORER_NODES = 1000;
export const formatJson = (value) => JSON.stringify(value, null, 2);

export function parseJson(input) {
  try {
    return { value: JSON.parse(input) };
  } catch (error) {
    const match = error.message.match(/position (\d+)/i);
    if (!match) return { error: "JSON inválido. Revisa comas, comillas y llaves." };
    const position = Number(match[1]);
    const before = input.slice(0, position);
    const line = before.split("\n").length;
    const column = position - before.lastIndexOf("\n");
    return { error: `JSON inválido en línea ${line}, columna ${column}. ${error.message}`, line, column };
  }
}

const HTML_ENTITIES = Object.freeze({
  amp: String.fromCodePoint(38, 97, 109, 112, 59),
  lt: String.fromCodePoint(38, 108, 116, 59),
  gt: String.fromCodePoint(38, 103, 116, 59),
  quot: String.fromCodePoint(38, 113, 117, 111, 116, 59),
  apos: String.fromCodePoint(38, 35, 48, 51, 57, 59),
});

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", HTML_ENTITIES.amp)
    .replaceAll("<", HTML_ENTITIES.lt)
    .replaceAll(">", HTML_ENTITIES.gt)
    .replaceAll('"', HTML_ENTITIES.quot)
    .replaceAll("'", HTML_ENTITIES.apos);
}

export async function copyText(text) {
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadText(content, filename, type = "application/json;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function countNodes(value) {
  if (value === null || typeof value !== "object") return 1;
  return 1 + Object.values(value).reduce((total, item) => total + countNodes(item), 0);
}

export function pathFor(parent, key) {
  if (typeof key === "number") return `${parent}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;
}

export function randomUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
    const value = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    return (token === "x" ? value : (value & 3) | 8).toString(16);
  });
}
