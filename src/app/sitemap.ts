import type { MetadataRoute } from "next";
import { getAllArticles, getCategories } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    "",
    "/archivo",
    "/contacto",
    "/newsletter",
    "/politica-de-privacidad",
    "/preferencias-de-privacidad",
    "/quienes-somos"
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date()
  }));

  const categoryEntries: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${siteConfig.url}/categoria/${category.slug}`,
    lastModified: new Date()
  }));

  const articleEntries: MetadataRoute.Sitemap = (await getAllArticles()).map((article) => ({
    url: `${siteConfig.url}/articulo/${article.id}`,
    lastModified: new Date()
  }));

  return [...baseEntries, ...categoryEntries, ...articleEntries];
}
