import { allArticles } from "@/data/articles";
import { categories } from "@/data/categories";
import { Article, CategorySlug } from "@/types/article";

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug);
}

export function getAllArticles() {
  return allArticles;
}

export function getFeaturedArticle() {
  return allArticles[0];
}

export function getArticleById(id: string) {
  return allArticles.find((article) => article.id === id);
}

export function getArticlesByCategory(slug: CategorySlug): Article[] {
  return allArticles.filter((article) => article.category === slug);
}

export function getLatestArticles(limit?: number) {
  return typeof limit === "number" ? allArticles.slice(0, limit) : allArticles;
}

export function getRelatedArticles(id: string, category: CategorySlug, limit = 3) {
  return allArticles.filter((article) => article.id !== id && article.category === category).slice(0, limit);
}
