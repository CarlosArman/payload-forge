import { curlToFetch } from "../../../../packages/core/curl-to-fetch.js";

export { curlToFetch, parseCurl } from "../../../../packages/core/curl-to-fetch.js";

export const curlGenerator = {
  id: "curl",
  placeholder: "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -d '{\"name\":\"Ada\"}'",
  run(input) {
    try {
      return {
        output: curlToFetch(input),
        status: "Fetch generado desde cURL",
      };
    } catch (error) {
      return { error: error.message };
    }
  },
};
