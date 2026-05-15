import { EditorialCategory, EditorialClassification, EditorialRisk, ImportedSignal } from "@/types/editorial";

function pickCategory(signal: Pick<ImportedSignal, "tituloOriginal" | "resumenOriginal" | "fuente">): EditorialCategory {
  const haystack = `${signal.tituloOriginal} ${signal.resumenOriginal}`.toLowerCase();

  if (haystack.includes("clinical") || haystack.includes("health") || haystack.includes("triage")) {
    return "salud";
  }

  if (haystack.includes("security") || haystack.includes("red-team") || haystack.includes("injection")) {
    return "ciberseguridad";
  }

  if (haystack.includes("orbit") || haystack.includes("orbital") || haystack.includes("space")) {
    return "espacio";
  }

  if (haystack.includes("paper") || signal.fuente.tipo === "paper_feed") {
    return "laboratorio";
  }

  if (haystack.includes("biotech") || haystack.includes("genetic") || haystack.includes("cell")) {
    return "biotech";
  }

  if (haystack.includes("policy") || haystack.includes("governance") || haystack.includes("deployment")) {
    return "tecnologia";
  }

  return signal.fuente.categoriaPrincipal;
}

function pickRisk(category: EditorialCategory, signal: Pick<ImportedSignal, "tituloOriginal" | "resumenOriginal" | "fuente">): EditorialRisk {
  const haystack = `${signal.tituloOriginal} ${signal.resumenOriginal}`.toLowerCase();

  if (category === "salud" || category === "biotech") {
    return haystack.includes("clinical") || haystack.includes("health") ? "alto" : "medio";
  }

  if (haystack.includes("policy") || haystack.includes("governance")) {
    return "alto";
  }

  if (signal.fuente.tipo === "paper_feed") {
    return "bajo";
  }

  return "medio";
}

function scoreRelevance(signal: Pick<ImportedSignal, "tituloOriginal" | "resumenOriginal" | "fuente">, category: EditorialCategory) {
  const haystack = `${signal.tituloOriginal} ${signal.resumenOriginal}`.toLowerCase();
  let score = 62;

  if (signal.fuente.nivelFiabilidad === "alta") {
    score += 8;
  }

  if (signal.fuente.tipo === "paper_feed") {
    score += 6;
  }

  if (category === "ia" || category === "ciberseguridad" || category === "salud") {
    score += 7;
  }

  if (haystack.includes("production") || haystack.includes("benchmark") || haystack.includes("clinical")) {
    score += 9;
  }

  return Math.min(score, 96);
}

function pickPriority(relevance: number, risk: EditorialRisk) {
  if (relevance >= 88 && risk !== "alto") {
    return "urgente";
  }

  if (relevance >= 80) {
    return "alta";
  }

  if (risk === "alto") {
    return "alta";
  }

  return relevance >= 70 ? "media" : "baja";
}

export function classifySignal(
  signal: Pick<ImportedSignal, "tituloOriginal" | "resumenOriginal" | "fuente">
): EditorialClassification {
  const categoria = pickCategory(signal);
  const riesgoEditorial = pickRisk(categoria, signal);
  const relevancia = scoreRelevance(signal, categoria);
  const prioridadPublicacion = pickPriority(relevancia, riesgoEditorial);

  const formatoSugerido =
    signal.fuente.tipo === "paper_feed" || prioridadPublicacion === "alta" || prioridadPublicacion === "urgente"
      ? "analysis"
      : "radar";

  const accionSugerida =
    categoria === "opinion"
      ? "manual_only"
      : "review_required";

  return {
    categoria,
    relevancia,
    riesgoEditorial,
    prioridadPublicacion,
    accionSugerida,
    formatoSugerido
  };
}
