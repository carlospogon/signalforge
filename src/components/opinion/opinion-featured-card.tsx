import Link from "next/link";
import { ArticleVisual } from "@/components/articles/article-visual";
import { Article } from "@/types/article";

type OpinionFeaturedCardProps = {
  article: Article;
};

export function OpinionFeaturedCard({ article }: OpinionFeaturedCardProps) {
  return (
    <article className="overflow-hidden border border-black/12 bg-[#f6f1e7] text-[#111]">
      <div className="grid lg:grid-cols-[0.98fr_1.02fr]">
        <div className="flex flex-col justify-between bg-[#06090d] px-6 py-7 text-white sm:px-8 sm:py-10">
          <div className="space-y-5">
            <span className="inline-flex bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black">
              {article.tag}
            </span>
            <h2 className="max-w-[10ch] font-['Impact','Arial_Narrow',sans-serif] text-[52px] uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-[74px]">
              <Link href={`/articulo/${article.id}`} className="hover:text-[#dfe7ef]">
                {article.title}
              </Link>
            </h2>
            <div className="h-1 w-14 bg-[#1677ff]" />
            <p className="max-w-xl text-[20px] leading-8 text-white/86">{article.deck ?? article.excerpt}</p>
          </div>

          <div className="mt-8 space-y-1 text-[13px] uppercase tracking-[0.08em] text-white/72">
            <p>
              Por <span className="font-semibold text-white">{article.author}</span>
            </p>
            <p className="text-[12px] text-white/58">
              {article.publishedAt} • {article.readingTime}
            </p>
          </div>
        </div>

        <Link href={`/articulo/${article.id}`} className="block min-h-[300px]">
          <ArticleVisual
            article={article}
            className="h-full min-h-[300px] w-full"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            imageClassName="object-cover"
            overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18))]"
          />
        </Link>
      </div>
    </article>
  );
}
