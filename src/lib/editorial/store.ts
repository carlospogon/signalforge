import "server-only";

import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { draftArticles, importedSignals, sources } from "@/db/schema";
import { editorialSources } from "@/data/editorial-sources";
import { generateDraftArticle } from "@/lib/editorial/drafts";
import { fetchSourceSignals } from "@/lib/editorial/feed";
import { classifySignal } from "@/lib/editorial/classify";
import { DraftArticle, EditorialSource, ImportedSignal, SourceSignal } from "@/types/editorial";

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
  const hashUnico = createStableHash(`${normalizeText(entry.tituloOriginal)}::${entry.urlOriginal}`);
  const fechaIngesta = new Date().toISOString();
  const signalBase = {
    id: entry.id,
    tituloOriginal: entry.tituloOriginal,
    urlOriginal: entry.urlOriginal,
    fuente: source,
    fechaPublicacion: entry.fechaPublicacion,
    resumenOriginal: entry.resumenOriginal,
    fechaIngesta,
    hashUnico
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
    fuente: source,
    fechaPublicacion: row.fechaPublicacion.toISOString(),
    resumenOriginal: row.resumenOriginal,
    categoriaSugerida: row.categoriaSugerida,
    fechaIngesta: row.fechaIngesta.toISOString(),
    hashUnico: row.hashUnico,
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

function mapDraftRow(row: typeof draftArticles.$inferSelect): DraftArticle {
  return {
    id: row.id,
    titulo: row.titulo,
    slug: row.slug,
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

export async function syncEditorialSources() {
  for (const source of editorialSources) {
    await db
      .insert(sources)
      .values(serializeSource(source))
      .onConflictDoUpdate({
        target: sources.url,
        set: {
          nombre: source.nombre,
          tipo: source.tipo,
          categoriaPrincipal: source.categoriaPrincipal,
          idioma: source.idioma,
          nivelFiabilidad: source.nivelFiabilidad,
          frecuenciaConsulta: source.frecuenciaConsulta,
          permiteAutopublicacion: source.permiteAutopublicacion,
          requiereRevision: source.requiereRevision,
          updatedAt: new Date()
        }
      });
  }

  const rows = await db.select().from(sources).orderBy(sources.nombre);
  return rows.map(mapSourceRow);
}

async function upsertImportedSignal(signal: ImportedSignal) {
  await db
    .insert(importedSignals)
    .values({
      id: signal.id,
      sourceId: signal.fuente.id,
      tituloOriginal: signal.tituloOriginal,
      urlOriginal: signal.urlOriginal,
      guidOriginal: signal.urlOriginal,
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
    })
    .onConflictDoUpdate({
      target: importedSignals.id,
      set: {
        tituloOriginal: signal.tituloOriginal,
        urlOriginal: signal.urlOriginal,
        guidOriginal: signal.urlOriginal,
        fechaPublicacion: new Date(signal.fechaPublicacion),
        resumenOriginal: signal.resumenOriginal,
        categoriaSugerida: signal.categoriaSugerida,
        relevancia: signal.clasificacion.relevancia,
        riesgoEditorial: signal.clasificacion.riesgoEditorial,
        prioridadPublicacion: signal.clasificacion.prioridadPublicacion,
        accionSugerida: signal.clasificacion.accionSugerida,
        formatoSugerido: signal.clasificacion.formatoSugerido,
        fechaIngesta: new Date(signal.fechaIngesta),
        hashUnico: signal.hashUnico
      }
    });
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

  await Promise.allSettled(
    persistedSources.map(async (source) => {
      const rawSignals = await fetchSourceSignals(source);

      for (const rawSignal of rawSignals) {
        const imported = buildImportedSignal(rawSignal, source);
        await upsertImportedSignal(imported);

        if (imported.categoriaSugerida === "opinion") {
          continue;
        }

        try {
          await upsertDraft(generateDraftArticle(imported));
        } catch {
          // Invalid or manual-only drafts stay outside the automatic queue.
        }
      }
    })
  );
}

export async function listEditorialSources() {
  const rows = await db.select().from(sources).orderBy(sources.nombre);
  return rows.map(mapSourceRow);
}

export async function listImportedSignals(limit = 50) {
  const signalRows = await db
    .select()
    .from(importedSignals)
    .orderBy(desc(importedSignals.fechaPublicacion), desc(importedSignals.createdAt))
    .limit(limit);

  if (signalRows.length === 0) {
    return [];
  }

  const sourceRows = await db
    .select()
    .from(sources)
    .where(inArray(sources.id, [...new Set(signalRows.map((signal) => signal.sourceId))]));

  const sourceMap = new Map(sourceRows.map((row) => [row.id, mapSourceRow(row)]));

  return signalRows
    .map((row) => {
      const source = sourceMap.get(row.sourceId);
      return source ? mapSignalRow(row, source) : null;
    })
    .filter((signal): signal is ImportedSignal => signal !== null);
}

export async function listDraftArticles(limit = 50) {
  const rows = await db
    .select()
    .from(draftArticles)
    .orderBy(desc(draftArticles.fechaCreacion), desc(draftArticles.createdAt))
    .limit(limit);

  return rows.map(mapDraftRow);
}

export async function getEditorialSummaryFromDb() {
  const [sourceCountRow] = await db.select({ value: count() }).from(sources);
  const [signalCountRow] = await db.select({ value: count() }).from(importedSignals);
  const [reviewCountRow] = await db
    .select({ value: count() })
    .from(draftArticles)
    .where(eq(draftArticles.estado, "needs_review"));
  const [autopublishCountRow] = await db
    .select({ value: count() })
    .from(draftArticles)
    .where(eq(draftArticles.accionSugerida, "autopublish_candidate"));

  return {
    sourceCount: sourceCountRow?.value ?? 0,
    signalCount: signalCountRow?.value ?? 0,
    reviewCount: reviewCountRow?.value ?? 0,
    autopublishReadyCount: autopublishCountRow?.value ?? 0
  };
}
