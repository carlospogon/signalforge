import { eq } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles, publishedArticles } from "@/db/schema";
import { restoreSpanishText } from "@/lib/spanish";

function cleanObject(value: unknown): unknown {
  if (typeof value === "string") {
    return restoreSpanishText(value);
  }

  if (Array.isArray(value)) {
    return value.map(cleanObject);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, cleanObject(nested)]));
  }

  return value;
}

function sameJson(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function cleanupDrafts() {
  const rows = await db.select().from(draftArticles);
  let updated = 0;

  for (const row of rows) {
    const next = {
      titulo: restoreSpanishText(row.titulo),
      subtitulo: restoreSpanishText(row.subtitulo),
      entradilla: restoreSpanishText(row.entradilla),
      cuerpo: row.cuerpo.map((paragraph) => restoreSpanishText(paragraph)),
      seo: cleanObject(row.seo),
      fuente: cleanObject(row.fuente)
    };

    const current = {
      titulo: row.titulo,
      subtitulo: row.subtitulo,
      entradilla: row.entradilla,
      cuerpo: row.cuerpo,
      seo: row.seo,
      fuente: row.fuente
    };

    if (sameJson(next, current)) {
      continue;
    }

    await db
      .update(draftArticles)
      .set({
        ...next,
        updatedAt: new Date()
      })
      .where(eq(draftArticles.id, row.id));

    updated += 1;
  }

  return updated;
}

async function cleanupPublished() {
  const rows = await db.select().from(publishedArticles);
  let updated = 0;

  for (const row of rows) {
    const next = {
      titulo: restoreSpanishText(row.titulo),
      excerpt: restoreSpanishText(row.excerpt),
      deck: row.deck ? restoreSpanishText(row.deck) : row.deck,
      cuerpo: row.cuerpo.map((paragraph) => restoreSpanishText(paragraph)),
      tag: restoreSpanishText(row.tag),
      visualAlt: row.visualAlt ? restoreSpanishText(row.visualAlt) : row.visualAlt
    };

    const current = {
      titulo: row.titulo,
      excerpt: row.excerpt,
      deck: row.deck,
      cuerpo: row.cuerpo,
      tag: row.tag,
      visualAlt: row.visualAlt
    };

    if (sameJson(next, current)) {
      continue;
    }

    await db
      .update(publishedArticles)
      .set({
        ...next,
        updatedAt: new Date()
      })
      .where(eq(publishedArticles.id, row.id));

    updated += 1;
  }

  return updated;
}

async function main() {
  const draftUpdates = await cleanupDrafts();
  const publishedUpdates = await cleanupPublished();

  console.log(
    JSON.stringify(
      {
        draftUpdates,
        publishedUpdates
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
