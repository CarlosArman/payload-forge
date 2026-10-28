function scanJsonErrorLocation(input) {
  let pos = 0;
  function skipWs() { while (pos < input.length && /\s/.test(input[pos])) pos++; }
  function readStr() {
    if (input[pos] !== '"') return false;
    pos++;
    while (pos < input.length) {
      if (input[pos] === "\\") { pos += 2; continue; }
      if (input[pos++] === '"') return true;
    }
    return false;
  }
  function readVal() {
    skipWs();
    if (pos >= input.length) return false;
    const ch = input[pos];
    if (ch === '"') return readStr();
    if (ch === "{") return readObj();
    if (ch === "[") return readArr();
    if (input.startsWith("true", pos)) { pos += 4; return true; }
    if (input.startsWith("false", pos)) { pos += 5; return true; }
    if (input.startsWith("null", pos)) { pos += 4; return true; }
    if (ch === "-" || (ch >= "0" && ch <= "9")) {
      while (pos < input.length && /[0-9.eE+\-]/.test(input[pos])) pos++;
      return true;
    }
    return false;
  }
  function readObj() {
    pos++;
    skipWs();
    if (pos < input.length && input[pos] === "}") { pos++; return true; }
    while (pos < input.length) {
      skipWs();
      if (!readStr()) return false;
      skipWs();
      if (pos >= input.length || input[pos] !== ":") return false;
      pos++;
      if (!readVal()) return false;
      skipWs();
      if (pos < input.length && input[pos] === ",") { pos++; continue; }
      if (pos < input.length && input[pos] === "}") { pos++; return true; }
      return false;
    }
    return false;
  }
  function readArr() {
    pos++;
    skipWs();
    if (pos < input.length && input[pos] === "]") { pos++; return true; }
    while (pos < input.length) {
      if (!readVal()) return false;
      skipWs();
      if (pos < input.length && input[pos] === ",") { pos++; continue; }
      if (pos < input.length && input[pos] === "]") { pos++; return true; }
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

function locationFromSyntaxError(error, input) {
  // Chrome 109+ format: "... at line X column Y ..."
  const lineColMatch = /at line (\d+) column (\d+)/i.exec(error.message);
  if (lineColMatch) return { line: Number(lineColMatch[1]), column: Number(lineColMatch[2]) };

  // Legacy V8 / "(char N)" format
  const posMatch = /(?:position|char)\s+(\d+)/i.exec(error.message);
  if (posMatch) {
    const position = Number(posMatch[1]);
    const before = input.slice(0, position);
    const lines = before.split("\n");
    return { line: lines.length, column: lines.at(-1).length + 1 };
  }

  // Fallback: scan the JSON manually
  return scanJsonErrorLocation(input);
}

export function parseJson(value) {
  try {
    return { value: JSON.parse(value) };
  } catch (error) {
    const location = locationFromSyntaxError(error, value);
    const suffix = location ? ` (línea ${location.line}, columna ${location.column})` : "";
    return { error: `JSON inválido${suffix}: ${error.message}` };
  }
}

export function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

export function minifyJson(value) {
  return JSON.stringify(value);
}
