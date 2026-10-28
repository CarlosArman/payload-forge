export const MAX_EXPLORER_NODES = 1000;
export const formatJson = (value) => JSON.stringify(value, null, 2);

function scanJsonErrorLocation(input) {
  let pos = 0;
  function skipWs() { while (pos < input.length && /\s/.test(input[pos])) pos++; }
  function readStr() {
    if (input[pos] !== '"') return false;
    pos++;
    while (pos < input.length) {
      if (input[pos] === '\\') { pos += 2; continue; }
      if (input[pos++] === '"') return true;
    }
    return false;
  }
  function readVal() {
    skipWs();
    if (pos >= input.length) return false;
    const ch = input[pos];
    if (ch === '"') return readStr();
    if (ch === '{') return readObj();
    if (ch === '[') return readArr();
    if (input.startsWith('true', pos)) { pos += 4; return true; }
    if (input.startsWith('false', pos)) { pos += 5; return true; }
    if (input.startsWith('null', pos)) { pos += 4; return true; }
    if (ch === '-' || (ch >= '0' && ch <= '9')) {
      while (pos < input.length && /[0-9.eE+-]/.test(input[pos])) pos++;
      return true;
    }
    return false;
  }
  function readObj() {
    pos++;
    skipWs();
    if (pos < input.length && input[pos] === '}') { pos++; return true; }
    while (pos < input.length) {
      skipWs();
      if (!readStr()) return false;
      skipWs();
      if (pos >= input.length || input[pos] !== ':') return false;
      pos++;
      if (!readVal()) return false;
      skipWs();
      if (pos < input.length && input[pos] === ',') { pos++; continue; }
      if (pos < input.length && input[pos] === '}') { pos++; return true; }
      return false;
    }
    return false;
  }
  function readArr() {
    pos++;
    skipWs();
    if (pos < input.length && input[pos] === ']') { pos++; return true; }
    while (pos < input.length) {
      if (!readVal()) return false;
      skipWs();
      if (pos < input.length && input[pos] === ',') { pos++; continue; }
      if (pos < input.length && input[pos] === ']') { pos++; return true; }
      return false;
    }
    return false;
  }
  readVal();
  const errorPos = Math.min(pos, input.length - 1);
  const before = input.slice(0, errorPos);
  const lines = before.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

export function parseJson(input) {
  try {
    return { value: JSON.parse(input) };
  } catch (error) {
    // Chrome 109+ format: "... at line X column Y ..."
    const lineColMatch = error.message.match(/at line (\d+) column (\d+)/i);
    if (lineColMatch) {
      const line = Number(lineColMatch[1]);
      const column = Number(lineColMatch[2]);
      return { error: `JSON inválido en línea ${line}, columna ${column}. ${error.message}`, line, column };
    }
    // Legacy V8 format: "... position N" or "(char N)"
    const posMatch = error.message.match(/(?:position|char)\s+(\d+)/i);
    if (posMatch) {
      const position = Number(posMatch[1]);
      const before = input.slice(0, position);
      const line = before.split("\n").length;
      const column = position - before.lastIndexOf("\n");
      return { error: `JSON inválido en línea ${line}, columna ${column}. ${error.message}`, line, column };
    }
    // Fallback: scan the JSON manually to find the error position
    const location = scanJsonErrorLocation(input);
    return { error: `JSON inválido en línea ${location.line}, columna ${location.column}. ${error.message}`, ...location };
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
