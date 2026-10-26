export function inferSchema(value) {
  if (value === null) return { type: "null" };

  if (Array.isArray(value)) {
    const items = value.length ? inferSchema(value[0]) : {};
    return { type: "array", items };
  }

  if (typeof value === "object") {
    const properties = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, inferSchema(child)]));
    return { type: "object", properties, required: Object.keys(value), additionalProperties: false };
  }

  return { type: typeof value };
}

export function removeRequiredFields(node) {
  if (!node || typeof node !== "object") return;
  delete node.required;
  Object.values(node).forEach(removeRequiredFields);
}
