import { randomUuidV4 } from "./uuid.js";

const firstNames = ["Ada", "Linus", "Grace", "Sofia", "Diego", "Amara", "Noah", "Lucía"];
const lastNames = ["Lovelace", "Torvalds", "Hopper", "Martínez", "Kim", "Okafor", "Silva", "Chen"];
const streets = ["Avenida Central", "Calle Aurora", "Boulevard Atlas", "Calle Prisma", "Paseo del Código"];
const domains = ["example.dev", "payloadforge.app", "qa-lab.test", "api.local"];
const cities = ["Lima", "Madrid", "Bogotá", "CDMX", "Santiago"];

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function record(index) {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  return {
    id: index + 1,
    uuid: randomUuidV4(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(domains)}`,
    phone: `+1 ${number(200, 999)}-${number(100, 999)}-${number(1000, 9999)}`,
    address: `${number(1, 9999)} ${pick(streets)}, ${pick(cities)}`,
    createdAt: new Date(Date.now() - number(0, 365) * 86400000).toISOString(),
  };
}

export function generateMockRecords(count, custom = {}) {
  return Array.from({ length: count }, (_, index) => ({ ...record(index), ...custom }));
}
