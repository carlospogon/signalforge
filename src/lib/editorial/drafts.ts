import { buildEditorialBrief } from "@/lib/editorial/brief";
import { generateEditorialArticle } from "@/lib/editorial/generate-article";
import { DraftArticle, ImportedSignal } from "@/types/editorial";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferTags(signal: ImportedSignal, tag: string) {
  const labels = new Set<string>([
    signal.fuente.nombre,
    signal.categoriaSugerida.toUpperCase(),
    tag
  ]);

  signal.palabrasClave
    .filter((word) => word.length > 2)
    .slice(0, 4)
    .forEach((word) => labels.add(word));

  return [...labels];
}

function pickState(signal: ImportedSignal): DraftArticle["estado"] {
  if (signal.clasificacion.accionSugerida === "manual_only") {
    return "rejected";
  }

  return "needs_review";
}

function pickAuthor(signal: ImportedSignal): DraftArticle["autor"] {
  return signal.clasificacion.formatoSugerido === "analysis" ? "Mesa editorial Synaptik" : "Redacción Synaptik";
}

export async function generateDraftArticle(signal: ImportedSignal): Promise<DraftArticle> {
  if (signal.categoriaSugerida === "opinion") {
    throw new Error("La categoría Opinión solo admite gestión manual.");
  }

  const generated = await generateEditorialArticle(signal);
  const briefEditorial = buildEditorialBrief({
    sourceName: signal.fuente.nombre,
    sourceType: signal.fuente.tipo,
    sourceLanguage: signal.fuente.idioma,
    category: signal.categoriaSugerida,
    title: signal.tituloOriginal,
    summary: signal.resumenOriginal,
    keywords: signal.palabrasClave,
    suggestedType: signal.clasificacion.formatoSugerido,
    risk: signal.clasificacion.riesgoEditorial,
    priority: signal.clasificacion.prioridadPublicacion
  });
  const titulo = generated.title;
  const slug = slugify(titulo);

  return {
    id: `draft-${signal.id}`,
    titulo,
    slug,
    subtitulo: generated.subtitle,
    entradilla: generated.excerpt,
    cuerpo: generated.body,
    categoria: signal.categoriaSugerida,
    etiquetas: inferTags(signal, generated.tag),
    fuentesConsultadas: [
      {
        nombre: signal.fuente.nombre,
        url: signal.urlOriginal,
        tipo: signal.fuente.tipo
      }
    ],
    estado: pickState(signal),
    autor: pickAuthor(signal),
    tipo: signal.clasificacion.formatoSugerido,
    fechaCreacion: signal.fechaIngesta,
    fechaPublicacionOriginal: signal.fechaPublicacion,
    fechaCaptura: signal.fechaIngesta,
    tiempoLectura: signal.clasificacion.formatoSugerido === "analysis" ? "4 min" : "2 min",
    seo: {
      canonicalPath: `/articulo/${slug}`,
      openGraphTitle: titulo,
      openGraphDescription: generated.subtitle,
      twitterTitle: titulo,
      twitterDescription: generated.subtitle,
      fuenteOriginal: signal.urlOriginal,
      fechaCaptura: signal.fechaIngesta,
      fechaPublicacionOriginal: signal.fechaPublicacion
    },
    fuente: {
      id: signal.fuente.id,
      nombre: signal.fuente.nombre,
      tipoFuente: signal.fuente.tipo,
      urlOriginal: signal.urlOriginal,
      tituloOriginal: signal.tituloOriginal,
      resumenOriginal: signal.resumenOriginal,
      imagenUrl: signal.imagenUrl,
      imagenAlt: signal.imagenAlt,
      idioma: signal.fuente.idioma,
      briefEditorial
    },
    riesgoEditorial: signal.clasificacion.riesgoEditorial,
    prioridadPublicacion: signal.clasificacion.prioridadPublicacion,
    accionSugerida: signal.clasificacion.accionSugerida,
    originalSignalId: signal.id
  };
}
