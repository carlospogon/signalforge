import { getEditorialSources, ingestSignals } from "@/lib/editorial/ingest";
import {
  createManualOpinionDraft,
  getEditorialSummaryFromDb,
  listActiveDraftArticles,
  listDraftArticles,
  listOpinionDraftArticles,
  listRejectedDraftArticles,
  searchOpinionDraftArticles,
  searchDraftArticles
} from "@/lib/editorial/store";

export async function getEditorialPipeline() {
  const [sources, signals, drafts] = await Promise.all([
    getEditorialSources(),
    ingestSignals(),
    listDraftArticles()
  ]);

  return {
    sources,
    signals,
    drafts
  };
}

export async function getRadarSignals(limit = 4) {
  const signals = await ingestSignals(limit * 3);
  return signals.filter((signal) => signal.clasificacion.formatoSugerido === "radar").slice(0, limit);
}

export async function getAnalysisDrafts(limit = 3) {
  const drafts = await listDraftArticles(limit * 3);
  return drafts.filter((draft) => draft.tipo === "analysis").slice(0, limit);
}

export async function getDraftQueue(query?: string) {
  if (query?.trim()) {
    return searchDraftArticles(query);
  }

  return listActiveDraftArticles(100);
}

export async function getRejectedDraftQueue(query?: string) {
  if (query?.trim()) {
    const drafts = await searchDraftArticles(query);
    return drafts.filter((draft) => draft.estado === "rejected");
  }

  return listRejectedDraftArticles(100);
}

export async function getOpinionQueue(query?: string) {
  if (query?.trim()) {
    return searchOpinionDraftArticles(query);
  }

  return listOpinionDraftArticles(100);
}

export async function createOpinionDraft(reviewerName: string) {
  return createManualOpinionDraft(reviewerName);
}

export async function getEditorialSummary() {
  return getEditorialSummaryFromDb();
}
