import { env } from "@/lib/env";
import { EditorialCategory } from "@/types/editorial";

type ResolveEditorialImageInput = {
  articleUrl: string;
  title: string;
  summary?: string;
  keywords?: string[];
  category?: EditorialCategory;
  existingImageUrl?: string;
};

type ResolvedEditorialImage = {
  imageUrl?: string;
  imageAlt?: string;
  source: "input" | "article" | "pexels" | "none";
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function isDirectImageUrl(value: string) {
  try {
    const url = new URL(value);
    return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function normalizeCandidateUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

export function resolvePexelsImageUrl(value: string) {
  try {
    const url = new URL(value);

    if (!url.hostname.includes("pexels.com")) {
      return null;
    }

    const match = url.pathname.match(/-(\d+)\/?$/) ?? url.pathname.match(/\/photo\/(?:.+-)?(\d+)\/?$/);
    const id = match?.[1];

    if (!id) {
      return null;
    }

    return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  } catch {
    return null;
  }
}

function extractMetaImage(html: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']image_src["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function extractStructuredImage(html: string) {
  const patterns = [
    /"image"\s*:\s*"([^"]+)"/i,
    /"thumbnailUrl"\s*:\s*"([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/\\\//g, "/");
    }
  }

  return null;
}

function extractInlineImage(html: string) {
  const imgMatches = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi));

  for (const match of imgMatches) {
    const src = match[1];
    if (!src) {
      continue;
    }

    if (/logo|avatar|icon|sprite|emoji|banner-small/i.test(src)) {
      continue;
    }

    return src;
  }

  return null;
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 SynaptikEditorial/1.0"
    },
    signal: AbortSignal.timeout(6000)
  });

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("text/html")) {
    return null;
  }

  return response.text();
}

async function extractImageFromArticlePage(articleUrl: string) {
  try {
    const html = await fetchHtml(articleUrl);

    if (!html) {
      return undefined;
    }

    const candidate =
      extractMetaImage(html) ??
      extractStructuredImage(html) ??
      extractInlineImage(html);

    if (!candidate) {
      return undefined;
    }

    return normalizeCandidateUrl(candidate, articleUrl) ?? undefined;
  } catch {
    return undefined;
  }
}

function categorySearchTerm(category?: EditorialCategory) {
  switch (category) {
    case "ia":
      return "artificial intelligence";
    case "ciencia":
      return "science laboratory";
    case "tecnologia":
      return "technology";
    case "espacio":
      return "space";
    case "salud":
      return "healthcare";
    case "biotech":
      return "biotechnology";
    case "ciberseguridad":
      return "cybersecurity";
    case "laboratorio":
      return "research lab";
    case "opinion":
      return "editorial portrait";
    default:
      return "technology";
  }
}

function buildPexelsQuery(input: ResolveEditorialImageInput) {
  const fromKeywords = (input.keywords ?? [])
    .map((keyword) => normalizeWhitespace(keyword))
    .filter((keyword) => keyword.length > 2)
    .slice(0, 3);
  const fromTitle = normalizeWhitespace(input.title)
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 5);
  const terms = [...fromKeywords, ...fromTitle];

  if (terms.length > 0) {
    return terms.join(" ");
  }

  return categorySearchTerm(input.category);
}

async function searchPexelsImage(input: ResolveEditorialImageInput) {
  if (!env.PEXELS_API_KEY) {
    return undefined;
  }

  const query = buildPexelsQuery(input);
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "large");
  url.searchParams.set("locale", "en-US");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: env.PEXELS_API_KEY
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as {
      photos?: Array<{
        src?: {
          landscape?: string;
          large?: string;
          large2x?: string;
          original?: string;
        };
      }>;
    };

    const photo = payload.photos?.[0];
    return photo?.src?.landscape ?? photo?.src?.large ?? photo?.src?.large2x ?? photo?.src?.original;
  } catch {
    return undefined;
  }
}

export async function resolveImageUrlInput(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (isDirectImageUrl(trimmed)) {
    return trimmed;
  }

  const pexelsImageUrl = resolvePexelsImageUrl(trimmed);

  if (pexelsImageUrl) {
    return pexelsImageUrl;
  }

  const fromArticle = await extractImageFromArticlePage(trimmed);
  return fromArticle ?? trimmed;
}

export async function resolveEditorialImage(input: ResolveEditorialImageInput): Promise<ResolvedEditorialImage> {
  const directInput = await resolveImageUrlInput(input.existingImageUrl);

  if (directInput && directInput !== input.existingImageUrl ? isDirectImageUrl(directInput) : Boolean(directInput)) {
    return {
      imageUrl: directInput,
      imageAlt: input.title,
      source: "input"
    };
  }

  const articleImage = await extractImageFromArticlePage(input.articleUrl);

  if (articleImage) {
    return {
      imageUrl: articleImage,
      imageAlt: input.title,
      source: "article"
    };
  }

  const pexelsImage = await searchPexelsImage(input);

  if (pexelsImage) {
    return {
      imageUrl: pexelsImage,
      imageAlt: input.title,
      source: "pexels"
    };
  }

  return {
    source: "none"
  };
}
