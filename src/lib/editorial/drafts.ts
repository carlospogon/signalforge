import { DraftArticle, ImportedSignal } from "@/types/editorial";
import { restoreSpanishText } from "@/lib/spanish";

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

const categoryLabels: Record<ImportedSignal["categoriaSugerida"], string> = {
  ia: "IA",
  ciencia: "ciencia",
  tecnologia: "tecnología",
  espacio: "espacio",
  salud: "salud",
  biotech: "biotech",
  ciberseguridad: "ciberseguridad",
  opinion: "opinión",
  laboratorio: "laboratorio"
};

function inferTags(signal: ImportedSignal) {
  const labels = new Set<string>([
    categoryLabels[signal.categoriaSugerida].toUpperCase(),
    signal.fuente.nombre,
    signal.clasificacion.formatoSugerido === "analysis" ? "Contexto" : "Radar"
  ]);

  signal.palabrasClave
    .filter((word) => word.length > 2)
    .slice(0, 4)
    .forEach((word) => labels.add(restoreSpanishText(word)));

  return [...labels];
}

function buildTitle(signal: ImportedSignal) {
  const sourceLabel = signal.fuente.nombre;
  const categoryLabel = categoryLabels[signal.categoriaSugerida];

  if (signal.clasificacion.formatoSugerido === "analysis") {
    return `Qué implica la última señal de ${sourceLabel} para ${categoryLabel}`;
  }

  return `Radar Synaptik: nueva señal de ${sourceLabel} en ${categoryLabel}`;
}

function buildEntradilla(signal: ImportedSignal) {
  if (signal.clasificacion.formatoSugerido === "analysis") {
    return restoreSpanishText(
      `Borrador editorial en español para contextualizar la señal, separar el hecho principal del ruido y decidir si merece una pieza de desarrollo. Punto de partida: ${signal.resumenOriginal}`
    );
  }

  return restoreSpanishText(
    `Nota de radar preparada en español para registrar el movimiento, preservar trazabilidad y señalar por qué conviene seguirlo de cerca. Resumen inicial: ${signal.resumenOriginal}`
  );
}

function buildCategoryContext(signal: ImportedSignal) {
  switch (signal.categoriaSugerida) {
    case "ia":
      return "Puede afectar a producto, despliegue, costes de inferencia, adopción empresarial o posicionamiento competitivo en IA.";
    case "tecnologia":
      return "Puede mover hoja de ruta de producto, infraestructura, integración o estrategia de plataforma.";
    case "ciencia":
      return "Importa si cambia el consenso experimental, abre una nueva línea de investigación o mejora la evidencia disponible.";
    case "espacio":
      return "Puede alterar calendario de lanzamientos, capacidad orbital, observación o competencia geoestratégica.";
    case "salud":
      return "Conviene revisar impacto clínico, calidad de la evidencia, límites del estudio y madurez regulatoria.";
    case "biotech":
      return "Lo relevante es si la señal cambia capacidad de descubrimiento, validación o escalado en biotecnología.";
    case "ciberseguridad":
      return "Debe leerse en clave de superficie de ataque, defensa operativa, exposición y respuesta.";
    case "laboratorio":
      return "Puede servir como prueba comparativa, benchmark o experimento replicable para piezas de laboratorio.";
    case "opinion":
      return "La categoría Opinión se reserva a publicación manual y no debería generarse automáticamente.";
  }
}

function buildVerificationLine(signal: ImportedSignal) {
  if (signal.clasificacion.riesgoEditorial === "alto") {
    return "Antes de publicar hay que contrastar términos, revisar evidencia primaria y evitar extrapolaciones de marketing o investigación preliminar.";
  }

  if (signal.clasificacion.riesgoEditorial === "medio") {
    return "Conviene comprobar alcance real, actores implicados, grado de despliegue y si existen matices relevantes en la fuente original.";
  }

  return "La pieza parece apta para seguimiento, pero aún necesita lectura humana para decidir si basta con radar o merece desarrollo.";
}

function buildBody(signal: ImportedSignal) {
  const sourceLabel = signal.fuente.nombre;

  return [
    restoreSpanishText(
      `La señal se capturó el ${toSpanishDate(signal.fechaIngesta)} desde ${sourceLabel}. El titular original es "${signal.tituloOriginal}" y el resumen disponible apunta a esto: ${signal.resumenOriginal}`
    ),
    restoreSpanishText(
      `En términos editoriales, lo importante no es repetir la nota original, sino decidir qué cambia de verdad para Synaptik y para los lectores que siguen ${categoryLabels[signal.categoriaSugerida]}.`
    ),
    restoreSpanishText(buildCategoryContext(signal)),
    restoreSpanishText(
      `Clasificación inicial: prioridad ${signal.clasificacion.prioridadPublicacion.toUpperCase()}, riesgo ${signal.clasificacion.riesgoEditorial.toUpperCase()} y formato sugerido ${signal.clasificacion.formatoSugerido === "analysis" ? "análisis" : "radar"}.`
    ),
    restoreSpanishText(buildVerificationLine(signal))
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
    throw new Error("La categoría Opinión solo admite gestión manual.");
  }

  const titulo = restoreSpanishText(buildTitle(signal));
  const slug = slugify(titulo);
  const entradilla = buildEntradilla(signal);

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
      canonicalPath: `/articulo/${slug}`,
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
      urlOriginal: signal.urlOriginal,
      tituloOriginal: signal.tituloOriginal,
      resumenOriginal: signal.resumenOriginal,
      imagenUrl: signal.imagenUrl,
      imagenAlt: signal.imagenAlt
    },
    riesgoEditorial: signal.clasificacion.riesgoEditorial,
    prioridadPublicacion: signal.clasificacion.prioridadPublicacion,
    accionSugerida: signal.clasificacion.accionSugerida,
    originalSignalId: signal.id
  };
}
