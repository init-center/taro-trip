import { mysqlTable, varchar, serial, int } from "drizzle-orm/mysql-core";

export const airports = mysqlTable("airports", {
  id: serial("id").primaryKey(),
  cityId: int("city_id").notNull(),
  cityName: varchar("city_name", { length: 20 }).notNull(),
  airportName: varchar("airport_name", { length: 50 }).notNull(),
  firstLetter: varchar("first_letter", { length: 1 }).notNull(),
});
