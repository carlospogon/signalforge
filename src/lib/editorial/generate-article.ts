import { buildEditorialBrief } from "@/lib/editorial/brief";
import { buildEditorialSystemPrompt, buildEditorialUserPrompt } from "@/lib/editorial/prompts";
import { env } from "@/lib/env";
import { restoreSpanishText } from "@/lib/spanish";
import { ImportedSignal } from "@/types/editorial";

export type GeneratedEditorialArticle = {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[];
  tag: string;
};

const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    subtitle: { type: "STRING" },
    excerpt: { type: "STRING" },
    body: {
      type: "ARRAY",
      minItems: 4,
      maxItems: 5,
      items: { type: "STRING" }
    },
    tag: { type: "STRING" }
  },
  required: ["title", "subtitle", "excerpt", "body", "tag"],
  propertyOrdering: ["title", "subtitle", "excerpt", "body", "tag"]
} as const;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanModelText(value: string) {
  return restoreSpanishText(normalizeWhitespace(value.replace(/^["']+|["']+$/g, "")));
}

function looksLikeEnglish(value: string) {
  const sample = value.toLowerCase();
  const englishSignals = [
    " the ",
    " and ",
    " with ",
    " from ",
    " that ",
    " this ",
    " their ",
    " they ",
    " how ",
    " what ",
    " true",
    " online ",
    " social media",
    " generation "
  ];
  const spanishSignals = [
    " el ",
    " la ",
    " los ",
    " las ",
    " una ",
    " para ",
    " que ",
    " con ",
    " del ",
    " por ",
    " como ",
    " se ",
    " su "
  ];
  const englishScore = englishSignals.reduce((score, token) => score + (sample.includes(token) ? 1 : 0), 0);
  const spanishScore = spanishSignals.reduce((score, token) => score + (sample.includes(token) ? 1 : 0), 0);

  return englishScore >= 2 && englishScore > spanishScore;
}

function articleLooksLikeEnglish(article: GeneratedEditorialArticle) {
  return looksLikeEnglish([article.title, article.subtitle, article.excerpt, ...article.body].join(" "));
}

function buildSpanishFallbackTitle(signal: ImportedSignal) {
  switch (signal.categoriaSugerida) {
    case "ia":
      return "La carrera de la IA abre un nuevo frente";
    case "ciencia":
      return "Una nueva senal reordena el pulso cientifico";
    case "tecnologia":
      return "El sector tecnologico suma un movimiento con impacto abierto";
    case "espacio":
      return "La competencia espacial gana una nueva variable estrategica";
    case "salud":
      return "La innovacion en salud entra en una fase de validacion decisiva";
    case "biotech":
      return "La biotecnologia afronta un movimiento con implicaciones amplias";
    case "ciberseguridad":
      return "La presion sobre la ciberseguridad escala con un nuevo frente";
    case "laboratorio":
      return "Una prueba de laboratorio anticipa un cambio de criterio";
    case "opinion":
      return "La discusion tecnologica exige una nueva lectura editorial";
    default:
      return "Una nueva senal obliga a releer el equilibrio del sector";
  }
}

function buildFallback(signal: ImportedSignal): GeneratedEditorialArticle {
  const brief = buildEditorialBrief({
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
  const source = signal.fuente.nombre;
  const originalSummary = cleanModelText(signal.resumenOriginal || signal.tituloOriginal);
  const sourceLooksEnglish =
    signal.fuente.idioma === "en" || looksLikeEnglish(`${signal.tituloOriginal} ${signal.resumenOriginal}`);
  const title = sourceLooksEnglish
    ? buildSpanishFallbackTitle(signal)
    : cleanModelText(originalSummary.endsWith(".") ? originalSummary.slice(0, -1) : originalSummary);
  const subtitle = cleanModelText(`${brief.keyPoint} ${brief.whyItMatters}`);
  const excerpt = cleanModelText(`${brief.editorialFocus} ${brief.nextSignals}`);
  const summaryReference = sourceLooksEnglish ? brief.movementType : originalSummary.toLowerCase();

  return {
    title,
    subtitle,
    excerpt,
    body: [
      cleanModelText(
        `${source} apunta a ${summaryReference} con un alcance hoy situado en ${brief.scope}. La clave es separar hecho confirmado, ritmo de despliegue y efectos de segundo orden.`
      ),
      cleanModelText(brief.whyItMatters),
      cleanModelText(brief.editorialFocus),
      cleanModelText(brief.nextSignals)
    ],
    tag: signal.clasificacion.formatoSugerido === "analysis" ? "Analisis" : "Radar"
  };
}

function extractGeminiText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;
  const candidates = Array.isArray(record.candidates)
    ? (record.candidates as Array<Record<string, unknown>>)
    : [];

  for (const candidate of candidates) {
    const content =
      candidate.content && typeof candidate.content === "object"
        ? (candidate.content as Record<string, unknown>)
        : null;

    if (!content) {
      continue;
    }

    const parts = Array.isArray(content.parts) ? (content.parts as Array<Record<string, unknown>>) : [];

    for (const part of parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }

  return "";
}

function isGeneratedArticle(value: unknown): value is GeneratedEditorialArticle {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.title === "string" &&
    typeof record.subtitle === "string" &&
    typeof record.excerpt === "string" &&
    typeof record.tag === "string" &&
    Array.isArray(record.body) &&
    record.body.every((paragraph) => typeof paragraph === "string")
  );
}

async function generateWithGemini(signal: ImportedSignal): Promise<GeneratedEditorialArticle | null> {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildEditorialSystemPrompt() }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildEditorialUserPrompt(signal) }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          responseMimeType: "application/json",
          responseSchema
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini editorial generation failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const outputText = extractGeminiText(payload);

  if (!outputText) {
    return null;
  }

  const parsed = JSON.parse(outputText) as unknown;

  if (!isGeneratedArticle(parsed)) {
    return null;
  }

  return {
    title: cleanModelText(parsed.title),
    subtitle: cleanModelText(parsed.subtitle),
    excerpt: cleanModelText(parsed.excerpt),
    body: parsed.body.map((paragraph) => cleanModelText(paragraph)).filter(Boolean),
    tag: cleanModelText(parsed.tag)
  };
}

export async function generateEditorialArticle(signal: ImportedSignal) {
  try {
    const generated = await generateWithGemini(signal);
    if (!generated) {
      return buildFallback(signal);
    }

    return articleLooksLikeEnglish(generated) ? buildFallback(signal) : generated;
  } catch (error) {
    console.error("Editorial Gemini generation failed, using fallback.", error);
    return buildFallback(signal);
  }
}
