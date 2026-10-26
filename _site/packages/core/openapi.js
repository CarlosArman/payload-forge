const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

function apiVersion(document) {
  if (typeof document.openapi === "string") return `OpenAPI ${document.openapi}`;
  if (typeof document.swagger === "string") return `Swagger ${document.swagger}`;
  return null;
}

function resolveReference(value, document) {
  if (!value?.$ref) return value;
  if (!value.$ref.startsWith("#/")) throw new Error(`Referencia externa no soportada: ${value.$ref}`);
  const segments = value.$ref.slice(2).split("/").map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
  const resolved = segments.reduce((node, segment) => node?.[segment], document);
  if (!resolved) throw new Error(`No se encontró la referencia: ${value.$ref}`);
  return resolveReference(resolved, document);
}

function operationParameters(pathItem, operation, document) {
  const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
    .map((parameter) => resolveReference(parameter, document));
  return parameters.map(({ name, in: location, required = false, description = "" }) => ({
    name,
    in: location,
    required,
    description,
  }));
}

function operationRequestBody(operation, document) {
  if (operation.requestBody) {
    const requestBody = resolveReference(operation.requestBody, document);
    const content = Object.keys(requestBody.content ?? {});
    return { required: Boolean(requestBody.required), contentTypes: content };
  }

  const bodyParameter = (operation.parameters ?? [])
    .map((parameter) => resolveReference(parameter, document))
    .find((parameter) => parameter.in === "body");
  return bodyParameter ? { required: Boolean(bodyParameter.required), contentTypes: ["application/json"] } : null;
}

function operationResponses(operation, document) {
  return Object.entries(operation.responses ?? {}).map(([status, response]) => {
    const resolved = resolveReference(response, document);
    return { status, description: resolved.description ?? "" };
  });
}

function operationDetails(path, method, pathItem, operation, document) {
  return {
    method: method.toUpperCase(),
    path,
    summary: operation.summary ?? operation.operationId ?? "",
    description: operation.description ?? "",
    tags: operation.tags ?? [],
    parameters: operationParameters(pathItem, operation, document),
    requestBody: operationRequestBody(operation, document),
    responses: operationResponses(operation, document),
  };
}

export function listOpenApiOperations(document) {
  const version = apiVersion(document);
  if (!version) throw new Error("El documento debe contener una versión OpenAPI o Swagger.");

  const operations = [];
  Object.entries(document.paths ?? {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem ?? {}).forEach(([method, operation]) => {
      if (!HTTP_METHODS.has(method.toLowerCase()) || !operation || typeof operation !== "object") return;
      operations.push(operationDetails(path, method, pathItem, operation, document));
    });
  });

  return { version, operations };
}

function examplePath(path) {
  let result = "";
  let insideParameter = false;

  for (const character of path) {
    if (character === "{") {
      insideParameter = true;
      result += "example";
    } else if (character === "}") {
      insideParameter = false;
    } else if (!insideParameter) {
      result += character;
    }
  }

  return result;
}

function operationUrl(operation, baseUrl) {
  return `${baseUrl.replace(/\/$/, "")}${examplePath(operation.path)}`;
}

export function operationToFetch(operation, baseUrl = "https://api.example.test") {
  const url = operationUrl(operation, baseUrl);
  const headers = operation.requestBody?.contentTypes.includes("application/json")
    ? { "Content-Type": "application/json" }
    : {};
  const options = {
    method: operation.method,
    headers,
  };
  if (operation.requestBody) options.body = JSON.stringify({});

  return `fetch(${JSON.stringify(url)}, ${JSON.stringify(options, null, 2)})\n  .then((response) => response.json())\n  .then(console.log);`;
}

export function operationToCurl(operation, baseUrl = "https://api.example.test") {
  const url = operationUrl(operation, baseUrl);
  const parts = ["curl", "-X", operation.method, JSON.stringify(url)];
  if (operation.requestBody?.contentTypes.includes("application/json")) {
    parts.push("-H", JSON.stringify("Content-Type: application/json"), "-d", JSON.stringify("{}"));
  }
  return parts.join(" ");
}
