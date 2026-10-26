import { randomUuidV4 } from "./uuid.js";

function randomInteger(min = 0, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length = 8) {
  return "x".repeat(Math.max(1, length));
}

function resolveReference(reference, rootSchema) {
  if (!reference?.startsWith("#/")) throw new Error(`Referencia externa no soportada: ${reference}`);
  const segments = reference.slice(2).split("/").map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
  const resolved = segments.reduce((node, segment) => node?.[segment], rootSchema);
  if (!resolved) throw new Error(`No se encontró la referencia: ${reference}`);
  return resolved;
}

function mergedSchema(schema, rootSchema) {
  if (schema.$ref) return mergedSchema(resolveReference(schema.$ref, rootSchema), rootSchema);
  if (schema.allOf) return schema.allOf.reduce(
    (merged, part) => ({ ...merged, ...mergedSchema(part, rootSchema) }),
    { ...schema },
  );
  return schema;
}

function selectedSchema(schema, rootSchema) {
  const resolved = mergedSchema(schema, rootSchema);
  return resolved.oneOf?.[0] ?? resolved.anyOf?.[0] ?? resolved;
}

function stringFixture(schema) {
  if (schema.format === "email") return `user${randomInteger(100, 999)}@example.test`;
  if (schema.format === "date-time") return new Date(Date.UTC(2026, 0, randomInteger(1, 28))).toISOString();
  if (schema.format === "uuid") return randomUuidV4();
  if (schema.format === "uri") return `https://example.test/resource/${randomInteger(1, 999)}`;
  if (schema.format === "ipv4") return `192.0.2.${randomInteger(1, 254)}`;
  if (schema.format === "hostname") return `service-${randomInteger(1, 999)}.example.test`;
  return randomString(schema.minLength ?? 7);
}

function fixtureFor(schema, rootSchema) {
  const effectiveSchema = selectedSchema(schema ?? {}, rootSchema);
  if (effectiveSchema.const !== undefined) return effectiveSchema.const;
  if (Array.isArray(effectiveSchema.enum) && effectiveSchema.enum.length) return effectiveSchema.enum[0];

  const type = Array.isArray(effectiveSchema.type)
    ? effectiveSchema.type.find((item) => item !== "null") ?? "null"
    : effectiveSchema.type;

  switch (type) {
    case "string":
      return stringFixture(effectiveSchema);
    case "integer":
      return randomInteger(effectiveSchema.minimum ?? 0, effectiveSchema.maximum ?? 1000);
    case "number":
      return Number((Math.random() * ((effectiveSchema.maximum ?? 1000) - (effectiveSchema.minimum ?? 0)) + (effectiveSchema.minimum ?? 0)).toFixed(2));
    case "boolean":
      return true;
    case "null":
      return null;
    case "array": {
      const count = Math.max(1, effectiveSchema.minItems ?? 1);
      return Array.from({ length: count }, () => fixtureFor(effectiveSchema.items, rootSchema));
    }
    case "object": {
      const properties = effectiveSchema.properties ?? {};
      return Object.fromEntries(Object.entries(properties)
        .filter(([key, property]) => (effectiveSchema.required ?? []).includes(key) || property.default !== undefined)
        .map(([key, property]) => [key, property.default ?? fixtureFor(property, rootSchema)]));
    }
    default:
      return "example";
  }
}

export function generateFixtures(schema, count = 1) {
  if (!schema || typeof schema !== "object") throw new Error("El schema debe ser un objeto JSON.");
  const safeCount = Math.min(100, Math.max(1, Number(count) || 1));
  return Array.from({ length: safeCount }, () => fixtureFor(schema, schema));
}
