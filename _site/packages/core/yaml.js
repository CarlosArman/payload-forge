const indent = (level) => "  ".repeat(level);

function scalar(value) {
  if (value === null) return "null";
  if (typeof value === "string") return /^[\w./:@+-]+$/.test(value) ? value : JSON.stringify(value);
  return String(value);
}

export function toYaml(value, level = 0) {
  if (value === null || typeof value !== "object") return scalar(value);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return value.map((item) => {
      if (item && typeof item === "object") return `${indent(level)}-\n${toYaml(item, level + 1)}`;
      return `${indent(level)}- ${scalar(item)}`;
    }).join("\n");
  }

  const entries = Object.entries(value);
  if (!entries.length) return "{}";
  return entries.map(([key, item]) => {
    const safeKey = /^[\w-]+$/.test(key) ? key : JSON.stringify(key);
    if (item && typeof item === "object") return `${indent(level)}${safeKey}:\n${toYaml(item, level + 1)}`;
    return `${indent(level)}${safeKey}: ${scalar(item)}`;
  }).join("\n");
}

function stripYamlComment(value) {
  const commentIndex = value.indexOf(" #");
  return (commentIndex === -1 ? value : value.slice(0, commentIndex)).trim();
}

function unquoteYamlKey(key) {
  const first = key[0];
  const last = key.at(-1);
  return first === last && (first === '"' || first === "'") ? key.slice(1, -1) : key;
}

function parseInlineArray(value) {
  const contents = value.slice(1, -1).trim();
  return contents ? contents.split(",").map((item) => yamlScalar(item)) : [];
}

function parseInlineObject(value) {
  const result = {};
  const contents = value.slice(1, -1).trim();
  if (!contents) return result;

  contents.split(",").forEach((entry) => {
    const separator = entry.indexOf(":");
    if (separator < 1) throw new Error("Objeto YAML inline inválido.");
    result[unquoteYamlKey(entry.slice(0, separator).trim())] = yamlScalar(entry.slice(separator + 1));
  });
  return result;
}

function parseQuotedYamlString(value) {
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  try { return JSON.parse(value); } catch { return value.slice(1, -1); }
}

function yamlScalar(value) {
  const clean = stripYamlComment(value);
  const primitives = { null: null, "~": null, true: true, false: false };
  if (Object.hasOwn(primitives, clean)) return primitives[clean];
  if (Number.isFinite(Number(clean)) && clean !== "") return Number(clean);
  if (clean.startsWith("[") && clean.endsWith("]")) return parseInlineArray(clean);
  if (clean.startsWith("{") && clean.endsWith("}")) return parseInlineObject(clean);
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) return parseQuotedYamlString(clean);
  return clean;
}

export function fromYaml(input) {
  const lines = input.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#"));
  if (!lines.length) throw new Error("YAML vacío.");
  const root = {};
  const stack = [{ indent: -1, value: root }];

  lines.forEach((line, lineNumber) => {
    const spaces = line.match(/^\s*/)[0].length;
    if (spaces % 2) throw new Error(`Indentación inválida en línea ${lineNumber + 1}. Usa múltiplos de 2 espacios.`);
    const content = line.trim();
    while (stack.length > 1 && spaces <= stack.at(-1).indent) stack.pop();
    const parent = stack.at(-1).value;

    if (content.startsWith("- ")) {
      if (!Array.isArray(parent)) throw new Error(`Lista sin clave contenedora en línea ${lineNumber + 1}.`);
      parent.push(yamlScalar(content.slice(2)));
      return;
    }

    const separator = content.indexOf(":");
    if (separator < 1) throw new Error(`Propiedad YAML inválida en línea ${lineNumber + 1}.`);
    const key = content.slice(0, separator).trim().replace(/^["']|["']$/g, "");
    const rawValue = content.slice(separator + 1).trim();
    if (rawValue) {
      parent[key] = yamlScalar(rawValue);
    } else {
      const next = lines[lineNumber + 1]?.trim() ?? "";
      parent[key] = next.startsWith("- ") ? [] : {};
      stack.push({ indent: spaces, value: parent[key] });
    }
  });
  return root;
}
