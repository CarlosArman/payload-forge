function appendToken(state) {
  if (state.token) state.tokens.push(state.token);
  state.token = "";
}

function readShellCharacter(state, character) {
  if (state.escaped) {
    state.token += character;
    state.escaped = false;
    return;
  }
  if (character === "\\") {
    state.escaped = true;
    return;
  }
  if (state.quote) {
    if (character === state.quote) state.quote = "";
    else state.token += character;
    return;
  }
  if (character === "'" || character === '"') {
    state.quote = character;
    return;
  }
  if (/\s/u.test(character)) {
    appendToken(state);
    return;
  }
  state.token += character;
}

function shellTokens(value) {
  const state = { tokens: [], token: "", quote: "", escaped: false };
  for (const character of value.trim()) readShellCharacter(state, character);

  if (state.quote) throw new Error("El comando cURL tiene una comilla sin cerrar.");
  if (state.escaped) state.token += "\\";
  appendToken(state);
  return state.tokens;
}

export function parseCurl(command) {
  const tokens = shellTokens(command);
  if (tokens[0] !== "curl") throw new Error("El comando debe comenzar con curl.");

  const headers = {};
  let method = "GET";
  let body;
  let url = "";

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];

    if (token === "-X" || token === "--request") {
      method = next?.toUpperCase() || method;
      index += 1;
    } else if (token === "-H" || token === "--header") {
      const separator = next?.indexOf(":") ?? -1;
      if (separator < 1) throw new Error("Una cabecera cURL debe tener el formato Nombre: valor.");
      headers[next.slice(0, separator).trim()] = next.slice(separator + 1).trim();
      index += 1;
    } else if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary") {
      body = next ?? "";
      if (method === "GET") method = "POST";
      index += 1;
    } else if (!token.startsWith("-")) {
      url = token;
    }
  }

  if (!url) throw new Error("El comando cURL no contiene una URL.");
  return { method, url, headers, body };
}

function formatBody(body) {
  if (body === undefined) return "";
  try {
    return `,\n  body: JSON.stringify(${JSON.stringify(JSON.parse(body), null, 2)})`;
  } catch {
    return `,\n  body: ${JSON.stringify(body)}`;
  }
}

export function curlToFetch(command) {
  const request = parseCurl(command);
  const headerLines = Object.entries(request.headers)
    .map(([name, value]) => `    ${JSON.stringify(name)}: ${JSON.stringify(value)}`)
    .join(",\n");
  const options = [
    `  method: ${JSON.stringify(request.method)}`,
    headerLines ? `  headers: {\n${headerLines}\n  }` : "",
  ].filter(Boolean).join(",\n");

  return `fetch(${JSON.stringify(request.url)}, {\n${options}${formatBody(request.body)}\n})\n  .then((response) => response.json())\n  .then((data) => console.log(data));`;
}
