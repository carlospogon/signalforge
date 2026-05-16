import { and, count, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import {
  draftArticles,
  importedSignals,
  publicationReviews,
  publishedArticles,
  sources
} from "@/db/schema";
import { editorialSources } from "@/data/editorial-sources";
import { generateDraftArticle } from "@/lib/editorial/drafts";
import { fetchSourceSignals } from "@/lib/editorial/feed";
import { classifySignal } from "@/lib/editorial/classify";
import { restoreSpanishText } from "@/lib/spanish";
import { DraftArticle, EditorialCategory, EditorialSource, ImportedSignal, SourceSignal } from "@/types/editorial";
import { Article } from "@/types/article";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createStableHash(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return `sig-${Math.abs(hash).toString(16)}`;
}

const categoryAccents: Record<DraftArticle["categoria"], string> = {
  ia: "from-[#0b2f35] via-[#0f5e63] to-[#9be3ef]",
  ciencia: "from-[#1a224d] via-[#3148b7] to-[#8cc0ff]",
  tecnologia: "from-[#10211b] via-[#236b4c] to-[#89f0ad]",
  espacio: "from-[#120d27] via-[#342a79] to-[#9bb8ff]",
  salud: "from-[#29151a] via-[#7e3245] to-[#ffb4c0]",
  biotech: "from-[#182328] via-[#2d6c78] to-[#98ecea]",
  ciberseguridad: "from-[#1f1510] via-[#7a4b1f] to-[#ffb77a]",
  laboratorio: "from-[#111f29] via-[#2a6b7d] to-[#90e8ff]",
  opinion: "from-[#1f1a0c] via-[#6f5b19] to-[#ffe17a]"
};

const categoryTags: Record<DraftArticle["categoria"], string> = {
  ia: "IA",
  ciencia: "Ciencia",
  tecnologia: "Tecnología",
  espacio: "Espacio",
  salud: "Salud",
  biotech: "Biotech",
  ciberseguridad: "Ciberseguridad",
  laboratorio: "Laboratorio",
  opinion: "Opinión"
};

function formatPublishedLabel(value: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value);
}

function mapDraftToTag(draft: DraftArticle) {
  if (draft.tipo === "radar") {
    return "Radar";
  }

  if (draft.tipo === "analysis") {
    return "Análisis";
  }

  return categoryTags[draft.categoria];
}

function serializeSource(source: EditorialSource) {
  return {
    id: source.id,
    nombre: source.nombre,
    url: source.url,
    tipo: source.tipo,
    categoriaPrincipal: source.categoriaPrincipal,
    idioma: source.idioma,
    nivelFiabilidad: source.nivelFiabilidad,
    frecuenciaConsulta: source.frecuenciaConsulta,
    permiteAutopublicacion: source.permiteAutopublicacion,
    requiereRevision: source.requiereRevision
  };
}

function buildImportedSignal(entry: SourceSignal, source: EditorialSource): ImportedSignal {
  const publicationDay = entry.fechaPublicacion.slice(0, 10);
  const dedupeSeed =
    entry.guidOriginal ||
    `${normalizeText(entry.tituloOriginal)}::${normalizeText(entry.resumenOriginal).slice(0, 120)}::${publicationDay}`;
  const hashUnico = createStableHash(dedupeSeed);
  const fechaIngesta = new Date().toISOString();
  const signalBase = {
    id: entry.id,
    tituloOriginal: entry.tituloOriginal,
    urlOriginal: entry.urlOriginal,
    guidOriginal: entry.guidOriginal,
    fuente: source,
    fechaPublicacion: entry.fechaPublicacion,
    resumenOriginal: entry.resumenOriginal,
    palabrasClave: entry.palabrasClave,
    fechaIngesta,
    hashUnico,
    imagenUrl: entry.imagenUrl,
    imagenAlt: entry.imagenAlt
  };
  const clasificacion = classifySignal(signalBase);

  return {
    ...signalBase,
    categoriaSugerida: clasificacion.categoria,
    clasificacion
  };
}

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

function mapDraftRow(row: typeof draftArticles.$inferSelect): DraftArticle {
  return {
    id: row.id,
    titulo: row.titulo,
    slug: row.slug,
    subtitulo: row.subtitulo,
    entradilla: row.entradilla,
    cuerpo: row.cuerpo,
    categoria: row.categoria,
    etiquetas: row.etiquetas,
    fuentesConsultadas: row.fuentesConsultadas as DraftArticle["fuentesConsultadas"],
    estado: row.estado,
    autor: row.autor,
    tipo: row.tipo,
    fechaCreacion: row.fechaCreacion.toISOString(),
    fechaPublicacionOriginal: row.fechaPublicacionOriginal.toISOString(),
    fechaCaptura: row.fechaCaptura.toISOString(),
    tiempoLectura: row.tiempoLectura,
    seo: row.seo as DraftArticle["seo"],
    fuente: row.fuente as DraftArticle["fuente"],
    riesgoEditorial: row.riesgoEditorial,
    prioridadPublicacion: row.prioridadPublicacion,
    accionSugerida: row.accionSugerida,
    originalSignalId: row.signalId
  };
}

function slugifyDraftTitle(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isDirectImageUrl(value: string) {
  try {
    const url = new URL(value);
    return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function resolvePexelsImageUrl(value: string) {
  try {
    const url = new URL(value);

    if (!url.hostname.includes("pexels.com")) {
      return null;
    }

    const match = url.pathname.match(/-(\d+)\/?$/) ?? url.pathname.match(/\/photo\/(?:.+-)?(\d+)\/?$/);
    const id = match?.[1];

    if (!id) {
      return null;
    }

    return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  } catch {
    return null;
  }
}

function extractMetaImage(html: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function resolveImageUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (isDirectImageUrl(trimmed)) {
    return trimmed;
  }

  const pexelsImageUrl = resolvePexelsImageUrl(trimmed);

  if (pexelsImageUrl) {
    return pexelsImageUrl;
  }

  try {
    const response = await fetch(trimmed, {
      headers: {
        "User-Agent": "Mozilla/5.0 SynaptikEditorial/1.0"
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return trimmed;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.startsWith("image/")) {
      return trimmed;
    }

    if (!contentType.includes("text/html")) {
      return trimmed;
    }

    const html = await response.text();
    const candidate = extractMetaImage(html);

    if (!candidate) {
      return trimmed;
    }

    return new URL(candidate, trimmed).toString();
  } catch {
    return trimmed;
  }
}

function mapPublishedArticleRow(
  row: typeof publishedArticles.$inferSelect,
  draftRow?: typeof draftArticles.$inferSelect | null
): Article {
  const draftFuente = draftRow?.fuente as DraftArticle["fuente"] | undefined;
  const title = draftRow?.titulo ?? row.titulo;
  const excerpt = draftRow?.entradilla ?? row.excerpt;
  const deck = draftRow?.subtitulo ?? row.deck ?? undefined;
  const body = draftRow?.cuerpo ?? row.cuerpo;

  return {
    id: row.slug,
    title: restoreSpanishText(title),
    excerpt: restoreSpanishText(excerpt),
    category: row.categoria,
    author: row.autor,
    readingTime: row.tiempoLectura,
    publishedAt: formatPublishedLabel(row.publishedAt),
    accent: row.accent,
    tag: restoreSpanishText(row.tag),
    deck: deck ? restoreSpanishText(deck) : undefined,
    body: body.map((paragraph) => restoreSpanishText(paragraph)),
    visual:
      row.visualUrl || draftFuente?.imagenUrl
      ? {
          mode: "asset",
          src: row.visualUrl ?? draftFuente?.imagenUrl ?? "",
          alt: row.visualAlt ?? draftFuente?.imagenAlt ?? restoreSpanishText(title)
        }
      : undefined
  };
}

function buildPublishedArticlePayload(draft: DraftArticle, publishedAt: Date) {
  return {
    draftId: draft.id,
    slug: draft.slug,
    titulo: draft.titulo,
    excerpt: draft.entradilla,
    deck: draft.subtitulo,
    cuerpo: draft.cuerpo,
    categoria: draft.categoria,
    autor: draft.autor,
    tiempoLectura: draft.tiempoLectura,
    accent: categoryAccents[draft.categoria],
    tag: mapDraftToTag(draft),
    visualUrl: draft.fuente.imagenUrl ?? null,
    visualAlt: draft.fuente.imagenAlt ?? draft.titulo,
    publishedAt,
    updatedAt: new Date()
  };
}

const activeSourceUrls = new Set(editorialSources.map((source) => source.url));

async function getActiveSourceRows() {
  const rows = await db.select().from(sources).orderBy(sources.nombre);
  return rows.filter((row) => activeSourceUrls.has(row.url));
}

export async function syncEditorialSources() {
  for (const source of editorialSources) {
    const [existingById] = await db.select().from(sources).where(eq(sources.id, source.id)).limit(1);
    const [existingByUrl] = existingById
      ? [existingById]
      : await db.select().from(sources).where(eq(sources.url, source.url)).limit(1);

    if (existingByUrl) {
      await db
        .update(sources)
        .set({
          nombre: source.nombre,
          url: source.url,
          tipo: source.tipo,
          categoriaPrincipal: source.categoriaPrincipal,
          idioma: source.idioma,
          nivelFiabilidad: source.nivelFiabilidad,
          frecuenciaConsulta: source.frecuenciaConsulta,
          permiteAutopublicacion: source.permiteAutopublicacion,
          requiereRevision: source.requiereRevision,
          updatedAt: new Date()
        })
        .where(eq(sources.id, existingByUrl.id));
      continue;
    }

    await db.insert(sources).values(serializeSource(source));
  }

  const rows = await getActiveSourceRows();
  return rows.map(mapSourceRow);
}

async function upsertImportedSignal(signal: ImportedSignal) {
  const guidOriginal = signal.guidOriginal ?? signal.urlOriginal;
  const [existing] = await db
    .select({ id: importedSignals.id })
    .from(importedSignals)
    .where(
      or(
        eq(importedSignals.id, signal.id),
        eq(importedSignals.urlOriginal, signal.urlOriginal),
        eq(importedSignals.hashUnico, signal.hashUnico),
        eq(importedSignals.guidOriginal, guidOriginal)
      )
    )
    .limit(1);

  const payload = {
    sourceId: signal.fuente.id,
    tituloOriginal: signal.tituloOriginal,
    urlOriginal: signal.urlOriginal,
    guidOriginal,
    fechaPublicacion: new Date(signal.fechaPublicacion),
    resumenOriginal: signal.resumenOriginal,
    palabrasClave: [],
    categoriaSugerida: signal.categoriaSugerida,
    relevancia: signal.clasificacion.relevancia,
    riesgoEditorial: signal.clasificacion.riesgoEditorial,
    prioridadPublicacion: signal.clasificacion.prioridadPublicacion,
    accionSugerida: signal.clasificacion.accionSugerida,
    formatoSugerido: signal.clasificacion.formatoSugerido,
    fechaIngesta: new Date(signal.fechaIngesta),
    hashUnico: signal.hashUnico
  };

  if (existing) {
    await db.update(importedSignals).set(payload).where(eq(importedSignals.id, existing.id));
    return existing.id;
  }

  await db.insert(importedSignals).values({
    id: signal.id,
    ...payload
  });
  return signal.id;
}

async function upsertDraft(draft: DraftArticle) {
  await db
    .insert(draftArticles)
    .values({
      id: draft.id,
      signalId: draft.originalSignalId,
      sourceId: draft.fuente.id,
      titulo: draft.titulo,
      slug: draft.slug,
      subtitulo: draft.subtitulo,
      entradilla: draft.entradilla,
      cuerpo: draft.cuerpo,
      categoria: draft.categoria,
      etiquetas: draft.etiquetas,
      fuentesConsultadas: draft.fuentesConsultadas,
      estado: draft.estado,
      autor: draft.autor,
      tipo: draft.tipo,
      fechaCreacion: new Date(draft.fechaCreacion),
      fechaPublicacionOriginal: new Date(draft.fechaPublicacionOriginal),
      fechaCaptura: new Date(draft.fechaCaptura),
      tiempoLectura: draft.tiempoLectura,
      seo: draft.seo,
      fuente: draft.fuente,
      riesgoEditorial: draft.riesgoEditorial,
      prioridadPublicacion: draft.prioridadPublicacion,
      accionSugerida: draft.accionSugerida,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: draftArticles.id,
      set: {
        titulo: draft.titulo,
        slug: draft.slug,
        subtitulo: draft.subtitulo,
        entradilla: draft.entradilla,
        cuerpo: draft.cuerpo,
        categoria: draft.categoria,
        etiquetas: draft.etiquetas,
        fuentesConsultadas: draft.fuentesConsultadas,
        estado: draft.estado,
        autor: draft.autor,
        tipo: draft.tipo,
        fechaCreacion: new Date(draft.fechaCreacion),
        fechaPublicacionOriginal: new Date(draft.fechaPublicacionOriginal),
        fechaCaptura: new Date(draft.fechaCaptura),
        tiempoLectura: draft.tiempoLectura,
        seo: draft.seo,
        fuente: draft.fuente,
        riesgoEditorial: draft.riesgoEditorial,
        prioridadPublicacion: draft.prioridadPublicacion,
        accionSugerida: draft.accionSugerida,
        updatedAt: new Date()
      }
    });
}

export async function refreshEditorialData() {
  const persistedSources = await syncEditorialSources();

  for (const source of persistedSources) {
    try {
      const rawSignals = await fetchSourceSignals(source);

      for (const rawSignal of rawSignals) {
        const imported = buildImportedSignal(rawSignal, source);
        const signalId = await upsertImportedSignal(imported);

        if (imported.categoriaSugerida === "opinion") {
          continue;
        }

        try {
          await upsertDraft({
            ...(await generateDraftArticle(imported)),
            id: `draft-${signalId}`,
            originalSignalId: signalId
          });
        } catch {
          // Invalid or manual-only drafts stay outside the automatic queue.
        }
      }
    } catch (error) {
      console.error(`Editorial ingestion failed for source ${source.id}`, error);
    }
  }
}

export async function listEditorialSources() {
  const rows = await getActiveSourceRows();
  return rows.map(mapSourceRow);
}

export async function listImportedSignals(limit = 50) {
  const activeRows = await getActiveSourceRows();
  const activeIds = activeRows.map((row) => row.id);

  if (activeIds.length === 0) {
    return [];
  }

  const signalRows = await db
    .select()
    .from(importedSignals)
    .where(inArray(importedSignals.sourceId, activeIds))
    .orderBy(desc(importedSignals.fechaPublicacion), desc(importedSignals.createdAt))
    .limit(limit);

  if (signalRows.length === 0) {
    return [];
  }

  const sourceMap = new Map(activeRows.map((row) => [row.id, mapSourceRow(row)]));

  return signalRows
    .map((row) => {
      const source = sourceMap.get(row.sourceId);
      return source ? mapSignalRow(row, source) : null;
    })
    .filter((signal): signal is ImportedSignal => signal !== null);
}

export async function listDraftArticles(limit = 50) {
  const activeRows = await getActiveSourceRows();
  const activeIds = activeRows.map((row) => row.id);

  if (activeIds.length === 0) {
    return [];
  }

  const rows = await db
    .select()
    .from(draftArticles)
    .where(inArray(draftArticles.sourceId, activeIds))
    .orderBy(desc(draftArticles.fechaCreacion), desc(draftArticles.createdAt))
    .limit(limit);

  return rows.map(mapDraftRow);
}

export async function getDraftArticleById(draftId: string) {
  const [row] = await db.select().from(draftArticles).where(eq(draftArticles.id, draftId)).limit(1);
  return row ? mapDraftRow(row) : null;
}

export async function listPublishedArticles() {
  const rows = await db
    .select({
      article: publishedArticles,
      draft: draftArticles
    })
    .from(publishedArticles)
    .leftJoin(draftArticles, eq(draftArticles.id, publishedArticles.draftId))
    .orderBy(desc(publishedArticles.publishedAt));

  return rows.map(({ article, draft }) => mapPublishedArticleRow(article, draft));
}

export async function getPublishedArticleBySlug(slug: string) {
  const [row] = await db
    .select({
      article: publishedArticles,
      draft: draftArticles
    })
    .from(publishedArticles)
    .leftJoin(draftArticles, eq(draftArticles.id, publishedArticles.draftId))
    .where(eq(publishedArticles.slug, slug))
    .limit(1);

  return row ? mapPublishedArticleRow(row.article, row.draft) : null;
}

async function recordPublicationReview(
  draftId: string,
  reviewerName: string,
  decision: DraftArticle["estado"],
  notes?: string
) {
  await db.insert(publicationReviews).values({
    id: `review-${draftId}-${Date.now()}`,
    draftId,
    reviewerName,
    decision,
    notes
  });
}

export async function updateDraftState(draftId: string, estado: DraftArticle["estado"], reviewerName: string) {
  const [draft] = await db.select().from(draftArticles).where(eq(draftArticles.id, draftId)).limit(1);

  if (!draft) {
    throw new Error("Draft not found.");
  }

  await db
    .update(draftArticles)
    .set({
      estado,
      updatedAt: new Date()
    })
    .where(eq(draftArticles.id, draftId));

  await recordPublicationReview(draftId, reviewerName, estado);

  return {
    categoria: draft.categoria,
    slug: draft.slug
  };
}

export async function regenerateDraftArticleFromSignal(draftId: string, reviewerName: string) {
  const [draftRow] = await db.select().from(draftArticles).where(eq(draftArticles.id, draftId)).limit(1);

  if (!draftRow) {
    throw new Error("Draft not found.");
  }

  if (draftRow.estado === "published") {
    throw new Error("Published drafts cannot be regenerated from the queue.");
  }

  const [sourceRow] = await db.select().from(sources).where(eq(sources.id, draftRow.sourceId)).limit(1);
  const [signalRow] = await db.select().from(importedSignals).where(eq(importedSignals.id, draftRow.signalId)).limit(1);

  if (!sourceRow || !signalRow) {
    throw new Error("Source signal not found.");
  }

  const source = mapSourceRow(sourceRow);
  const signal = withDraftMedia(mapSignalRow(signalRow, source), draftRow);
  const regenerated = await generateDraftArticle(signal);

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
      updatedAt: new Date()
    })
    .where(eq(draftArticles.id, draftId));

  await recordPublicationReview(draftId, reviewerName, "needs_review", "Draft regenerated from original signal.");

  return {
    categoria: regenerated.categoria,
    slug: regenerated.slug
  };
}

type ManualDraftUpdateInput = {
  titulo: string;
  subtitulo: string;
  entradilla: string;
  cuerpo: string[];
  categoria: EditorialCategory;
  etiquetas: string[];
  autor: string;
  tiempoLectura: string;
  imagenUrl?: string;
  imagenAlt?: string;
};

export async function updateDraftArticleManually(
  draftId: string,
  input: ManualDraftUpdateInput,
  reviewerName: string
) {
  const [draftRow] = await db.select().from(draftArticles).where(eq(draftArticles.id, draftId)).limit(1);

  if (!draftRow) {
    throw new Error("Draft not found.");
  }

  const wasPublished = draftRow.estado === "published" && Boolean(draftRow.publishedArticleId);
  const nextSlug = slugifyDraftTitle(input.titulo) || draftRow.slug;
  const resolvedImageUrl = await resolveImageUrl(input.imagenUrl);
  const currentFuente = draftRow.fuente as DraftArticle["fuente"];
  const nextFuente = {
    ...currentFuente,
    imagenUrl: resolvedImageUrl,
    imagenAlt: input.imagenAlt || undefined
  };
  const currentSeo = draftRow.seo as DraftArticle["seo"];
  const nextSeo = {
    ...currentSeo,
    canonicalPath: `/articulo/${nextSlug}`,
    openGraphTitle: input.titulo,
    openGraphDescription: input.subtitulo,
    twitterTitle: input.titulo,
    twitterDescription: input.subtitulo
  };
  const nextState: DraftArticle["estado"] = wasPublished ? "published" : "needs_review";

  await db
    .update(draftArticles)
    .set({
      titulo: input.titulo,
      slug: nextSlug,
      subtitulo: input.subtitulo,
      entradilla: input.entradilla,
      cuerpo: input.cuerpo,
      categoria: input.categoria,
      etiquetas: input.etiquetas,
      autor: input.autor,
      tiempoLectura: input.tiempoLectura,
      fuente: nextFuente,
      seo: nextSeo,
      estado: nextState,
      updatedAt: new Date()
    })
    .where(eq(draftArticles.id, draftId));

  if (draftRow.publishedArticleId) {
    await db
      .update(publishedArticles)
      .set({
        slug: nextSlug,
        titulo: input.titulo,
        excerpt: input.entradilla,
        deck: input.subtitulo,
        cuerpo: input.cuerpo,
        categoria: input.categoria,
        autor: input.autor,
        tiempoLectura: input.tiempoLectura,
        accent: categoryAccents[input.categoria],
        tag: mapDraftToTag({
          ...mapDraftRow(draftRow),
          categoria: input.categoria,
          etiquetas: input.etiquetas,
          autor: input.autor,
          tiempoLectura: input.tiempoLectura
        }),
        visualUrl: nextFuente.imagenUrl ?? null,
        visualAlt: nextFuente.imagenAlt ?? input.titulo,
        updatedAt: new Date()
      })
      .where(eq(publishedArticles.id, draftRow.publishedArticleId));
  }

  await recordPublicationReview(
    draftId,
    reviewerName,
    nextState,
    wasPublished ? "Published draft manually updated from admin." : "Draft manually edited from admin."
  );

  return {
    categoria: input.categoria,
    slug: nextSlug,
    previousSlug: draftRow.slug,
    estado: nextState
  };
}

export async function publishDraftArticle(draftId: string, reviewerName: string) {
  const [draftRow] = await db.select().from(draftArticles).where(eq(draftArticles.id, draftId)).limit(1);

  if (!draftRow) {
    throw new Error("Draft not found.");
  }

  const draft = mapDraftRow(draftRow);
  const publishedAt = new Date();
  const articleId = draftRow.publishedArticleId ?? `pub-${draft.id}`;

  await db
    .insert(publishedArticles)
    .values({
      id: articleId,
      ...buildPublishedArticlePayload(draft, publishedAt)
    })
    .onConflictDoUpdate({
      target: publishedArticles.id,
      set: buildPublishedArticlePayload(draft, publishedAt)
    });

  await db
    .update(draftArticles)
    .set({
      estado: "published",
      publishedArticleId: articleId,
      updatedAt: new Date()
    })
    .where(eq(draftArticles.id, draftId));

  await recordPublicationReview(draftId, reviewerName, "published");

  return {
    articleId,
    slug: draft.slug,
    categoria: draft.categoria
  };
}

export async function getEditorialSummaryFromDb() {
  const activeRows = await getActiveSourceRows();
  const activeIds = activeRows.map((row) => row.id);

  if (activeIds.length === 0) {
    return {
      sourceCount: 0,
      signalCount: 0,
      reviewCount: 0,
      autopublishReadyCount: 0
    };
  }

  const [signalCountRow] = await db
    .select({ value: count() })
    .from(importedSignals)
    .where(inArray(importedSignals.sourceId, activeIds));
  const [reviewCountRow] = await db
    .select({ value: count() })
    .from(draftArticles)
    .where(and(inArray(draftArticles.sourceId, activeIds), eq(draftArticles.estado, "needs_review")));
  const [autopublishCountRow] = await db
    .select({ value: count() })
    .from(draftArticles)
    .where(
      and(inArray(draftArticles.sourceId, activeIds), eq(draftArticles.accionSugerida, "autopublish_candidate"))
    );

  return {
    sourceCount: activeIds.length,
    signalCount: signalCountRow?.value ?? 0,
    reviewCount: reviewCountRow?.value ?? 0,
    autopublishReadyCount: autopublishCountRow?.value ?? 0
  };
}
