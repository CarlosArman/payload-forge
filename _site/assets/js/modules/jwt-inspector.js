import { decodeJwt } from "../../../packages/core/jwt.js";

function claimLines(claims) {
  const labels = [
    ["Issued at", claims.issuedAt],
    ["Not before", claims.notBefore],
    ["Expires at", claims.expiresAt],
  ];

  return labels
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export { decodeJwt };

export const jwtInspector = {
  id: "jwt",
  placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSIsImlhdCI6MTcxMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.signature",
  run(input) {
    try {
      const { header, payload, claims } = decodeJwt(input);
      const expiry = typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
      const summary = claimLines(claims);
      const sections = [
        `HEADER\n${JSON.stringify(header, null, 2)}`,
        `PAYLOAD\n${JSON.stringify(payload, null, 2)}`,
      ];
      if (summary) sections.push(`CLAIMS\n${summary}`);

      return {
        output: sections.join("\n\n"),
        status: expiry ? "JWT decodificado; el token está expirado" : "JWT decodificado localmente",
      };
    } catch (error) {
      return { error: error.message };
    }
  },
};
