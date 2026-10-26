import { SECRET_RULES, redactSecrets } from "../../../../packages/core/secrets-redactor.js";

function options() {
  return SECRET_RULES
    .map((rule) => `<label class="option-control"><input type="checkbox" data-redactor-rule="${rule.id}" checked> ${rule.label}</label>`)
    .join("");
}

function redactionStatus(count) {
  if (!count) return "No se detectaron secretos";
  const pluralSuffix = count === 1 ? "" : "s";
  return `${count} secreto${pluralSuffix} redactado${pluralSuffix}`;
}

export { redactSecrets };

export const secretsRedactor = {
  id: "redactor",
  placeholder: "Pega un payload, log, cabecera o configuración que pueda contener secretos.",
  options: options(),
  run(input) {
    const enabledRuleIds = [...document.querySelectorAll("[data-redactor-rule]:checked")]
      .map((inputElement) => inputElement.dataset.redactorRule);
    const { output, findings } = redactSecrets(input, enabledRuleIds);
    return { output, status: redactionStatus(findings.length) };
  },
};
