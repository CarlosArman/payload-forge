function locationFromSyntaxError(error, input) {
  // Chrome 109+ format: "... at line X column Y (char N)"
  const lineColMatch = /at line (\d+) column (\d+)/i.exec(error.message);
  if (lineColMatch) return { line: Number(lineColMatch[1]), column: Number(lineColMatch[2]) };

  // Legacy V8 format: "... at position N"
  const posMatch = /position (\d+)/i.exec(error.message);
  if (!posMatch) return null;
  const position = Number(posMatch[1]);
  const before = input.slice(0, position);
  const lines = before.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
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
