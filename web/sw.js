const CACHE_NAME = "payloadforge-v36";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/icon.svg",
  "./assets/icons/maskable.svg",
  "./assets/css/variables.css",
  "./assets/css/layout.css",
  "./assets/css/components.css",
  "./assets/css/utilities.css",
  "./assets/css/responsive.css",
  "./assets/js/app.js",
  "./assets/js/i18n.js",
  "./assets/js/router.js",
  "./assets/js/state.js",
  "./assets/js/event-bus.js",
  "./assets/js/utils.js",
  "../packages/core/index.js",
  "../packages/core/secrets-redactor.js",
  "../packages/core/json-to-typescript.js",
  "../packages/core/base64.js",
  "../packages/core/curl-to-fetch.js",
  "../packages/core/regex.js",
  "../packages/core/schema-validator.js",
  "../packages/core/uuid.js",
  "../packages/core/schema-fixtures.js",
  "../packages/core/openapi.js",
  "../packages/core/jwt.js",
  "../packages/core/schema-generator.js",
  "../packages/core/jsonpath.js",
  "../packages/core/json.js",
  "../packages/core/yaml.js",
  "../packages/core/xpath.js",
  "../packages/core/mock-data.js",
  "../packages/core/json-compare.js",
  "./assets/js/modules/schema-generator.js",
  "./assets/js/modules/jsonpath-explorer.js",
  "./assets/js/modules/formatter.js",
  "./assets/js/modules/typescript-generator.js",
  "./assets/js/modules/compare.js",
  "./assets/js/modules/diff.js",
  "./assets/js/modules/xpath-generator.js",
  "./assets/js/modules/yaml-converter.js",
  "./assets/js/modules/jwt-inspector.js",
  "./assets/js/modules/encoder-decoder.js",
  "./assets/js/modules/secrets-redactor.js",
  "./assets/js/modules/curl-generator.js",
  "./assets/js/modules/schema-validator.js",
  "./assets/js/modules/schema-fixtures.js",
  "./assets/js/modules/openapi-explorer.js",
  "./assets/js/modules/regex-tester.js",
  "./assets/js/modules/uuid-generator.js",
  "./assets/js/modules/mock-generator.js",
];

async function installAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);
  await self.skipWaiting();
}

async function removeStaleCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames
    .filter((name) => name !== CACHE_NAME)
    .map((name) => caches.delete(name)));
  await self.clients.claim();
}

async function fetchAndCache(request) {
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function serveRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    return await fetchAndCache(request);
  } catch {
    return caches.match("./index.html");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(installAppShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(removeStaleCaches());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const isSameOriginGet = event.request.method === "GET" && requestUrl.origin === self.location.origin;
  if (isSameOriginGet) event.respondWith(serveRequest(event.request));
});
