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

function buildFallback(signal: ImportedSignal): GeneratedEditorialArticle {
  const source = signal.fuente.nombre;
  const summary = cleanModelText(signal.resumenOriginal || signal.tituloOriginal);
  const title = cleanModelText(summary.endsWith(".") ? summary.slice(0, -1) : summary);
  const subtitle = cleanModelText(
    `${source} coloca esta senal dentro de una disputa mas amplia en ${signal.categoriaSugerida}, con implicaciones que todavia no estan cerradas.`
  );
  const excerpt = cleanModelText(
    `${title}. La clave no es solo el anuncio, sino que cambia para los actores implicados y que recorrido real puede tener en el sector.`
  );

  return {
    title,
    subtitle,
    excerpt,
    body: [
      cleanModelText(
        `${source} ha puesto sobre la mesa ${summary.toLowerCase()}. La noticia importa porque puede alterar prioridades industriales, cientificas o empresariales mas alla del titular inicial.`
      ),
      cleanModelText(
        `La lectura editorial empieza por identificar quien gana tiempo, quien queda bajo presion y que condiciona el siguiente movimiento del mercado o de la investigacion.`
      ),
      cleanModelText(
        `Tambien conviene separar la promesa del despliegue real: no todas las senales cambian el equilibrio del sector, pero algunas si anticipan una reorganizacion de poder, inversion o regulacion.`
      ),
      cleanModelText(
        `Para Synaptik, el valor esta en seguir confirmaciones, respuestas de competidores y efectos economicos o politicos antes de convertir esta pieza en una cobertura mas profunda.`
      )
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
    return generated ?? buildFallback(signal);
  } catch (error) {
    console.error("Editorial Gemini generation failed, using fallback.", error);
    return buildFallback(signal);
  }
}
