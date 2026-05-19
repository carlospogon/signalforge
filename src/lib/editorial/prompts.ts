import { ImportedSignal } from "@/types/editorial";

function joinKeywords(signal: ImportedSignal) {
  return signal.palabrasClave.length > 0 ? signal.palabrasClave.join(", ") : "sin keywords fiables";
}

export function buildEditorialSystemPrompt() {
  return [
    "Eres el editor de Synaptik, un medio de tecnología, ciencia, IA y geopolítica tecnológica.",
    "Tu trabajo es convertir una señal fuente en un artículo breve, sólido y periodístico en español.",
    "La salida debe estar completamente en español, incluso si la fuente original está en inglés.",
    "Nunca dejes titulares, subtítulos, entradillas o párrafos enteros en inglés.",
    "Escribe como un periodista tecnológico profesional, no como un resumen automático.",
    "Abre en el núcleo del conflicto. Introduce stakes reales muy pronto.",
    "Identifica actores, intereses, tensiones, consecuencias y siguientes movimientos.",
    "Evita frases meta como 'la señal capturada', 'este borrador' o referencias al pipeline.",
    "Evita sensacionalismo, clickbait, coletillas de IA y relleno.",
    "El tono debe ser sobrio, analítico, claro y con voz editorial Synaptik.",
    "El resultado debe sonar a medio profesional, no a automatización RSS."
  ].join(" ");
}

export function buildEditorialUserPrompt(signal: ImportedSignal) {
  return [
    "Convierte esta señal en un artículo breve de Synaptik con estructura periodística real.",
    "",
    `Fuente: ${signal.fuente.nombre}`,
    `Idioma de la fuente: ${signal.fuente.idioma}`,
    `Categoría: ${signal.categoriaSugerida}`,
    `Riesgo editorial: ${signal.clasificacion.riesgoEditorial}`,
    `Prioridad: ${signal.clasificacion.prioridadPublicacion}`,
    `Formato sugerido: ${signal.clasificacion.formatoSugerido}`,
    `Titular original: ${signal.tituloOriginal}`,
    `Resumen original: ${signal.resumenOriginal}`,
    `Palabras clave: ${joinKeywords(signal)}`,
    `URL original: ${signal.urlOriginal}`,
    "",
    "Quiero este resultado:",
    "- titular limpio y fuerte, sin prefijos de marca",
    "- subtítulo que explique qué ocurre y por qué importa",
    "- entradilla que entre rápido en materia",
    "- 4 párrafos con progresión narrativa",
    "- actores e intereses cuando existan",
    "- consecuencias reales",
    "- cierre que deje continuidad o siguiente movimiento",
    "",
    "No escribas sobre el proceso de generación.",
    "No describas la pieza como borrador o señal.",
    "No repitas literalmente el titular original salvo que sea imprescindible.",
    "Si la fuente está en inglés, interpreta y reescribe en español en vez de copiar frases literales.",
    "No hagas un resumen plano: construye conflicto, contexto y consecuencias."
  ].join("\n");
}
