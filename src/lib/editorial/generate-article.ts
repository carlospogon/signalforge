import { env } from "@/lib/env";
import { restoreSpanishText } from "@/lib/spanish";
import { buildEditorialSystemPrompt, buildEditorialUserPrompt } from "@/lib/editorial/prompts";
import { ImportedSignal } from "@/types/editorial";

export type GeneratedEditorialArticle = {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string[];
  tag: string;
};

const outputSchema = {
  name: "synaptik_editorial_article",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      subtitle: { type: "string" },
      excerpt: { type: "string" },
      body: {
        type: "array",
        minItems: 4,
        maxItems: 5,
        items: { type: "string" }
      },
      tag: { type: "string" }
    },
    required: ["title", "subtitle", "excerpt", "body", "tag"]
  }
} as const;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanModelText(value: string) {
  return restoreSpanishText(normalizeWhitespace(value.replace(/^["'“”]+|["'“”]+$/g, "")));
}

function buildFallback(signal: ImportedSignal): GeneratedEditorialArticle {
  const source = signal.fuente.nombre;
  const summary = cleanModelText(signal.resumenOriginal || signal.tituloOriginal);
  const title = summary.endsWith(".") ? summary.slice(0, -1) : summary;
  const subtitle = cleanModelText(
    `${source} sitúa este movimiento en el centro de una conversación más amplia sobre ${signal.categoriaSugerida}, con consecuencias que todavía están abiertas.`
  );
  const excerpt = cleanModelText(
    `${title}. La cuestión no es solo qué ha ocurrido, sino qué puede cambiar en el sector si esta señal se confirma.`
  );

  return {
    title,
    subtitle,
    excerpt,
    body: [
      cleanModelText(
        `${source} ha puesto el foco en ${summary.toLowerCase()}. La noticia merece atención porque apunta a un cambio concreto, no solo a una actualización menor dentro del ciclo informativo.`
      ),
      cleanModelText(
        `El interés editorial está en qué actores quedan mejor posicionados, qué límites siguen presentes y si este movimiento altera de verdad el equilibrio del sector.`
      ),
      cleanModelText(
        `Más allá del titular, la clave es medir si estamos ante una señal con recorrido industrial, científico o estratégico, o solo ante una promesa que todavía necesita validación.`
      ),
      cleanModelText(
        `El siguiente paso para Synaptik es observar confirmaciones, reacción de competidores y posibles consecuencias regulatorias, económicas o de despliegue antes de elevar la pieza.`
      )
    ],
    tag: signal.clasificacion.formatoSugerido === "analysis" ? "Análisis" : "Radar"
  };
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string") {
    return record.output_text;
  }

  const output = Array.isArray(record.output) ? record.output : [];

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = Array.isArray((item as Record<string, unknown>).content)
      ? ((item as Record<string, unknown>).content as Array<Record<string, unknown>>)
      : [];

    for (const block of content) {
      if (typeof block.text === "string") {
        return block.text;
      }
    }
  }

  return "";
}

async function generateWithOpenAI(signal: ImportedSignal): Promise<GeneratedEditorialArticle | null> {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildEditorialSystemPrompt() }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildEditorialUserPrompt(signal) }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          ...outputSchema
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI editorial generation failed: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const outputText = extractOutputText(payload);

  if (!outputText) {
    return null;
  }

  const parsed = JSON.parse(outputText) as GeneratedEditorialArticle;

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
    const generated = await generateWithOpenAI(signal);
    return generated ?? buildFallback(signal);
  } catch (error) {
    console.error("Editorial LLM generation failed, using fallback.", error);
    return buildFallback(signal);
  }
}
