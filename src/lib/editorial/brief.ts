import {
  DraftType,
  EditorialBrief,
  EditorialCategory,
  EditorialPriority,
  EditorialRisk,
  SourceType
} from "@/types/editorial";

type EditorialBriefInput = {
  sourceName: string;
  sourceType: SourceType;
  sourceLanguage?: "es" | "en";
  category: EditorialCategory;
  title: string;
  summary: string;
  keywords: string[];
  suggestedType: DraftType;
  risk: EditorialRisk;
  priority: EditorialPriority;
};

const genericActorTokens = new Set([
  "ai",
  "and",
  "ars",
  "artificial",
  "asia",
  "big",
  "china",
  "data",
  "for",
  "from",
  "future",
  "giant",
  "health",
  "how",
  "in",
  "inside",
  "into",
  "live",
  "media",
  "method",
  "may",
  "new",
  "news",
  "online",
  "picturing",
  "related",
  "results",
  "science",
  "scientific",
  "search",
  "social",
  "study",
  "tech",
  "technology",
  "test",
  "the",
  "this",
  "today",
  "true",
  "week",
  "with",
  "world"
]);

function isWeakActorCandidate(value: string) {
  const normalized = compactWhitespace(value).toLowerCase();

  if (normalized.length < 3 || genericActorTokens.has(normalized)) {
    return true;
  }

  const weakFragments = ["citation", "first", "links", "predicts", "power", "source", "top", "week"];

  return weakFragments.some((fragment) => normalized.includes(fragment));
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toLowerText(value: string) {
  return compactWhitespace(value).toLowerCase();
}

function pickMovementType(text: string, sourceType: SourceType, category: EditorialCategory) {
  if (/\b(sues?|lawsuit|trial|judge|jury|court|appeal|litigation|antitrust)\b/.test(text)) {
    return "litigio";
  }

  if (/\b(regulation|regulator|policy|rules?|lawmakers?|commission|compliance|governance)\b/.test(text)) {
    return "movimiento regulatorio";
  }

  if (/\b(acquires?|acquisition|merger|deal|partnership|alliance|agreement)\b/.test(text)) {
    return "operacion corporativa";
  }

  if (/\b(raises?|funding|investment|investor|valuation|series [abc]|seed round)\b/.test(text)) {
    return "movimiento de financiacion";
  }

  if (/\b(launch|release|debut|rollout|ships?|introduces?|announces?|unveils?)\b/.test(text)) {
    return category === "espacio" ? "despliegue" : "lanzamiento";
  }

  if (/\b(benchmark|performance|inference|training|model|chip|platform)\b/.test(text)) {
    return category === "ia" ? "avance competitivo" : "movimiento tecnologico";
  }

  if (/\b(vulnerability|breach|malware|attack|exploit|ransomware|patch)\b/.test(text)) {
    return "incidente de seguridad";
  }

  if (/\b(clinical|trial|patient|therapy|drug|fda|study|paper|research|lab|laboratory)\b/.test(text)) {
    return category === "salud" || category === "biotech" ? "avance de validacion" : "resultado de investigacion";
  }

  if (/\b(launch|satellite|rocket|orbit|orbital|mission|spacecraft)\b/.test(text)) {
    return "mision o despliegue";
  }

  if (sourceType === "paper_feed") {
    return "resultado de investigacion";
  }

  return "movimiento sectorial";
}

function pickStage(text: string, movementType: string, sourceType: SourceType) {
  if (/\b(early|prototype|pilot|preprint|concept|initial|first test)\b/.test(text)) {
    return "fase temprana";
  }

  if (/\b(trial|study|paper|results?|validation|lab|laboratory)\b/.test(text)) {
    return "fase de validacion";
  }

  if (/\b(launch|rollout|deploy|deployment|availability|shipping|production)\b/.test(text)) {
    return "fase de despliegue";
  }

  if (movementType === "litigio") {
    return "fase de disputa";
  }

  if (sourceType === "paper_feed") {
    return "fase de validacion";
  }

  return "fase abierta";
}

function pickScope(category: EditorialCategory, movementType: string) {
  switch (category) {
    case "ia":
      return movementType === "litigio" ? "control competitivo de la IA" : "adopcion, costes y ventaja competitiva";
    case "ciencia":
      return "validacion cientifica y transferencia aplicada";
    case "tecnologia":
      return "producto, mercado y posicion competitiva";
    case "espacio":
      return "capacidad de despliegue y carrera industrial";
    case "salud":
      return "validacion clinica, acceso y escalado sanitario";
    case "biotech":
      return "propiedad intelectual, aprobacion y escalado";
    case "ciberseguridad":
      return "superficie de riesgo, defensa y respuesta institucional";
    case "laboratorio":
      return "confirmacion experimental y viabilidad posterior";
    case "opinion":
      return "lectura editorial y consecuencias de medio plazo";
    default:
      return "impacto sectorial y siguiente movimiento";
  }
}

function pickImpact(category: EditorialCategory, movementType: string, stage: string) {
  switch (category) {
    case "ia":
      return `Puede mover tiempos de adopcion, costes de infraestructura y reparto de poder entre modelos, plataformas y clientes. El punto clave es si este ${movementType} sale de ${stage} y cambia decisiones reales de compra o despliegue.`;
    case "ciencia":
      return `Importa si abre una linea reproducible o si se queda en un resultado prometedor sin traduccion practica. Lo decisivo sera ver validacion independiente, replicabilidad y velocidad de transferencia.`;
    case "tecnologia":
      return `La relevancia no esta solo en el anuncio, sino en si altera posicion competitiva, pricing o dependencia de terceros. Hay que medir si el movimiento reordena producto, distribucion o acceso al mercado.`;
    case "espacio":
      return `Afecta a capacidad industrial, contratos y credibilidad de ejecucion. La clave es si el hito se convierte en cadencia operativa y no en un logro aislado.`;
    case "salud":
      return `Puede cambiar prioridades clinicas, regulatorias o de financiacion, pero solo si la validacion aguanta fuera del entorno controlado. Lo importante es distinguir resultado preliminar de cambio de practica.`;
    case "biotech":
      return `Puede alterar valoracion, pipeline y ventaja de propiedad intelectual. Lo relevante es si aparecen datos, socios o aprobaciones que conviertan la promesa en capacidad de mercado.`;
    case "ciberseguridad":
      return `Puede elevar presion defensiva, coste de respuesta y debate regulatorio. La diferencia real la marcan el alcance del riesgo, la explotacion efectiva y la respuesta del ecosistema.`;
    case "laboratorio":
      return `El valor esta en saber si el hallazgo aguanta replicacion, escala y uso fuera del laboratorio. Sin esas confirmaciones, sigue siendo una senal interesante pero todavia no una ruptura.`;
    case "opinion":
      return `La pieza merece una lectura de consecuencias mas que una cronica de hechos. Lo importante es identificar que cambia en incentivos, narrativa y reparto de influencia.`;
    default:
      return `La noticia importa si deja de ser un gesto aislado y empieza a cambiar decisiones de inversion, producto o regulacion.`;
  }
}

function pickEditorialFocus(category: EditorialCategory, movementType: string, priority: EditorialPriority) {
  const urgencyCue =
    priority === "urgente" || priority === "alta"
      ? "Conviene seguirla de cerca desde ya."
      : "Pide seguimiento, pero sin sobrerreaccionar al primer titular.";

  switch (category) {
    case "ia":
      return `${urgencyCue} La lectura debe separar demo, capacidad real de despliegue y efecto sobre rivales, clientes y reguladores.`;
    case "ciencia":
    case "laboratorio":
      return `${urgencyCue} La cobertura debe distinguir hipotesis, datos observados y validacion externa antes de elevar el tono.`;
    case "salud":
    case "biotech":
      return `${urgencyCue} Hay que separar promesa, evidencia y ruta regulatoria para no confundir interes cientifico con impacto confirmado.`;
    case "ciberseguridad":
      return `${urgencyCue} El foco debe ir a alcance real, mitigaciones y posibles dependencias afectadas, no solo al susto inicial.`;
    default:
      return `${urgencyCue} Lo importante es medir quien gana margen, quien queda bajo presion y que barreras frenan un impacto inmediato.`;
  }
}

function pickNextSignals(category: EditorialCategory, movementType: string, stage: string) {
  if (movementType === "litigio") {
    return "Hay que vigilar resoluciones, apelaciones, pactos extrajudiciales y el efecto de esa disputa sobre clientes y socios.";
  }

  if (stage === "fase de validacion") {
    return "Las siguientes senales utiles son datos completos, replicas independientes, calendario de pruebas y traduccion fuera del entorno controlado.";
  }

  switch (category) {
    case "ia":
      return "Conviene seguir respuesta de competidores, integraciones comerciales, costes de despliegue y cualquier gesto regulatorio que acelere o frene la adopcion.";
    case "espacio":
      return "La prueba real vendra con contratos, repeticion operativa, fiabilidad tecnica y cadencia de lanzamiento.";
    case "salud":
    case "biotech":
      return "Las confirmaciones clave seran datos ampliados, socios clinicos, aprobaciones y senales de escalado industrial.";
    case "ciberseguridad":
      return "Hay que mirar explotacion efectiva, parches, impacto en terceros y cambios de postura por parte de proveedores o reguladores.";
    default:
      return "Las mejores confirmaciones son respuesta del mercado, movimientos de competidores, datos nuevos y evidencia de despliegue real.";
  }
}

function extractActors(title: string, keywords: string[], sourceName: string) {
  const keywordActors = keywords
    .map((value) => compactWhitespace(value))
    .filter((value) => value.length >= 3)
    .filter((value) => /[A-Z]/.test(value))
    .filter((value) => !isWeakActorCandidate(value))
    .slice(0, 3);

  if (keywordActors.length > 0) {
    return keywordActors;
  }

  const matches = title.match(/\b[A-Z][A-Za-z0-9.+-]*(?:\s+[A-Z][A-Za-z0-9.+-]*){0,2}\b/g) ?? [];
  const normalized = matches
    .map((match) => compactWhitespace(match))
    .filter((match) => !isWeakActorCandidate(match));

  if (normalized.length > 0) {
    return Array.from(new Set(normalized)).slice(0, 3);
  }

  return [sourceName];
}

export function buildEditorialBrief(input: EditorialBriefInput): EditorialBrief {
  const title = compactWhitespace(input.title);
  const summary = compactWhitespace(input.summary);
  const text = toLowerText(`${title} ${summary} ${input.keywords.join(" ")}`);
  const movementType = pickMovementType(text, input.sourceType, input.category);
  const stage = pickStage(text, movementType, input.sourceType);
  const scope = pickScope(input.category, movementType);
  const actors = extractActors(title, input.keywords, input.sourceName);
  const leadActor = actors[0] ?? input.sourceName;
  const sourceReference =
    input.sourceLanguage === "en"
      ? `La fuente en ingles apunta a un ${movementType} en ${scope}.`
      : `La fuente apunta a un ${movementType} en ${scope}.`;
  const keyPoint = `${leadActor} aparece ligado a una senal en ${stage}. ${sourceReference}`;

  return {
    movementType,
    stage,
    scope,
    actors,
    keyPoint,
    whyItMatters: pickImpact(input.category, movementType, stage),
    editorialFocus: pickEditorialFocus(input.category, movementType, input.priority),
    nextSignals: pickNextSignals(input.category, movementType, stage)
  };
}
