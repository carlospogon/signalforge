import { ImportedSignal, DraftArticle } from "@/types/editorial";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSpanishDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function inferTags(signal: ImportedSignal) {
  const labels = new Set<string>([
    signal.categoriaSugerida.toUpperCase(),
    signal.fuente.nombre,
    signal.clasificacion.formatoSugerido === "analysis" ? "Contexto" : "Radar"
  ]);

  signal.tituloOriginal
    .split(" ")
    .filter((word) => word.length > 5)
    .slice(0, 2)
    .forEach((word) => labels.add(word.replace(/[^A-Za-z0-9.-]/g, "")));

  return [...labels];
}

function buildTitle(signal: ImportedSignal) {
  if (signal.clasificacion.formatoSugerido === "analysis") {
    return `Que significa para Synaptik: ${signal.tituloOriginal}`;
  }

  return `Radar Synaptik: ${signal.tituloOriginal}`;
}

function buildBody(signal: ImportedSignal) {
  const sourceLabel = signal.fuente.nombre;
  const riskLine =
    signal.clasificacion.riesgoEditorial === "alto"
      ? "El tema requiere verificacion humana antes de cualquier decision de portada o boletin."
      : "La senal parece util para radar editorial, pero todavia necesita contraste y lectura contextual propia.";

  return [
    `Senal capturada el ${toSpanishDate(signal.fechaIngesta)} desde ${sourceLabel}. La pieza original apunta a ${signal.resumenOriginal.toLowerCase()}`,
    "Este borrador no replica la fuente original. Resume el angulo potencial para Synaptik y deja preparada una lectura editorial propia.",
    `Clasificacion inicial: categoria ${signal.categoriaSugerida.toUpperCase()}, prioridad ${signal.clasificacion.prioridadPublicacion.toUpperCase()} y riesgo ${signal.clasificacion.riesgoEditorial.toUpperCase()}.`,
    riskLine
  ];
}

function pickState(signal: ImportedSignal): DraftArticle["estado"] {
  if (signal.clasificacion.accionSugerida === "manual_only") {
    return "rejected";
  }

  if (signal.clasificacion.riesgoEditorial === "alto" || signal.fuente.requiereRevision) {
    return "needs_review";
  }

  return signal.fuente.permiteAutopublicacion ? "draft" : "imported";
}

function pickAuthor(signal: ImportedSignal): DraftArticle["autor"] {
  return signal.clasificacion.formatoSugerido === "analysis" ? "Mesa editorial Synaptik" : "Radar Synaptik";
}

export function generateDraftArticle(signal: ImportedSignal): DraftArticle {
  if (signal.categoriaSugerida === "opinion") {
    throw new Error("La categoria Opinion solo admite gestion manual.");
  }

  const titulo = buildTitle(signal);
  const slug = slugify(titulo);
  const entradilla =
    signal.clasificacion.formatoSugerido === "analysis"
      ? "Borrador editorial preparado para ampliar contexto, contrastar implicaciones y decidir si la senal merece una pieza de desarrollo."
      : "Nota breve preparada para radar interno con foco en trazabilidad, contraste y accion editorial sugerida.";

  return {
    id: `draft-${signal.id}`,
    titulo,
    slug,
    entradilla,
    cuerpo: buildBody(signal),
    categoria: signal.categoriaSugerida,
    etiquetas: inferTags(signal),
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
      canonicalPath: `/radar/${slug}`,
      openGraphTitle: titulo,
      openGraphDescription: entradilla,
      twitterTitle: titulo,
      twitterDescription: entradilla,
      fuenteOriginal: signal.urlOriginal,
      fechaCaptura: signal.fechaIngesta,
      fechaPublicacionOriginal: signal.fechaPublicacion
    },
    fuente: {
      id: signal.fuente.id,
      nombre: signal.fuente.nombre,
      urlOriginal: signal.urlOriginal
    },
    riesgoEditorial: signal.clasificacion.riesgoEditorial,
    prioridadPublicacion: signal.clasificacion.prioridadPublicacion,
    accionSugerida: signal.clasificacion.accionSugerida,
    originalSignalId: signal.id
  };
}
