import Link from "next/link";
import { Article } from "@/types/article";
import { ArticleVisual } from "@/components/articles/article-visual";
import { formatCategoryLabel } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel transition hover:-translate-y-1 hover:border-cyan-400/20">
      <Link
        href={`/articulo/${article.id}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111a]"
        aria-label={`Abrir articulo: ${article.title}`}
      >
        <ArticleVisual
          article={article}
          className="aspect-[4/3] w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-200">
              {formatCategoryLabel(article.category)}
            </span>
            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {article.tag}
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-xl font-medium leading-8 text-white transition group-hover:text-cyan-100">
              {article.title}
            </h3>
            <p className="text-sm leading-7 text-slate-300">{article.excerpt}</p>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.18em] text-slate-500">
            <span>{article.author}</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
