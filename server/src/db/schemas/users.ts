import { mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 11 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  name: varchar("name", { length: 20 }).notNull(),
});
