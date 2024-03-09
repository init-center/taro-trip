import { mysqlTable, varchar, serial, int } from "drizzle-orm/mysql-core";

export const flights = mysqlTable("flights", {
  id: serial("id").primaryKey(),
  price: int("price").notNull(),
  departTime: varchar("depart_time", { length: 12 }).notNull(),
  arriveTime: varchar("arrive_time", { length: 12 }).notNull(),
  airCompanyName: varchar("air_company_name", { length: 50 }).notNull(),
  airIcon: varchar("air_icon", { length: 255 }).notNull(),
});
