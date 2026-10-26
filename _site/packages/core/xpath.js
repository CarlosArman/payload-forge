export const MAX_XPATH_NODES = 1000;

export function parseXml(input) {
  const documentXml = new DOMParser().parseFromString(input, "application/xml");
  const error = documentXml.querySelector("parsererror");
  return error ? { error: "XML inválido. Verifica etiquetas de apertura, cierre y atributos." } : { value: documentXml };
}

function xpathName(element) {
  return element.prefix ? `${element.prefix}:${element.localName}` : element.localName;
}

export function getXpaths(element, parent = "", paths = []) {
  if (paths.length >= MAX_XPATH_NODES) return paths;

  const name = xpathName(element);
  const siblings = Array.from(element.parentElement?.children ?? []).filter((item) => xpathName(item) === name);
  const index = siblings.length > 1 ? `[${siblings.indexOf(element) + 1}]` : "";
  const path = `${parent}/${name}${index}`;
  paths.push(path);

  Array.from(element.attributes).some((attribute) => {
    if (paths.length >= MAX_XPATH_NODES) return true;
    const attributeName = attribute.prefix ? `${attribute.prefix}:${attribute.localName}` : attribute.name;
    paths.push(`${path}/@${attributeName}`);
    return false;
  });

  Array.from(element.children).some((child) => {
    getXpaths(child, path, paths);
    return paths.length >= MAX_XPATH_NODES;
  });

  return paths;
}
