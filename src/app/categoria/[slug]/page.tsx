import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/articles/article-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OpinionFeaturedCard } from "@/components/opinion/opinion-featured-card";
import { getArticlesByCategory, getCategories, getCategoryBySlug } from "@/lib/content";
import { CategorySlug } from "@/types/article";

type CategoryPageProps = {
  params: Promise<{ slug: CategorySlug }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.label} | Synaptik`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  if (slug === "opinion") {
    const featuredArticle = articles[0];
    const remainingArticles = articles.slice(1);

    return (
      <div className="min-h-screen bg-[#05090f] text-white">
        <SiteHeader />
        <main className="mx-auto flex max-w-[1120px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <section className="border border-[#2f2612] bg-[#101012] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl space-y-4">
                <span className="inline-flex border border-[#3a3222] bg-[#17140e] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffe17a]">
                  Sección premium
                </span>
                <h1 className="font-['Impact','Arial_Narrow',sans-serif] text-5xl uppercase tracking-[-0.03em] text-white sm:text-7xl">
                  {category.label}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#d3cab0]">{category.description}</p>
              </div>
              <Link
                href="/"
                className="border border-[#3a3222] px-4 py-2 text-sm text-[#e6dcc2] transition hover:border-[#ffe17a] hover:text-white"
              >
                Volver a portada
              </Link>
            </div>
          </section>

          {featuredArticle ? <OpinionFeaturedCard article={featuredArticle} /> : null}

          {remainingArticles.length > 0 ? (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl font-semibold text-white">Más columnas</h2>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#b8aa78]">Archivo editorial</span>
              </div>
              <ArticleList articles={remainingArticles} />
            </section>
          ) : null}
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="border border-[#1b242d] bg-[#08111a] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex border border-[#2a333d] bg-[#0d1620] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#b5ff2a]">
                Categoria
              </span>
              <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{category.label}</h1>
              <p className="text-base leading-8 text-slate-300">{category.description}</p>
            </div>
            <Link
              href="/"
              className="border border-[#2a333d] px-4 py-2 text-sm text-slate-300 transition hover:border-[#b5ff2a] hover:text-white"
            >
              Volver a portada
            </Link>
          </div>
        </section>

        <ArticleList articles={articles} />
      </main>
      <SiteFooter />
    </div>
  );
}
