const MAX_MATCHES = 500;

export function parseRegex(pattern, flags = "") {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(`Expresión regular inválida: ${error.message}`);
  }
}

function globalFlags(regex) {
  return regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
}

export function testRegex(pattern, input, flags = "") {
  const regex = parseRegex(pattern, flags);
  const globalRegex = new RegExp(regex.source, globalFlags(regex));
  const matches = [];
  let match;

  while ((match = globalRegex.exec(input)) !== null && matches.length < MAX_MATCHES) {
    matches.push({
      index: match.index,
      value: match[0],
      groups: match.slice(1),
    });
    if (match[0] === "") globalRegex.lastIndex += 1;
  }

  return {
    matches,
    truncated: matches.length === MAX_MATCHES,
    matched: matches.length > 0,
  };
}
