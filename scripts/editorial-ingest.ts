import { config as loadEnv } from "dotenv";
import { refreshEditorialData, getEditorialSummaryFromDb } from "@/lib/editorial/store";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  await refreshEditorialData();
  const summary = await getEditorialSummaryFromDb();
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error("Editorial ingestion failed.");
  console.error(error);
  process.exit(1);
});
