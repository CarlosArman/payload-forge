function pathFor(parent, key) {
  if (typeof key === "number") return `${parent}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/u.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;
}

export function splitComparisonDocuments(input) {
  const separatorIndexes = [];
  const lines = input.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.trim() === "---") separatorIndexes.push(index);
  });

  if (separatorIndexes.length !== 1) {
    return { error: "Separa exactamente dos documentos JSON mediante una línea que contenga ---." };
  }

  const [separatorIndex] = separatorIndexes;
  const left = lines.slice(0, separatorIndex).join("\n");
  const right = lines.slice(separatorIndex + 1).join("\n");
  return right.trim() ? { left, right } : { error: "Separa exactamente dos documentos JSON mediante una línea que contenga ---." };
}

export function collectDifferences(left, right, path = "$", differences = []) {
  if (Object.is(left, right)) return differences;

  const leftObject = left && typeof left === "object";
  const rightObject = right && typeof right === "object";
  if (!leftObject || !rightObject || Array.isArray(left) !== Array.isArray(right)) {
    differences.push({ type: "changed", path, before: left, after: right });
    return differences;
  }

  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  keys.forEach((key) => {
    const childPath = pathFor(path, Array.isArray(left) ? Number(key) : key);
    if (!(key in left)) differences.push({ type: "added", path: childPath, after: right[key] });
    else if (!(key in right)) differences.push({ type: "removed", path: childPath, before: left[key] });
    else collectDifferences(left[key], right[key], childPath, differences);
  });

  return differences;
}
