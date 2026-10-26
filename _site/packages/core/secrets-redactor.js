export const SECRET_RULES = Object.freeze([
  {
    id: "authorization",
    label: "Authorization",
    pattern: /\b(Bearer\s+)[-\w.~+/=]{12,}/gi,
    replace: (_, prefix) => `${prefix}[REDACTED]`,
  },
  {
    id: "api-key",
    label: "API key",
    pattern: /\b(?:api[-_]?key|x-api-key)\s*[:=]\s*["']?([-\w]{12,})["']?/gi,
    replace: (match, value) => match.replace(value, "[REDACTED]"),
  },
  {
    id: "jwt",
    label: "JWT",
    pattern: /\beyJ[-\w]+\.[-\w]+\.[-\w]+\b/g,
    replace: "[REDACTED_JWT]",
  },
  {
    id: "private-key",
    label: "Private key",
    pattern: /-----BEGIN(?: [A-Z]+)? PRIVATE KEY-----[\s\S]*?-----END(?: [A-Z]+)? PRIVATE KEY-----/g,
    replace: "[REDACTED_PRIVATE_KEY]",
  },
  {
    id: "email",
    label: "Email",
    pattern: /\b[-\w.%+]+@[-\w.]+\.[A-Z]{2,}\b/gi,
    replace: "[REDACTED_EMAIL]",
  },
]);

function cloneRegex(regex) {
  return new RegExp(regex.source, regex.flags);
}

export function redactSecrets(input, enabledRuleIds = SECRET_RULES.map((rule) => rule.id)) {
  const enabledRules = new Set(enabledRuleIds);
  const findings = [];
  let output = input;

  SECRET_RULES.forEach((rule) => {
    if (!enabledRules.has(rule.id)) return;

    output = output.replace(cloneRegex(rule.pattern), (...argumentsList) => {
      const match = argumentsList[0];
      findings.push({
        rule: rule.id,
        label: rule.label,
        index: argumentsList.at(-2),
        value: match,
      });
      return typeof rule.replace === "function" ? rule.replace(...argumentsList) : rule.replace;
    });
  });

  return { output, findings };
}
