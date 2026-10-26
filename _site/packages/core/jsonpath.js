export const MAX_EXPLORER_NODES = 1000;

function pathFor(parent, key) {
  if (typeof key === "number") return `${parent}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/u.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;
}

export function collectPaths(value, current = "$", paths = []) {
  if (paths.length >= MAX_EXPLORER_NODES || value === null || typeof value !== "object") return paths;

  Object.entries(value).forEach(([key, child]) => {
    if (paths.length >= MAX_EXPLORER_NODES) return;
    const path = pathFor(current, Array.isArray(value) ? Number(key) : key);
    paths.push(path);
    collectPaths(child, path, paths);
  });

  return paths;
}
