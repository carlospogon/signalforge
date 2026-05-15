import Link from "next/link";
import { ArticleList } from "@/components/articles/article-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAllArticles, getCategories } from "@/lib/content";

export default async function ArchivePage() {
  const categories = getCategories();
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Archivo</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">Explorar Synaptik</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#b8c1c9]">
            Todas las secciones activas del sitio y una seleccion de piezas para navegar el
            universo editorial completo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categoria/${category.slug}`}
                className="border border-[#2a333d] px-4 py-2 text-sm text-[#dbe2e7] transition hover:border-[#b5ff2a] hover:text-white"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <ArticleList articles={articles} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
