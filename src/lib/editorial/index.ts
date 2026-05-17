import { getEditorialSources, ingestSignals } from "@/lib/editorial/ingest";
import { getEditorialSummaryFromDb, listDraftArticles, searchDraftArticles } from "@/lib/editorial/store";

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

  return listDraftArticles(100);
}

export async function getEditorialSummary() {
  return getEditorialSummaryFromDb();
}
