import { eq } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles, publishedArticles } from "@/db/schema";
import { resolveEditorialImage } from "@/lib/editorial/image-resolution";
import { DraftArticle } from "@/types/editorial";

async function backfillDraftImages() {
  const rows = await db.select().from(draftArticles);
  let draftUpdates = 0;
  let publishedUpdates = 0;

  for (const row of rows) {
    const fuente = row.fuente as DraftArticle["fuente"];
    const seo = row.seo as DraftArticle["seo"];
    const currentImageUrl = fuente.imagenUrl?.trim();

    if (currentImageUrl) {
      continue;
    }

    const resolved = await resolveEditorialImage({
      articleUrl: fuente.urlOriginal || seo.fuenteOriginal,
      title: row.titulo,
      summary: row.entradilla,
      keywords: row.etiquetas,
      category: row.categoria,
      existingImageUrl: currentImageUrl
    });

    if (!resolved.imageUrl) {
      continue;
    }

    const nextFuente = {
      ...fuente,
      imagenUrl: resolved.imageUrl,
      imagenAlt: resolved.imageAlt ?? fuente.imagenAlt ?? row.titulo
    };

    await db
      .update(draftArticles)
      .set({
        fuente: nextFuente,
        updatedAt: new Date()
      })
      .where(eq(draftArticles.id, row.id));

    draftUpdates += 1;

    if (row.publishedArticleId) {
      await db
        .update(publishedArticles)
        .set({
          visualUrl: resolved.imageUrl,
          visualAlt: resolved.imageAlt ?? row.titulo,
          updatedAt: new Date()
        })
        .where(eq(publishedArticles.id, row.publishedArticleId));

      publishedUpdates += 1;
    }
  }

  return {
    draftUpdates,
    publishedUpdates
  };
}

async function main() {
  const result = await backfillDraftImages();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
