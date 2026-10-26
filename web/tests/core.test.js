import test from "node:test";
import assert from "node:assert/strict";
import { pathFor, randomUuid } from "../assets/js/utils.js";
import { collectDifferences } from "../../packages/core/json-compare.js";
import { inferSchema } from "../../packages/core/schema-generator.js";
import { parseJson } from "../../packages/core/json.js";
import { collectPaths } from "../../packages/core/jsonpath.js";
import { decodeJwt } from "../../packages/core/jwt.js";
import { decodeBase64, encodeBase64 } from "../../packages/core/base64.js";
import { generateUuids, isUuidV4 } from "../../packages/core/uuid.js";
import { parseRegex, testRegex } from "../../packages/core/regex.js";
import { redactSecrets } from "../../packages/core/secrets-redactor.js";
import { jsonToTypeScript } from "../../packages/core/json-to-typescript.js";
import { curlToFetch, parseCurl } from "../../packages/core/curl-to-fetch.js";
import { validateSchema } from "../../packages/core/schema-validator.js";
import { generateFixtures } from "../../packages/core/schema-fixtures.js";
import { listOpenApiOperations, operationToCurl, operationToFetch } from "../../packages/core/openapi.js";
import { fromYaml, toYaml } from "../../packages/core/yaml.js";
import { generateMockRecords } from "../../packages/core/mock-data.js";

test("parseJson returns an actionable error for invalid JSON", () => {
  const result = parseJson('{\n  "id":,\n}');
  assert.ok(result.error);
  assert.match(result.error, /JSON inválido/i);
});

test("pathFor produces dot and bracket JSONPath notation", () => {
  assert.equal(pathFor("$", "user"), "$.user");
  assert.equal(pathFor("$.user", "first-name"), '$.user["first-name"]');
  assert.equal(pathFor("$.items", 2), "$.items[2]");
});

test("randomUuid generates an RFC 4122 v4 compatible value", () => {
  assert.match(randomUuid(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

test("collectDifferences identifies added, removed and changed values", () => {
  const differences = collectDifferences(
    { id: 1, status: "draft", stale: true },
    { id: 1, status: "published", reviewed: true },
  );

  assert.deepEqual(
    differences.map(({ type, path }) => ({ type, path })),
    [
      { type: "changed", path: "$.status" },
      { type: "removed", path: "$.stale" },
      { type: "added", path: "$.reviewed" },
    ],
  );
});

test("inferSchema supports nested objects, arrays and JSON primitive types", () => {
  const schema = inferSchema({
    id: 42,
    active: true,
    metadata: null,
    profile: { name: "Ada" },
    tags: ["api"],
  });

  assert.deepEqual(schema, {
    type: "object",
    properties: {
      id: { type: "number" },
      active: { type: "boolean" },
      metadata: { type: "null" },
      profile: {
        type: "object",
        properties: { name: { type: "string" } },
        required: ["name"],
        additionalProperties: false,
      },
      tags: { type: "array", items: { type: "string" } },
    },
    required: ["id", "active", "metadata", "profile", "tags"],
    additionalProperties: false,
  });
});

test("collectPaths supports arrays and quoted JSONPath properties", () => {
  const paths = collectPaths({
    user: { "first-name": "Ada" },
    items: [{ id: 1 }],
  });

  assert.deepEqual(paths, [
    "$.user",
    '$.user["first-name"]',
    "$.items",
    "$.items[0]",
    "$.items[0].id",
  ]);
});

test("collectPaths caps traversal at one thousand nodes", () => {
  const payload = Object.fromEntries(Array.from({ length: 1005 }, (_, index) => [`field${index}`, index]));
  assert.equal(collectPaths(payload).length, 1000);
});

test("decodeJwt decodes header, payload, claims, and a Bearer prefix", () => {
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.signature";

  const result = decodeJwt(token);

  assert.deepEqual(result.header, { alg: "HS256", typ: "JWT" });
  assert.deepEqual(result.payload, { sub: "123", iat: 1710000000, exp: 2000000000 });
  assert.equal(result.claims.issuedAt, "2024-03-09T16:00:00.000Z");
  assert.equal(result.claims.expiresAt, "2033-05-18T03:33:20.000Z");
  assert.equal(result.signature, "signature");
});

test("decodeJwt reports actionable errors for malformed tokens", () => {
  assert.throws(
    () => decodeJwt("not-a-jwt"),
    /exactamente tres segmentos/i,
  );
  assert.throws(
    () => decodeJwt("abc.abc."),
    /no contiene una firma/i,
  );
});

test("Base64 helpers round-trip UTF-8 text", () => {
  const source = "PayloadForge: ¡texto UTF-8 local!";

  assert.equal(decodeBase64(encodeBase64(source)), source);
});

test("Base64URL helpers omit padding and round-trip data", () => {
  const source = "https://payloadforge.dev/?tool=jwt&lang=es";
  const encoded = encodeBase64(source, true);

  assert.doesNotMatch(encoded, /[+=/]/);
  assert.equal(decodeBase64(encoded, true), source);
});

test("Base64 helpers reject malformed values", () => {
  assert.throws(() => decodeBase64("not valid base64!"), /Base64 válido/i);
  assert.throws(() => decodeBase64("not+url", true), /Base64URL válido/i);
});

test("isUuidV4 accepts valid v4 UUIDs and rejects other UUID versions", () => {
  assert.equal(isUuidV4("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isUuidV4("550e8400-e29b-11d4-a716-446655440000"), false);
  assert.equal(isUuidV4("not-a-uuid"), false);
});

test("generateUuids returns the requested number of valid UUID v4 values", () => {
  const values = generateUuids(3);

  assert.equal(values.length, 3);
  assert.ok(values.every(isUuidV4));
});

test("testRegex returns matches, positions, and captured groups", () => {
  const result = testRegex("(\\w+)@(\\w+\\.\\w+)", "ada@example.com; invalid; ops@payloadforge.dev", "i");

  assert.equal(result.matched, true);
  assert.equal(result.matches.length, 2);
  assert.deepEqual(result.matches[0], {
    index: 0,
    value: "ada@example.com",
    groups: ["ada", "example.com"],
  });
  assert.equal(result.matches[1].index, 26);
});

test("parseRegex reports invalid regular expressions", () => {
  assert.throws(() => parseRegex("[unterminated"), /Expresión regular inválida/i);
});

test("redactSecrets redacts common credentials and preserves non-sensitive content", () => {
  const source = "Authorization: Bearer abcdefghijklmnop\\ncontact: ada@example.com\\nservice: PayloadForge";
  const result = redactSecrets(source);

  assert.equal(result.findings.length, 2);
  assert.match(result.output, /Bearer \[REDACTED\]/);
  assert.match(result.output, /\[REDACTED_EMAIL\]/);
  assert.match(result.output, /service: PayloadForge/);
});

test("redactSecrets only applies selected rules", () => {
  const result = redactSecrets("contact: ada@example.com", []);

  assert.equal(result.findings.length, 0);
  assert.equal(result.output, "contact: ada@example.com");
});

test("jsonToTypeScript generates nested interfaces and array types", () => {
  const result = jsonToTypeScript({
    id: 42,
    "display-name": "Ada",
    profile: { active: true },
    tags: ["api"],
  }, "User");

  assert.equal(result, [
    "export interface User {",
    "  id: number;",
    '  "display-name": string;',
    "  profile: {",
    "    active: boolean;",
    "  };",
    "  tags: Array<string>;",
    "}",
  ].join("\n"));
});

test("parseCurl reads URL, method, headers, and request body", () => {
  const result = parseCurl("curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{\"name\":\"Ada\"}'");

  assert.deepEqual(result, {
    method: "POST",
    url: "https://api.example.com/users",
    headers: { "Content-Type": "application/json" },
    body: '{"name":"Ada"}',
  });
});

test("curlToFetch generates a JavaScript fetch call", () => {
  const result = curlToFetch("curl https://api.example.com/health");

  assert.match(result, /^fetch\("https:\/\/api\.example\.com\/health", \{/);
  assert.match(result, /method: "GET"/);
});

test("validateSchema reports required, type, and numeric constraint errors", () => {
  const errors = validateSchema(
    { age: 12, tags: ["ok", 3] },
    {
      type: "object",
      required: ["email"],
      properties: {
        age: { type: "number", minimum: 18 },
        tags: { type: "array", items: { type: "string" } },
      },
    },
  );

  assert.deepEqual(errors, [
    { path: "$.email", message: "Es obligatorio." },
    { path: "$.age", message: "Debe ser mayor o igual que 18." },
    { path: "$.tags[1]", message: "Debe ser de tipo string." },
  ]);
});

test("validateSchema supports references, combinators, formats, dependencies, and conditionals", () => {
  const schema = {
    $defs: {
      identifier: { type: "string", format: "uuid" },
    },
    type: "object",
    required: ["id", "mode"],
    properties: {
      id: { $ref: "#/$defs/identifier" },
      mode: { enum: ["simple", "advanced"] },
      tags: { type: "array", uniqueItems: true },
      endpoint: { type: "string", format: "uri" },
      advancedSetting: { type: "string" },
    },
    additionalProperties: false,
    dependentRequired: { advancedSetting: ["mode"] },
    if: { properties: { mode: { const: "advanced" } } },
    then: { required: ["advancedSetting"] },
    allOf: [{ properties: { mode: { type: "string" } } }],
  };

  const errors = validateSchema({
    id: "invalid",
    mode: "advanced",
    tags: ["duplicate", "duplicate"],
    endpoint: "not-a-url",
    unexpected: true,
  }, schema);

  assert.ok(errors.some((error) => error.path === "$.id" && /uuid/i.test(error.message)));
  assert.ok(errors.some((error) => error.path === "$.tags" && /duplicados/i.test(error.message)));
  assert.ok(errors.some((error) => error.path === "$.endpoint" && /uri/i.test(error.message)));
  assert.ok(errors.some((error) => error.path === "$.unexpected" && /adicionales/i.test(error.message)));
  assert.ok(errors.some((error) => error.path === "$.advancedSetting" && /obligatorio/i.test(error.message)));
});

test("validateSchema supports anyOf, oneOf, and not", () => {
  const schema = {
    anyOf: [{ type: "string" }, { type: "number" }],
    oneOf: [{ type: "number" }, { const: 7 }],
    not: { const: 7 },
  };

  const errors = validateSchema(7, schema);

  assert.ok(errors.some((error) => /exactamente con uno/i.test(error.message)));
  assert.ok(errors.some((error) => /prohibido/i.test(error.message)));
});

test("generateFixtures creates values for required schema properties", () => {
  const [fixture] = generateFixtures({
    type: "object",
    required: ["status", "email", "items"],
    properties: {
      status: { enum: ["draft", "published"] },
      email: { type: "string", format: "email" },
      items: { type: "array", minItems: 2, items: { type: "integer", minimum: 4, maximum: 4 } },
    },
  });

  assert.equal(fixture.status, "draft");
  assert.match(fixture.email, /^user\d+@example\.test$/);
  assert.deepEqual(fixture.items, [4, 4]);
});

test("generateFixtures resolves references, alternatives, and extended formats", () => {
  const [fixture] = generateFixtures({
    type: "object",
    required: ["id", "endpoint", "address", "service"],
    properties: {
      id: { $ref: "#/$defs/uuid" },
      endpoint: { type: "string", format: "uri" },
      address: { type: "string", format: "ipv4" },
      service: { oneOf: [{ type: "string", format: "hostname" }, { type: "string", format: "email" }] },
    },
    $defs: {
      uuid: { type: "string", format: "uuid" },
    },
  });

  assert.ok(isUuidV4(fixture.id));
  assert.match(fixture.endpoint, /^https:\/\//);
  assert.match(fixture.address, /^192\.0\.2\./);
  assert.match(fixture.service, /\.example\.test$/);
});

test("listOpenApiOperations resolves referenced endpoint details and generates requests", () => {
  const document = {
    openapi: "3.0.3",
    components: {
      parameters: {
        UserId: { name: "id", in: "path", required: true, description: "User identifier" },
      },
      requestBodies: {
        UserBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
      },
      responses: {
        Ok: { description: "Success" },
      },
    },
    paths: {
      "/users/{id}": {
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        put: {
          requestBody: { $ref: "#/components/requestBodies/UserBody" },
          responses: { 200: { $ref: "#/components/responses/Ok" } },
        },
      },
    },
  };
  const operation = listOpenApiOperations(document).operations[0];

  assert.deepEqual(operation.parameters, [{ name: "id", in: "path", required: true, description: "User identifier" }]);
  assert.deepEqual(operation.requestBody, { required: true, contentTypes: ["application/json"] });
  assert.deepEqual(operation.responses, [{ status: "200", description: "Success" }]);
  assert.match(operationToFetch(operation), /https:\/\/api\.example\.test\/users\/example/);
  assert.match(operationToCurl(operation), /Content-Type: application\/json/);
});

test("YAML helpers convert nested payloads in both directions", () => {
  const value = { service: "PayloadForge", ports: [80, 443], enabled: true };
  const yaml = toYaml(value);

  assert.match(yaml, /service: PayloadForge/);
  assert.deepEqual(fromYaml(yaml), value);
});

test("generateMockRecords creates valid UUIDs and merges custom fields", () => {
  const records = generateMockRecords(2, { environment: "staging" });

  assert.deepEqual(records.map((record) => record.id), [1, 2]);
  assert.ok(records.every((record) => isUuidV4(record.uuid)));
  assert.ok(records.every((record) => record.environment === "staging"));
});
test("listOpenApiOperations extracts OpenAPI and Swagger endpoint operations", () => {
  const openApi = listOpenApiOperations({
    openapi: "3.0.3",
    paths: {
      "/users": {
        get: { summary: "List users" },
        post: { operationId: "createUser" },
      },
    },
  });
  const swagger = listOpenApiOperations({
    swagger: "2.0",
    paths: { "/health": { get: {} } },
  });

  assert.equal(openApi.version, "OpenAPI 3.0.3");
  assert.deepEqual(openApi.operations, [
    {
      method: "GET",
      path: "/users",
      summary: "List users",
      description: "",
      tags: [],
      parameters: [],
      requestBody: null,
      responses: [],
    },
    {
      method: "POST",
      path: "/users",
      summary: "createUser",
      description: "",
      tags: [],
      parameters: [],
      requestBody: null,
      responses: [],
    },
  ]);
  assert.equal(swagger.version, "Swagger 2.0");
  assert.equal(swagger.operations[0].path, "/health");
});
