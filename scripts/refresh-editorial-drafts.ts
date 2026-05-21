import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles, importedSignals, publicationReviews, sources } from "@/db/schema";
import { generateDraftArticle } from "@/lib/editorial/drafts";
import { DraftArticle, EditorialSource, ImportedSignal } from "@/types/editorial";

const activeSourceIds = [
  "openai-news-rss",
  "arxiv-cs-ai",
  "arxiv-cs-lg",
  "mit-technology-review-ai",
  "wired-top-stories",
  "wired-ai",
  "techcrunch-main",
  "the-verge-main",
  "venturebeat-main",
  "venturebeat-top-stories",
  "ars-all-news",
  "ars-technology-lab",
  "ars-science",
  "sciencedaily-top-science",
  "sciencedaily-ai",
  "live-science-all",
  "nasa-earth-observatory",
  "nasa-cneos-news",
  "esa-main-news",
  "esa-space-science",
  "esa-space-engineering",
  "spacecom-all",
  "nature-medicine",
  "nih-nibib-news",
  "jpl-news",
  "nlm-pubmed-news"
] as const;

function mapSourceRow(row: typeof sources.$inferSelect): EditorialSource {
  return {
    id: row.id,
    nombre: row.nombre,
    url: row.url,
    tipo: row.tipo,
    categoriaPrincipal: row.categoriaPrincipal,
    idioma: row.idioma,
    nivelFiabilidad: row.nivelFiabilidad,
    frecuenciaConsulta: row.frecuenciaConsulta,
    permiteAutopublicacion: row.permiteAutopublicacion,
    requiereRevision: row.requiereRevision
  };
}

function mapSignalRow(row: typeof importedSignals.$inferSelect, source: EditorialSource): ImportedSignal {
  return {
    id: row.id,
    tituloOriginal: row.tituloOriginal,
    urlOriginal: row.urlOriginal,
    guidOriginal: row.guidOriginal ?? undefined,
    fuente: source,
    fechaPublicacion: row.fechaPublicacion.toISOString(),
    resumenOriginal: row.resumenOriginal,
    palabrasClave: row.palabrasClave,
    categoriaSugerida: row.categoriaSugerida,
    fechaIngesta: row.fechaIngesta.toISOString(),
    hashUnico: row.hashUnico,
    imagenUrl: undefined,
    imagenAlt: undefined,
    clasificacion: {
      categoria: row.categoriaSugerida,
      relevancia: row.relevancia,
      riesgoEditorial: row.riesgoEditorial,
      prioridadPublicacion: row.prioridadPublicacion,
      accionSugerida: row.accionSugerida,
      formatoSugerido: row.formatoSugerido
    }
  };
}

function withDraftMedia(signal: ImportedSignal, draftRow: typeof draftArticles.$inferSelect): ImportedSignal {
  const draftFuente = draftRow.fuente as DraftArticle["fuente"];

  return {
    ...signal,
    imagenUrl: draftFuente.imagenUrl,
    imagenAlt: draftFuente.imagenAlt
  };
}

async function recordReview(draftId: string, notes: string) {
  await db.insert(publicationReviews).values({
    id: `review-${draftId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    draftId,
    reviewerName: "Codex",
    decision: "needs_review",
    notes
  });
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : undefined;

  const sourceRows = await db
    .select()
    .from(sources)
    .where(inArray(sources.id, [...activeSourceIds]));

  const sourceMap = new Map(sourceRows.map((row) => [row.id, mapSourceRow(row)]));

  const drafts = await db
    .select()
    .from(draftArticles)
    .where(
      and(
        inArray(draftArticles.sourceId, [...activeSourceIds]),
        ne(draftArticles.tipo, "opinion"),
        ne(draftArticles.estado, "published")
      )
    )
    .orderBy(desc(draftArticles.updatedAt), desc(draftArticles.fechaCreacion));
  const targetDrafts = Number.isFinite(limit) && limit && limit > 0 ? drafts.slice(0, limit) : drafts;

  let refreshed = 0;
  let skipped = 0;
  const sample: Array<{ id: string; estado: string; titulo: string }> = [];

  for (const draftRow of targetDrafts) {
    const source = sourceMap.get(draftRow.sourceId);

    if (!source) {
      skipped += 1;
      continue;
    }

    const [signalRow] = await db
      .select()
      .from(importedSignals)
      .where(eq(importedSignals.id, draftRow.signalId))
      .limit(1);

    if (!signalRow) {
      skipped += 1;
      continue;
    }

    const signal = withDraftMedia(mapSignalRow(signalRow, source), draftRow);
    const regenerated = await generateDraftArticle(signal);

    if (sample.length < 8) {
      sample.push({
        id: draftRow.id,
        estado: draftRow.estado,
        titulo: regenerated.titulo
      });
    }

    if (dryRun) {
      refreshed += 1;
      continue;
    }

    await db
      .update(draftArticles)
      .set({
        titulo: regenerated.titulo,
        slug: regenerated.slug,
        subtitulo: regenerated.subtitulo,
        entradilla: regenerated.entradilla,
        cuerpo: regenerated.cuerpo,
        categoria: regenerated.categoria,
        etiquetas: regenerated.etiquetas,
        fuentesConsultadas: regenerated.fuentesConsultadas,
        estado: "needs_review",
        autor: regenerated.autor,
        tipo: regenerated.tipo,
        fechaCreacion: new Date(regenerated.fechaCreacion),
        fechaPublicacionOriginal: new Date(regenerated.fechaPublicacionOriginal),
        fechaCaptura: new Date(regenerated.fechaCaptura),
        tiempoLectura: regenerated.tiempoLectura,
        seo: regenerated.seo,
        fuente: regenerated.fuente,
        riesgoEditorial: regenerated.riesgoEditorial,
        prioridadPublicacion: regenerated.prioridadPublicacion,
        accionSugerida: regenerated.accionSugerida,
        publishedArticleId: null,
        updatedAt: new Date()
      })
      .where(eq(draftArticles.id, draftRow.id));

    await recordReview(
      draftRow.id,
      "Draft refreshed in bulk from original imported signal after editorial pipeline update."
    );

    refreshed += 1;
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        totalCandidates: drafts.length,
        selectedCandidates: targetDrafts.length,
        refreshed,
        skipped,
        sample
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
