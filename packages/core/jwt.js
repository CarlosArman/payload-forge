function decodeBase64Url(segment) {
  if (!segment || !/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new Error("El token contiene un segmento Base64URL inválido.");
  }

  const normalized = segment.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(`${normalized}${padding}`);
  const bytes = Uint8Array.from(binary, (character) => character.codePointAt(0));
  return new TextDecoder().decode(bytes);
}

function parseSegment(segment, label) {
  try {
    return JSON.parse(decodeBase64Url(segment));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`El ${label} del token no contiene JSON válido.`);
    }
    throw error;
  }
}

function formatTimestamp(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Date(value * 1000).toISOString();
}

export function decodeJwt(input) {
  const token = input.trim().replace(/^Bearer\s+/i, "");
  const segments = token.split(".");

  if (segments.length !== 3) {
    throw new Error("Un JWT debe contener exactamente tres segmentos separados por puntos.");
  }

  const [encodedHeader, encodedPayload, signature] = segments;
  if (!signature) throw new Error("El JWT no contiene una firma.");

  const header = parseSegment(encodedHeader, "header");
  const payload = parseSegment(encodedPayload, "payload");
  const claims = {
    issuedAt: formatTimestamp(payload.iat),
    notBefore: formatTimestamp(payload.nbf),
    expiresAt: formatTimestamp(payload.exp),
  };

  return { header, payload, claims, signature };
}
