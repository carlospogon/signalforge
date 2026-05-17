import Link from "next/link";
import { ArticleVisual } from "@/components/articles/article-visual";
import { Article } from "@/types/article";

type OpinionArticleLayoutProps = {
  article: Article;
  relatedArticles?: Article[];
  preview?: boolean;
};

function buildPullQuote(article: Article) {
  const candidates = [article.deck, article.excerpt, ...article.body].filter(
    (candidate): candidate is string => Boolean(candidate)
  );

  for (const candidate of candidates) {
    const trimmed = candidate.trim();

    if (trimmed.length >= 48) {
      return trimmed.length > 140 ? `${trimmed.slice(0, 137).trim()}...` : trimmed;
    }
  }

  return article.title;
}

function buildTakeaways(article: Article) {
  const source = article.body.length > 0 ? article.body : [article.excerpt];

  return source
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((paragraph) => (paragraph.length > 96 ? `${paragraph.slice(0, 93).trim()}...` : paragraph));
}

export function OpinionArticleLayout({
  article,
  relatedArticles = [],
  preview = false
}: OpinionArticleLayoutProps) {
  const leadParagraph = article.body[0] ?? article.excerpt;
  const bodyParagraphs = article.body.slice(1);
  const pullQuote = buildPullQuote(article);
  const takeaways = buildTakeaways(article);

  return (
    <article className="overflow-hidden bg-[#f6f1e7] text-[#121212]">
      <section className="grid border-b border-black/10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex flex-col justify-between bg-[#07090c] px-6 py-7 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="space-y-6">
            <div className="inline-flex w-fit bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black">
              {article.tag}
            </div>
            <h1 className="max-w-[10ch] font-['Impact','Arial_Narrow',sans-serif] text-[58px] uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-[84px] lg:text-[106px]">
              {article.title}
            </h1>
            <div className="h-1 w-14 bg-[#1677ff]" />
            <p className="max-w-xl text-[20px] leading-8 text-white/88">{article.deck ?? article.excerpt}</p>
          </div>

          <div className="mt-8 space-y-2 text-[14px] uppercase tracking-[0.08em] text-white/74">
            <p>
              Por <span className="font-semibold text-white">{article.author}</span>
            </p>
            <div className="flex flex-wrap gap-3 text-[12px] text-white/62">
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
          </div>
        </div>

        <div className="min-h-[320px] lg:min-h-[720px]">
          <ArticleVisual
            article={article}
            className="h-full min-h-[320px] w-full lg:min-h-[720px]"
            priority={!preview}
            sizes="(max-width: 1024px) 100vw, 50vw"
            imageClassName="object-cover"
            overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18))]"
          />
        </div>
      </section>

      <section className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10 lg:py-10">
        <aside className="space-y-8 border-black/10 lg:border-r lg:pr-10">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6a6a6a]">Por {article.author}</p>
            <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1b1b1b]">
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {["f", "x", "in", "⛓"].map((item) => (
              <span
                key={item}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-[14px] font-bold"
              >
                {item}
              </span>
            ))}
          </div>

          {relatedArticles.length > 0 ? (
            <div className="space-y-5 border-t border-black/12 pt-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1c1c1c]">Más sobre {article.category}</p>
              <div className="space-y-4">
                {relatedArticles.slice(0, 3).map((related) => (
                  <Link
                    key={related.id}
                    href={preview ? "#" : `/articulo/${related.id}`}
                    className="grid grid-cols-[84px_1fr] gap-3 transition hover:opacity-80"
                  >
                    <ArticleVisual article={related} className="aspect-[6/5] w-full" sizes="84px" />
                    <div className="space-y-1">
                      <p className="text-[12px] font-semibold leading-5 text-[#171717]">{related.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-[#717171]">{related.readingTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <div className="space-y-10">
          <div className="space-y-6 text-[17px] leading-9 text-[#181818]">
            <p className="text-[31px] leading-[1.55]">
              <span className="mr-3 inline-flex h-16 w-16 items-center justify-center bg-black font-['Impact','Arial_Narrow',sans-serif] text-[44px] uppercase leading-none text-white">
                {leadParagraph.charAt(0)}
              </span>
              {leadParagraph.slice(1)}
            </p>
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="border-l-[3px] border-[#1677ff] pl-6">
            <div className="text-[72px] leading-none text-[#1677ff]">“</div>
            <p className="max-w-3xl text-[28px] font-semibold leading-[1.3] text-[#121212]">{pullQuote}</p>
            <footer className="mt-6 space-y-1">
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#3d3d3d]">{article.author}</p>
              <p className="text-[14px] text-[#666]">Firma de Opinión de Synaptik</p>
            </footer>
          </blockquote>

          <div className="grid gap-4 border border-black/8 bg-white/55 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {takeaways.map((item, index) => (
              <div key={`${item}-${index}`} className="space-y-2 border-black/10 xl:border-l xl:pl-4 first:xl:border-l-0 first:xl:pl-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]">
                  Punto {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-[14px] leading-6 text-[#2a2a2a]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
