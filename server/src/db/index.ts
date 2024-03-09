import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schemas from "./schemas";

const createDb = async () => {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    database: "taro-trip",
    password: "mysql",
  });

  return drizzle(connection, {
    schema: schemas,
    mode: "default",
  });
};

const db = await createDb();

export default db;
