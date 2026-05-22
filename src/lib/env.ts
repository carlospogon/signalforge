import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  DIRECT_DATABASE_URL: requireEnv("DIRECT_DATABASE_URL", process.env.DATABASE_URL),
  CRON_SECRET: process.env.CRON_SECRET ?? "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ?? "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  PEXELS_API_KEY: process.env.PEXELS_API_KEY ?? "",
  EDITORIAL_DAILY_BATCH_SIZE: Number.parseInt(process.env.EDITORIAL_DAILY_BATCH_SIZE ?? "10", 10) || 10
};
