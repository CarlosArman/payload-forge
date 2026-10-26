function locationFromSyntaxError(error) {
  const match = /position (\d+)/i.exec(error.message);
  return match ? Number(match[1]) : null;
}

function lineColumn(value, position) {
  if (position === null) return null;
  const before = value.slice(0, position);
  const lines = before.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

export function parseJson(value) {
  try {
    return { value: JSON.parse(value) };
  } catch (error) {
    const position = locationFromSyntaxError(error);
    const location = lineColumn(value, position);
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
