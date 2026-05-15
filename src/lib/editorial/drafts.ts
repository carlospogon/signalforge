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

const englishReplacements = [
  ["clean up emissions", "reducir emisiones"],
  ["the only source for", "la única fuente de"],
  ["source for", "fuente de"],
  ["different type of rock", "otro tipo de roca"],
  ["different type", "tipo alternativo"],
  ["portland cement", "cemento Portland"],
  ["could", "podría"],
  ["might", "podría"],
  ["may", "podría"],
  ["new", "nuevo"],
  ["latest", "último"],
  ["shows", "muestra"],
  ["show", "mostrar"],
  ["finds", "detecta"],
  ["find", "detectar"],
  ["reveals", "revela"],
  ["reveal", "revelar"],
  ["launches", "lanza"],
  ["launch", "lanzar"],
  ["builds", "construye"],
  ["build", "construir"],
  ["uses", "usa"],
  ["using", "usando"],
  ["researchers", "investigadores"],
  ["researcher", "investigador"],
  ["study", "estudio"],
  ["paper", "artículo"],
  ["report", "informe"],
  ["company", "empresa"],
  ["startup", "startup"],
  ["chip", "chip"],
  ["model", "modelo"],
  ["data center", "centro de datos"],
  ["battery", "batería"],
  ["gene", "gen"],
  ["genes", "genes"],
  ["therapy", "terapia"],
  ["planet", "planeta"],
  ["satellite", "satélite"],
  ["emissions", "emisiones"],
  ["cement", "cemento"],
  ["rock", "roca"],
  ["from", "de"],
  ["with", "con"],
  ["without", "sin"],
  ["into", "en"],
  ["for", "para"],
  ["of", "de"]
] as const;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toSentenceCase(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function translateFragments(value: string) {
  let output = value;

  for (const [search, replacement] of englishReplacements) {
    const pattern = new RegExp(`\\b${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    output = output.replace(pattern, replacement);
  }

  return output;
}

function rewriteSourceText(value: string) {
  const normalized = normalizeWhitespace(value).replace(/^[“"'`]+|[”"'`]+$/g, "");
  const translated = translateFragments(normalized);
  return restoreSpanishText(toSentenceCase(normalizeWhitespace(translated))).replace(/\.$/, "");
}

function inferTags(signal: ImportedSignal) {
  const labels = new Set<string>([
    categoryLabels[signal.categoriaSugerida].toUpperCase(),
    signal.fuente.nombre,
    signal.clasificacion.formatoSugerido === "analysis" ? "Análisis" : "Radar"
  ]);

  signal.palabrasClave
    .filter((word: string) => word.length > 2)
    .slice(0, 4)
    .forEach((word: string) => labels.add(restoreSpanishText(word)));

  return [...labels];
}

function buildHeadline(signal: ImportedSignal) {
  const candidate = signal.resumenOriginal.length > 36 ? signal.resumenOriginal : signal.tituloOriginal;
  return rewriteSourceText(candidate);
}

function buildEntradilla(signal: ImportedSignal, headline: string) {
  const sourceLabel = signal.fuente.nombre;
  const categoryLabel = categoryLabels[signal.categoriaSugerida];

  if (signal.clasificacion.formatoSugerido === "analysis") {
    return restoreSpanishText(
      `${headline}. La clave ahora es entender si este movimiento de ${sourceLabel} cambia de verdad el contexto de ${categoryLabel} o si solo añade ruido al ciclo informativo.`
    );
  }

  return restoreSpanishText(
    `${headline}. La noticia abre una pista relevante para ${categoryLabel} y merece seguimiento porque puede anticipar cambios más amplios en investigación, industria o despliegue.`
  );
}

function buildWhyItMatters(signal: ImportedSignal) {
  switch (signal.categoriaSugerida) {
    case "ia":
      return "Si el movimiento se consolida, puede afectar a producto, costes de inferencia, adopción empresarial y ventaja competitiva en IA.";
    case "tecnologia":
      return "El interés real está en si esto cambia la hoja de ruta de producto, la infraestructura o la posición competitiva del sector.";
    case "ciencia":
      return "Lo importante es si aporta evidencia nueva, corrige una limitación previa o abre una vía experimental con recorrido.";
    case "espacio":
      return "Lo relevante es si altera capacidad orbital, calendario de misiones o equilibrio entre actores públicos y privados.";
    case "salud":
      return "La lectura útil pasa por medir solidez clínica, calidad de la evidencia y distancia real hasta una aplicación médica.";
    case "biotech":
      return "La señal importa si mejora validación, descubrimiento o escalado en biotecnología más allá del titular inicial.";
    case "ciberseguridad":
      return "Lo que cuenta es si cambia superficie de ataque, exposición operativa o capacidad real de defensa.";
    case "laboratorio":
      return "La pieza merece atención si sirve como benchmark, prueba replicable o experimento útil para comparar enfoques.";
    case "opinion":
      return "La categoría Opinión se reserva a publicación manual y no debería generarse automáticamente.";
  }
}

function buildNextStep(signal: ImportedSignal) {
  switch (signal.clasificacion.riesgoEditorial) {
    case "alto":
      return "Antes de elevar esta pieza conviene contrastar la fuente primaria, revisar límites metodológicos y evitar conclusiones que la evidencia todavía no sostiene.";
    case "medio":
      return "El siguiente paso editorial es comprobar alcance real, actores implicados y si el titular simplifica demasiado lo que la fuente cuenta.";
    case "bajo":
      return "Si aparecen confirmaciones adicionales o impacto de producto claro, esta señal puede escalar a una pieza de mayor desarrollo.";
  }
}

function buildBody(signal: ImportedSignal, headline: string) {
  const sourceLabel = signal.fuente.nombre;
  const summary = rewriteSourceText(signal.resumenOriginal || signal.tituloOriginal);
  const titleContext = rewriteSourceText(signal.tituloOriginal);

  return [
    restoreSpanishText(
      `${sourceLabel} pone sobre la mesa una idea concreta: ${headline.toLowerCase()}. La referencia original se apoya en el enfoque resumido como "${summary}" y apunta a un posible cambio de lectura dentro de ${categoryLabels[signal.categoriaSugerida]}.`
    ),
    restoreSpanishText(
      `Más allá del titular, la pregunta útil es qué cambia de fondo. ${buildWhyItMatters(signal)}`
    ),
    restoreSpanishText(
      `Por ahora, la pieza sugiere una hipótesis o un movimiento que merece seguimiento, pero todavía necesita contraste adicional. El ángulo más sólido para Synaptik es partir de "${titleContext}" y convertirlo en contexto comprensible para el lector.`
    ),
    restoreSpanishText(buildNextStep(signal))
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
  return signal.clasificacion.formatoSugerido === "analysis" ? "Mesa editorial Synaptik" : "Redacción Synaptik";
}

export function generateDraftArticle(signal: ImportedSignal): DraftArticle {
  if (signal.categoriaSugerida === "opinion") {
    throw new Error("La categoría Opinión solo admite gestión manual.");
  }

  const titulo = buildHeadline(signal);
  const slug = slugify(titulo);
  const entradilla = buildEntradilla(signal, titulo);

  return {
    id: `draft-${signal.id}`,
    titulo,
    slug,
    entradilla,
    cuerpo: buildBody(signal, titulo),
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
