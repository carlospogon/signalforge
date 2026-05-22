import { and, desc, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles, publicationReviews } from "@/db/schema";

const keepPerCategoryArg = process.argv.find((arg) => arg.startsWith("--keep-per-category="));
const dryRun = process.argv.includes("--dry-run");
const keepPerCategory = Number.parseInt(keepPerCategoryArg?.split("=")[1] ?? "3", 10) || 3;

const stateScore: Record<string, number> = {
  approved: 4,
  needs_review: 3,
  draft: 2,
  imported: 1,
  rejected: 0,
  published: 0
};

const priorityScore: Record<string, number> = {
  urgente: 4,
  alta: 3,
  media: 2,
  baja: 1
};

function compareDrafts(a: typeof draftArticles.$inferSelect, b: typeof draftArticles.$inferSelect) {
  const stateDelta = (stateScore[b.estado] ?? 0) - (stateScore[a.estado] ?? 0);

  if (stateDelta !== 0) {
    return stateDelta;
  }

  const priorityDelta = (priorityScore[b.prioridadPublicacion] ?? 0) - (priorityScore[a.prioridadPublicacion] ?? 0);

  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return b.updatedAt.getTime() - a.updatedAt.getTime();
}

async function main() {
  const rows = await db
    .select()
    .from(draftArticles)
    .where(and(ne(draftArticles.estado, "published"), ne(draftArticles.estado, "rejected")))
    .orderBy(desc(draftArticles.updatedAt), desc(draftArticles.fechaCreacion));

  const grouped = new Map<string, Array<typeof draftArticles.$inferSelect>>();

  for (const row of rows) {
    const list = grouped.get(row.categoria) ?? [];
    list.push(row);
    grouped.set(row.categoria, list);
  }

  const rejectIds: string[] = [];
  const summary: Record<string, { total: number; kept: number; rejected: number }> = {};

  for (const [category, drafts] of grouped.entries()) {
    const sorted = [...drafts].sort(compareDrafts);
    const kept = sorted.slice(0, keepPerCategory);
    const rejected = sorted.slice(keepPerCategory);

    rejectIds.push(...rejected.map((draft) => draft.id));
    summary[category] = {
      total: drafts.length,
      kept: kept.length,
      rejected: rejected.length
    };
  }

  if (!dryRun && rejectIds.length > 0) {
    const now = new Date();

    await db
      .update(draftArticles)
      .set({
        estado: "rejected",
        publishedArticleId: null,
        updatedAt: now
      })
      .where(inArray(draftArticles.id, rejectIds));

    await db.insert(publicationReviews).values(
      rejectIds.map((draftId, index) => ({
        id: `review-${draftId}-${Date.now()}-${index}`,
        draftId,
        reviewerName: "Codex",
        decision: "rejected" as const,
        notes: `Backlog trim: kept top ${keepPerCategory} active drafts per category in admin queue.`
      }))
    );
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        keepPerCategory,
        activeDrafts: rows.length,
        resultingActiveDrafts: Array.from(grouped.values()).reduce(
          (count, drafts) => count + Math.min(drafts.length, keepPerCategory),
          0
        ),
        rejectedDrafts: rejectIds.length,
        summary
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
