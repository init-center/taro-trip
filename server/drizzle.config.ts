import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/index.ts",
  dialect: "mysql",
  out: "./src/server/db/drizzle",
  dbCredentials: {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "mysql",
    database: "taro-trip",
  },
});
