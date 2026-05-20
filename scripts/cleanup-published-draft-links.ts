import { and, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles } from "@/db/schema";

async function main() {
  const rows = await db
    .select()
    .from(draftArticles)
    .where(and(ne(draftArticles.estado, "published"), isNotNull(draftArticles.publishedArticleId)));

  let updated = 0;

  for (const row of rows) {
    await db
      .update(draftArticles)
      .set({
        publishedArticleId: null,
        updatedAt: new Date()
      })
      .where(eq(draftArticles.id, row.id));

    updated += 1;
  }

  console.log(
    JSON.stringify(
      {
        updated
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
