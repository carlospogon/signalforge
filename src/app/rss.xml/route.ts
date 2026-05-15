import { getAllArticles } from "@/lib/content";
import { getDraftQueue } from "@/lib/editorial";
import { siteConfig } from "@/lib/site";

function toRfc822(value: string) {
  return new Date(value).toUTCString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = (await getAllArticles()).slice(0, 12).map((article, index) => ({
    title: article.title,
    url: `${siteConfig.url}/articulo/${article.id}`,
    description: article.excerpt,
    pubDate: toRfc822(`2026-05-${String(13 - index).padStart(2, "0")}T08:00:00.000Z`)
  }));

  const automated = (await getDraftQueue())
    .filter((draft) => draft.estado === "approved" || draft.estado === "published")
    .map((draft) => ({
      title: draft.titulo,
      url: `${siteConfig.url}${draft.seo.canonicalPath}`,
      description: draft.entradilla,
      pubDate: toRfc822(draft.fechaCreacion)
    }));

  const items = [...automated, ...articles]
    .map(
      (item) => `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(item.url)}</link>
  <guid>${escapeXml(item.url)}</guid>
  <description>${escapeXml(item.description)}</description>
  <pubDate>${item.pubDate}</pubDate>
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${escapeXml(siteConfig.url)}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>es-es</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
