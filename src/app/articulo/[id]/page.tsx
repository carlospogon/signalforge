import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/articles/article-list";
import { ArticleVisual } from "@/components/articles/article-visual";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getArticleById, getCategoryBySlug, getRelatedArticles } from "@/lib/content";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {};
  }

  return {
    title: `${article.title} | Synaptik`,
    description: article.deck ?? article.excerpt
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.category);
  const relatedArticles = await getRelatedArticles(article.id, article.category, 3);

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <article className="overflow-hidden border border-[#1b242d] bg-[#08111a]">
          <ArticleVisual
            article={article}
            className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/9]"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            presentation="cover"
          />
          <div className="space-y-8 p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em]">
                <Link
                  href={`/categoria/${article.category}`}
                  className="border border-[#2a333d] bg-[#0d1620] px-3 py-1 text-[#b5ff2a]"
                >
                  {category?.label ?? article.category}
                </Link>
                <span className="text-slate-500">{article.tag}</span>
              </div>
              <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {article.title}
              </h1>
              <p className="text-lg leading-8 text-slate-300">{article.deck ?? article.excerpt}</p>
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-5 text-sm text-slate-400">
                <span>{article.author}</span>
                <span>{article.publishedAt}</span>
                <span>{article.readingTime}</span>
              </div>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-200">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>

        {relatedArticles.length > 0 ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-semibold text-white">Más en {category?.label ?? article.category}</h2>
              <Link href={`/categoria/${article.category}`} className="text-sm text-[#b5ff2a]">
                Abrir sección
              </Link>
            </div>
            <ArticleList articles={relatedArticles} />
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
