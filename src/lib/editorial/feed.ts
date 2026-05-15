import { XMLParser } from "fast-xml-parser";
import { decode } from "he";
import { EditorialSource, SourceSignal } from "@/types/editorial";

type FeedEntry = {
  title?: string | { "#text"?: string; "__cdata"?: string };
  link?: string | { href?: string } | Array<{ href?: string }>;
  guid?: string | { "#text"?: string };
  pubDate?: string;
  isoDate?: string;
  published?: string;
  updated?: string;
  summary?: unknown;
  content?: unknown;
  description?: unknown;
  category?: string | string[] | Array<string | { "#text"?: string }>;
  enclosure?: { url?: string; type?: string } | Array<{ url?: string; type?: string }>;
  "media:content"?: { url?: string; medium?: string } | Array<{ url?: string; medium?: string }>;
  "media:thumbnail"?: { url?: string } | Array<{ url?: string }>;
};

const parser = new XMLParser({
  attributeNamePrefix: "",
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true
});

function toArray<T>(value: T | T[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).join(" ");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return toText(record["#text"] ?? record.__cdata ?? record.href ?? "");
  }

  return "";
}

function stripHtml(value: unknown) {
  return decode(toText(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createStableHash(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return `sig-${Math.abs(hash).toString(16)}`;
}

function pickEntryLink(link: FeedEntry["link"]) {
  if (typeof link === "string") {
    return link;
  }

  if (Array.isArray(link)) {
    return link.find((candidate) => candidate.href)?.href ?? "";
  }

  return link?.href ?? "";
}

function pickGuid(entry: FeedEntry) {
  if (typeof entry.guid === "string") {
    return entry.guid;
  }

  return entry.guid?.["#text"] ?? pickEntryLink(entry.link);
}

function pickSummary(entry: FeedEntry) {
  const raw = entry.summary ?? entry.description ?? entry.content ?? "";
  return stripHtml(raw).slice(0, 420);
}

function pickKeywords(entry: FeedEntry) {
  return toArray(entry.category)
    .map((value) => {
      if (typeof value === "string") {
        return stripHtml(value);
      }

      return stripHtml(value?.["#text"] ?? "");
    })
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function pickPublishedAt(entry: FeedEntry) {
  return entry.isoDate ?? entry.published ?? entry.updated ?? entry.pubDate ?? new Date().toISOString();
}

function pickImageFromHtml(value: unknown) {
  const text = toText(value);
  const match = text.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function pickImage(entry: FeedEntry) {
  const enclosure = toArray(entry.enclosure).find((item) => item.url && item.type?.startsWith("image/"));

  if (enclosure?.url) {
    return enclosure.url;
  }

  const mediaContent = toArray(entry["media:content"]).find((item) => item.url);

  if (mediaContent?.url) {
    return mediaContent.url;
  }

  const mediaThumbnail = toArray(entry["media:thumbnail"]).find((item) => item.url);

  if (mediaThumbnail?.url) {
    return mediaThumbnail.url;
  }

  return (
    pickImageFromHtml(entry.content) ??
    pickImageFromHtml(entry.summary) ??
    pickImageFromHtml(entry.description) ??
    undefined
  );
}

function normalizeEntry(source: EditorialSource, entry: FeedEntry, index: number): SourceSignal | null {
  const tituloOriginal = stripHtml(entry.title ?? "");
  const urlOriginal = pickEntryLink(entry.link);

  if (!tituloOriginal || !urlOriginal) {
    return null;
  }

  const guid = pickGuid(entry);
  const fingerprint = guid || `${tituloOriginal}:${urlOriginal}:${index}`;

  return {
    id: createStableHash(`${source.id}:${normalizeText(fingerprint)}`),
    sourceId: source.id,
    tituloOriginal,
    urlOriginal,
    guidOriginal: guid || undefined,
    fechaPublicacion: new Date(pickPublishedAt(entry)).toISOString(),
    resumenOriginal: pickSummary(entry),
    palabrasClave: pickKeywords(entry),
    imagenUrl: pickImage(entry),
    imagenAlt: tituloOriginal
  };
}

function extractEntries(xml: string) {
  const parsed = parser.parse(xml);
  const rssItems = toArray(parsed?.rss?.channel?.item);
  const atomEntries = toArray(parsed?.feed?.entry);

  return [...rssItems, ...atomEntries] as FeedEntry[];
}

export async function fetchSourceSignals(source: EditorialSource, limit = 12) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9",
        "User-Agent": "SynaptikBot/1.0 (+https://signalforge-sand.vercel.app)"
      },
      next: { revalidate: 1800 },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Feed request failed with status ${response.status}`);
    }

    const xml = await response.text();
    const entries = extractEntries(xml);

    return entries
      .map((entry, index) => normalizeEntry(source, entry, index))
      .filter((entry): entry is SourceSignal => entry !== null)
      .slice(0, limit);
  } finally {
    clearTimeout(timeoutId);
  }
}
