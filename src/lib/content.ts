import { allArticles } from "@/data/articles";
import { categories } from "@/data/categories";
import { listPublishedArticles } from "@/lib/editorial/store";
import { Article, CategorySlug } from "@/types/article";

function mergeArticles(staticArticles: Article[], publishedArticles: Article[]) {
  const merged = [...publishedArticles, ...staticArticles];
  const deduped = new Map<string, Article>();

  for (const article of merged) {
    if (!deduped.has(article.id)) {
      deduped.set(article.id, article);
    }
  }

  return Array.from(deduped.values());
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug);
}

export async function getAllArticles() {
  const publishedArticles = await listPublishedArticles();
  return mergeArticles(allArticles, publishedArticles);
}

export async function getFeaturedArticle() {
  const articles = await getAllArticles();
  return articles[0];
}

export async function getArticleById(id: string) {
  const articles = await getAllArticles();
  return articles.find((article) => article.id === id);
}

export async function getArticlesByCategory(slug: CategorySlug): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter((article) => article.category === slug);
}

export async function getLatestArticles(limit?: number) {
  const articles = await getAllArticles();
  return typeof limit === "number" ? articles.slice(0, limit) : articles;
}

export async function getRelatedArticles(id: string, category: CategorySlug, limit = 3) {
  const articles = await getAllArticles();
  return articles.filter((article) => article.id !== id && article.category === category).slice(0, limit);
}
