import { categories } from "@/data/categories";
import { categoryHighlights } from "@/data/articles";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategorySection() {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow="Cobertura"
        title="Una portada diseñada para contexto, no para ruido"
        description="Cada bloque responde a una pregunta editorial concreta: que esta cambiando, por que importa y donde mirar despues."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">Mapa editorial</p>
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-400/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-semibold tracking-[0.25em] text-cyan-100">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-white">
                      <Link href={`/categoria/${category.slug}`} className="transition hover:text-cyan-100">
                        {category.label}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categoryHighlights.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
