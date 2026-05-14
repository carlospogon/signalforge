import { getEditorialSources, ingestSignals } from "@/lib/editorial/ingest";
import { getEditorialSummaryFromDb, listDraftArticles } from "@/lib/editorial/store";

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

export async function getDraftQueue() {
  await ingestSignals();
  return listDraftArticles();
}

export async function getEditorialSummary() {
  await ingestSignals();
  return getEditorialSummaryFromDb();
}
