import pg from "pg";
import { readFile } from "node:fs/promises";

export const db = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// run ./init.sql

export async function init() {
  const sql = await readFile(new URL("./init.sql", import.meta.url), "utf-8");
  await db.query(sql);
  console.log("Database initialized");
}

init();
