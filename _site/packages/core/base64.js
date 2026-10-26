function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCodePoint(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.codePointAt(0));
}

function normalizeBase64Url(value) {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) {
    throw new Error("El valor Base64URL contiene caracteres no válidos.");
  }

  const standard = value.replaceAll("-", "+").replaceAll("_", "/");
  return `${standard}${"=".repeat((4 - (standard.length % 4)) % 4)}`;
}

export function encodeBase64(value, urlSafe = false) {
  const encoded = bytesToBase64(new TextEncoder().encode(value));
  if (!urlSafe) return encoded;
  return encoded.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeBase64(value, urlSafe = false) {
  try {
    const normalized = urlSafe ? normalizeBase64Url(value) : value;
    return new TextDecoder("utf-8", { fatal: true }).decode(base64ToBytes(normalized));
  } catch {
    const message = urlSafe ? "El valor no es Base64URL válido." : "El valor no es Base64 válido.";
    throw new Error(message);
  }
}
