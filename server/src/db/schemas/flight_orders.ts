import { mysqlTable, varchar, serial, decimal } from "drizzle-orm/mysql-core";

export const flightOrders = mysqlTable("flight_orders", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 11 }).notNull(),
  departCity: varchar("depart_city", { length: 50 }).notNull(),
  arriveCity: varchar("arrive_city", { length: 50 }).notNull(),
  departTime: varchar("depart_time", { length: 50 }).notNull(),
  arriveTime: varchar("arrive_time", { length: 50 }).notNull(),
  departDate: varchar("depart_date", { length: 50 }).notNull(),
  departAirport: varchar("depart_airport", { length: 50 }).notNull(),
  arriveAirport: varchar("arrive_airport", { length: 50 }).notNull(),
  airCompany: varchar("air_company", { length: 50 }).notNull(),
  price: decimal("price").notNull(),
});
