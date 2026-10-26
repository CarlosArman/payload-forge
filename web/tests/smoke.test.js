import test from "node:test";
import assert from "node:assert/strict";
import {
  collectPaths,
  curlToFetch,
  decodeJwt,
  formatJson,
  fromYaml,
  generateFixtures,
  generateMockRecords,
  generateUuids,
  inferSchema,
  isUuidV4,
  jsonToTypeScript,
  listOpenApiOperations,
  parseJson,
  redactSecrets,
  toYaml,
  validateSchema,
} from "../../packages/core/index.js";

const apiPayload = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Ada Lovelace",
  active: true,
  profile: {
    email: "ada@example.test",
    roles: ["admin", "qa"],
  },
};

test("smoke: JSON payload workflow produces interoperable outputs", () => {
  const formatted = formatJson(apiPayload);
  assert.equal(parseJson(formatted).value.profile.email, "ada@example.test");

  const schema = inferSchema(apiPayload);
  assert.deepEqual(validateSchema(apiPayload, schema), []);

  const yaml = toYaml(apiPayload);
  assert.deepEqual(fromYaml(yaml), apiPayload);

  const types = jsonToTypeScript(apiPayload, "ApiUser");
  assert.match(types, /export interface ApiUser/);
  assert.match(types, /profile:/);

  const paths = collectPaths(apiPayload);
  assert.ok(paths.includes("$.profile.email"));

  const [fixture] = generateFixtures(schema);
  assert.equal(typeof fixture.name, "string");
  assert.ok(Array.isArray(fixture.profile.roles));
});

test("smoke: API security and test-data utilities produce safe output", () => {
  const redacted = redactSecrets("Authorization: Bearer very-secret-token\nemail: ada@example.test");
  assert.match(redacted.output, /\[REDACTED\]/);
  assert.match(redacted.output, /\[REDACTED_EMAIL\]/);

  const records = generateMockRecords(3, { suite: "api-smoke" });
  assert.equal(records.length, 3);
  assert.ok(records.every((record) => record.suite === "api-smoke" && isUuidV4(record.uuid)));

  const uuids = generateUuids(2);
  assert.ok(uuids.every(isUuidV4));
});

test("smoke: protocol and specification tools parse representative documents", () => {
  const fetchCode = curlToFetch("curl -X POST https://api.example.test/users -H 'Content-Type: application/json' -d '{\"name\":\"Ada\"}'");
  assert.match(fetchCode, /fetch\("https:\/\/api\.example\.test\/users"/);
  assert.match(fetchCode, /method: "POST"/);

  const openApi = listOpenApiOperations({
    openapi: "3.0.3",
    paths: {
      "/health": { get: { summary: "Health check", responses: { 200: { description: "OK" } } } },
    },
  });
  assert.equal(openApi.operations[0].method, "GET");
  assert.equal(openApi.operations[0].path, "/health");

  const jwt = decodeJwt("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZGEifQ.signature");
  assert.equal(jwt.payload.sub, "ada");

  assert.match(openApi.version, /^OpenAPI/);
});
