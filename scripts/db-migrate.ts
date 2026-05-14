import { config as loadEnv } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

loadEnv({ path: ".env.local" });
loadEnv();

const connectionString = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

if (!connectionString) {
  throw new Error("Missing DIRECT_DATABASE_URL or DATABASE_URL for migrations.");
}

async function main() {
  const sql = postgres(connectionString, {
    max: 1,
    ssl: "require"
  });

  try {
    const db = drizzle(sql);
    await migrate(db, {
      migrationsFolder: "./drizzle"
    });
    console.log("Database migrations applied successfully.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Database migration failed.");
  console.error(error);
  process.exit(1);
});
