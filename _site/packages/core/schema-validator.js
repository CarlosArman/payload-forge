const FORMAT_PATTERNS = Object.freeze({
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ipv4: /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/u,
});

function typeMatches(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  return typeof value === type;
}

function joinPath(path, key) {
  return /^[A-Za-z_$][\w$]*$/u.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

function addError(errors, path, message) {
  errors.push({ path, message });
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function resolveReference(reference, rootSchema) {
  if (!reference.startsWith("#/")) throw new Error(`Referencia externa no soportada: ${reference}`);
  const segments = reference.slice(2).split("/").map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
  const resolved = segments.reduce((node, segment) => node?.[segment], rootSchema);
  if (!resolved) throw new Error(`No se encontró la referencia: ${reference}`);
  return resolved;
}

function validateType(value, schema, path, errors) {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type].filter(Boolean);
  const matches = !types.length || types.some((type) => typeMatches(value, type));
  if (!matches) addError(errors, path, `Debe ser de tipo ${types.join(" o ")}.`);
  return matches;
}

function validateAllowedValues(value, schema, path, errors) {
  if (schema.const !== undefined && !sameValue(value, schema.const)) {
    addError(errors, path, "Debe coincidir con el valor constante definido.");
  }
  if (schema.enum && !schema.enum.some((item) => sameValue(item, value))) {
    addError(errors, path, "Debe coincidir con uno de los valores permitidos.");
  }
}

function isHostname(value) {
  if (!value || value.length > 253) return false;
  return value.split(".").every((label) => {
    if (!label || label.length > 63) return false;
    if (label.startsWith("-") || label.endsWith("-")) return false;
    return /^[a-z0-9-]+$/i.test(label);
  });
}

function isEmail(value) {
  const segments = value.split("@");
  if (segments.length !== 2) return false;
  const [local, domain] = segments;
  return Boolean(local) && !/\s/u.test(local) && isHostname(domain) && domain.includes(".");
}

function validateFormat(value, format, path, errors) {
  if (format === "date-time" && !Number.isNaN(Date.parse(value))) return;
  if (format === "email" && isEmail(value)) return;
  if (format === "hostname" && isHostname(value)) return;
  if (format === "uri") {
    try {
      new URL(value);
      return;
    } catch {
      addError(errors, path, "No coincide con el formato uri.");
      return;
    }
  }

  const pattern = FORMAT_PATTERNS[format];
  if (pattern && !pattern.test(value)) addError(errors, path, `No coincide con el formato ${format}.`);
}

function validateString(value, schema, path, errors) {
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    addError(errors, path, `Debe tener al menos ${schema.minLength} caracteres.`);
  }
  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    addError(errors, path, `Debe tener como máximo ${schema.maxLength} caracteres.`);
  }
  if (schema.pattern && !(new RegExp(schema.pattern).test(value))) {
    addError(errors, path, "No coincide con el patrón requerido.");
  }
  if (schema.format) validateFormat(value, schema.format, path, errors);
}

function validateNumber(value, schema, path, errors) {
  if (schema.minimum !== undefined && value < schema.minimum) {
    addError(errors, path, `Debe ser mayor o igual que ${schema.minimum}.`);
  }
  if (schema.maximum !== undefined && value > schema.maximum) {
    addError(errors, path, `Debe ser menor o igual que ${schema.maximum}.`);
  }
  if (schema.multipleOf !== undefined && value / schema.multipleOf % 1 !== 0) {
    addError(errors, path, `Debe ser múltiplo de ${schema.multipleOf}.`);
  }
}

function validateArray(value, schema, path, errors, rootSchema) {
  if (schema.minItems !== undefined && value.length < schema.minItems) {
    addError(errors, path, `Debe contener al menos ${schema.minItems} elementos.`);
  }
  if (schema.maxItems !== undefined && value.length > schema.maxItems) {
    addError(errors, path, `Debe contener como máximo ${schema.maxItems} elementos.`);
  }
  if (schema.uniqueItems && new Set(value.map(JSON.stringify)).size !== value.length) {
    addError(errors, path, "No debe contener elementos duplicados.");
  }
  if (schema.items) {
    value.forEach((item, index) => validateSchema(item, schema.items, `${path}[${index}]`, errors, rootSchema));
  }
}

function validateRequiredProperties(value, required, path, errors) {
  required.forEach((key) => {
    if (!(key in value)) addError(errors, joinPath(path, key), "Es obligatorio.");
  });
}

function validateAdditionalProperties(value, schema, path, errors, rootSchema) {
  if (schema.additionalProperties === undefined) return;
  const knownProperties = new Set(Object.keys(schema.properties ?? {}));

  Object.keys(value).forEach((key) => {
    if (knownProperties.has(key)) return;
    const propertyPath = joinPath(path, key);
    if (schema.additionalProperties === false) {
      addError(errors, propertyPath, "No se permiten propiedades adicionales.");
    } else if (typeof schema.additionalProperties === "object") {
      validateSchema(value[key], schema.additionalProperties, propertyPath, errors, rootSchema);
    }
  });
}

function validateDependencies(value, schema, path, errors, rootSchema) {
  const dependencies = schema.dependentRequired ?? schema.dependencies ?? {};
  Object.entries(dependencies).forEach(([key, dependency]) => {
    if (!(key in value)) return;
    if (Array.isArray(dependency)) validateRequiredProperties(value, dependency, path, errors);
    else if (dependency && typeof dependency === "object") validateSchema(value, dependency, path, errors, rootSchema);
  });
}

function validateObject(value, schema, path, errors, rootSchema) {
  validateRequiredProperties(value, schema.required ?? [], path, errors);
  Object.entries(schema.properties ?? {}).forEach(([key, propertySchema]) => {
    if (key in value) validateSchema(value[key], propertySchema, joinPath(path, key), errors, rootSchema);
  });
  validateAdditionalProperties(value, schema, path, errors, rootSchema);
  validateDependencies(value, schema, path, errors, rootSchema);
}

function passesSchema(value, schema, path, rootSchema) {
  return validateSchema(value, schema, path, [], rootSchema).length === 0;
}

function validateCombinators(value, schema, path, errors, rootSchema) {
  if (schema.allOf) schema.allOf.forEach((part) => validateSchema(value, part, path, errors, rootSchema));

  if (schema.anyOf && !schema.anyOf.some((part) => passesSchema(value, part, path, rootSchema))) {
    addError(errors, path, "Debe coincidir con al menos uno de los schemas permitidos.");
  }

  if (schema.oneOf) {
    const matches = schema.oneOf.filter((part) => passesSchema(value, part, path, rootSchema)).length;
    if (matches !== 1) addError(errors, path, "Debe coincidir exactamente con uno de los schemas permitidos.");
  }

  if (schema.not && passesSchema(value, schema.not, path, rootSchema)) {
    addError(errors, path, "No debe coincidir con el schema prohibido.");
  }
}

function validateConditional(value, schema, path, errors, rootSchema) {
  if (!schema.if) return;
  const branch = passesSchema(value, schema.if, path, rootSchema) ? schema.then : schema.else;
  if (branch) validateSchema(value, branch, path, errors, rootSchema);
}

function validateTypedValue(value, schema, path, errors, rootSchema) {
  if (typeof value === "string") validateString(value, schema, path, errors);
  if (typeof value === "number") validateNumber(value, schema, path, errors);
  if (Array.isArray(value)) validateArray(value, schema, path, errors, rootSchema);
  if (typeMatches(value, "object")) validateObject(value, schema, path, errors, rootSchema);
}

export function validateSchema(value, schema, path = "$", errors = [], rootSchema = schema) {
  if (!schema || typeof schema !== "object") {
    addError(errors, path, "El schema debe ser un objeto JSON.");
    return errors;
  }

  const resolvedSchema = schema.$ref ? resolveReference(schema.$ref, rootSchema) : schema;
  validateCombinators(value, resolvedSchema, path, errors, rootSchema);
  validateConditional(value, resolvedSchema, path, errors, rootSchema);
  if (!validateType(value, resolvedSchema, path, errors)) return errors;
  validateAllowedValues(value, resolvedSchema, path, errors);
  validateTypedValue(value, resolvedSchema, path, errors, rootSchema);
  return errors;
}
