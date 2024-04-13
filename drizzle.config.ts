import type { Config } from "drizzle-kit";
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not set");
}

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString,
  },
  schemaFilter: ["accounting", "public"],
  tablesFilter: ["ynab_transactions", "bills", "ramp_transactions"],
} satisfies Config;
