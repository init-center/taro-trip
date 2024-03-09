import { mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";

export const ads = mysqlTable("ads", {
  id: serial("id").primaryKey(),
  imgUrl: varchar("img_url", { length: 256 }).notNull(),
  linkUrl: varchar("link_url", { length: 256 }).notNull(),
});
