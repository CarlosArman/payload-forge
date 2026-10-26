function isIdentifier(value) {
  return /^[A-Za-z_$][\w$]*$/u.test(value);
}

function propertyName(key) {
  return isIdentifier(key) ? key : JSON.stringify(key);
}

function mergeTypes(types) {
  const distinct = [...new Set(types)];
  return distinct.length === 1 ? distinct[0] : distinct.join(" | ");
}

function valueType(value, indent = "  ") {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (!value.length) return "unknown[]";
    return `Array<${mergeTypes(value.map((item) => valueType(item, indent)))}>`;
  }

  switch (typeof value) {
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "object": return objectType(value, indent);
    default: return "unknown";
  }
}

function objectType(value, indent) {
  const entries = Object.entries(value);
  if (!entries.length) return "Record<string, never>";

  const nextIndent = `${indent}  `;
  const properties = entries
    .map(([key, item]) => `${nextIndent}${propertyName(key)}: ${valueType(item, nextIndent)};`)
    .join("\n");

  return `{\n${properties}\n${indent}}`;
}

export function jsonToTypeScript(value, rootName = "Payload") {
  const safeName = isIdentifier(rootName) ? rootName : "Payload";
  const type = valueType(value, "");

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const body = Object.entries(value)
      .map(([key, item]) => `  ${propertyName(key)}: ${valueType(item, "  ")};`)
      .join("\n");
    return `export interface ${safeName} {\n${body}\n}`;
  }

  return `export type ${safeName} = ${type};`;
}
