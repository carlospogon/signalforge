import Link from "next/link";
import { ArticleVisual } from "@/components/articles/article-visual";
import { SignalList } from "@/components/editorial/signal-list";
import { MarketStrip } from "@/components/home/market-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAllArticles, getCategories } from "@/lib/content";
import { getEditorialSummary, getRadarSignals } from "@/lib/editorial";
import { Article } from "@/types/article";

const topLinks = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" }
];

function pickUniqueArticles(articles: Article[], limit: number, excludedIds: string[] = []) {
  const excluded = new Set(excludedIds);
  const picked: Article[] = [];

  for (const article of articles) {
    if (excluded.has(article.id)) {
      continue;
    }

    picked.push(article);
    excluded.add(article.id);

    if (picked.length === limit) {
      break;
    }
  }

  return picked;
}

function pickFreshSideArticles(articles: Article[], limit: number, excludedIds: string[] = []) {
  const excluded = new Set(excludedIds);
  const usedCategories = new Set<string>();
  const picked: Article[] = [];

  for (const article of articles) {
    if (excluded.has(article.id) || usedCategories.has(article.category)) {
      continue;
    }

    picked.push(article);
    excluded.add(article.id);
    usedCategories.add(article.category);

    if (picked.length === limit) {
      break;
    }
  }

  if (picked.length < limit) {
    for (const article of articles) {
      if (excluded.has(article.id)) {
        continue;
      }

      picked.push(article);
      excluded.add(article.id);

      if (picked.length === limit) {
        break;
      }
    }
  }

  return picked;
}

function pickAnalysisCards(articles: Article[], limit: number, excludedIds: string[] = []) {
  const preferred = articles.filter(
    (article) =>
      article.category === "opinion" ||
      article.tag.toLowerCase().includes("anal") ||
      article.tag.toLowerCase().includes("opinion") ||
      article.tag.toLowerCase().includes("contexto")
  );

  const picked = pickUniqueArticles(preferred, limit, excludedIds);

  if (picked.length === limit) {
    return picked;
  }

  return [
    ...picked,
    ...pickUniqueArticles(articles, limit - picked.length, [...excludedIds, ...picked.map((article) => article.id)])
  ];
}

export default async function Home() {
  const allArticles = await getAllArticles();
  const categoryLabelMap = new Map(getCategories().map((category) => [category.slug, category.label]));
  const hero = allArticles[0];
  const nowStory = allArticles[1] ?? allArticles[0];
  const sideArticles = pickFreshSideArticles(allArticles, 4, [hero?.id, nowStory?.id].filter(Boolean) as string[]);
  const recentArticles = pickUniqueArticles(
    allArticles,
    5,
    [hero?.id, nowStory?.id, ...sideArticles.map((article) => article.id)].filter(Boolean) as string[]
  );
  const analysisCards = pickAnalysisCards(
    allArticles,
    4,
    [
      hero?.id,
      nowStory?.id,
      ...sideArticles.map((article) => article.id),
      ...recentArticles.map((article) => article.id)
    ].filter(Boolean) as string[]
  );
  const [radarSignals, editorialSummary] = await Promise.all([getRadarSignals(3), getEditorialSummary()]);

  if (!hero || !nowStory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <div className="mx-auto max-w-[1054px] bg-[#071018] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:border-x sm:border-[#202830]">
        <div className="hidden min-h-6 items-center justify-between border-b border-[#1b242d] px-8 text-[10px] text-[#b8c0c7] md:flex">
          <p>Desde 2012 informando sobre ciencia, tecnología e innovación</p>
          <div className="flex items-center gap-5">
            {topLinks.map((item) => (
              <Link key={item.label} href={item.href} className="uppercase tracking-[0.12em] text-[#d5dbe0]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <SiteHeader />

        <div className="flex flex-col gap-2 border-b border-[#1b242d] bg-[linear-gradient(180deg,#101821_0%,#0c131b_100%)] px-4 py-3 text-[11px] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-3 overflow-hidden sm:gap-6">
            <span className="font-semibold uppercase tracking-[0.1em] text-[#b5ff2a]">Ahora</span>
            <Link href={`/articulo/${nowStory.id}`} className="truncate text-[#d9e1e7] hover:text-white">
              {nowStory.title}
            </Link>
            <span className="hidden text-[#71808f] sm:inline">{nowStory.publishedAt}</span>
          </div>
          <MarketStrip />
        </div>

        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <section className="grid gap-4 xl:grid-cols-[2.05fr_1.08fr_1fr]">
            <article className="grid overflow-hidden bg-[#09121b] xl:grid-cols-[0.95fr_1.05fr]">
              <Link
                href={`/articulo/${hero.id}`}
                className="relative z-10 flex h-full min-w-0 flex-col justify-between bg-[linear-gradient(180deg,#071018_0%,#09121b_100%)] p-5 sm:p-8"
              >
                <div className="space-y-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
                    {categoryLabelMap.get(hero.category) ?? hero.category}
                  </p>
                  <h2 className="font-display max-w-[360px] text-[20px] font-semibold leading-[1.26] tracking-[-0.01em] text-[#f6f8fa] sm:text-[24px]">
                    {hero.title}
                  </h2>
                  <p className="max-w-[330px] text-[14px] leading-7 text-[#d3dbe2]">{hero.excerpt}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#394652] text-xs font-bold">
                    {hero.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="space-y-1 text-[11px] text-[#d3dbe2]">
                    <p className="font-medium text-white">Por {hero.author}</p>
                    <p className="text-[#8d9aa6]">
                      {hero.publishedAt} | {hero.readingTime} lectura
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href={`/articulo/${hero.id}`}
                className="relative block aspect-[4/5] min-h-[320px] sm:aspect-[4/3] xl:aspect-auto xl:min-h-[420px]"
              >
                <ArticleVisual
                  article={hero}
                  className="h-full w-full"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 620px"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,24,0.02)_0%,rgba(7,16,24,0.04)_50%,rgba(7,16,24,0.12)_100%)]" />
              </Link>
            </article>

            <div className="space-y-3">
              {sideArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articulo/${article.id}`}
                  className="flex gap-3 border-b border-[#1b242d] pb-3 transition hover:bg-white/[0.02] last:border-b-0"
                >
                  <ArticleVisual article={article} className="aspect-[6/5] w-[92px] shrink-0" sizes="92px" />
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#b5ff2a]">
                      {categoryLabelMap.get(article.category) ?? article.category}
                    </p>
                    <h3 className="text-[13px] leading-5 text-[#f0f4f7]">{article.title}</h3>
                    <p className="text-[10px] text-[#778491]">{article.publishedAt}</p>
                  </div>
                </Link>
              ))}
            </div>

            <aside className="bg-[#0b131c] px-5 py-6 sm:px-7">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold uppercase tracking-[0.04em] text-[#eef3f7] sm:text-[24px]">
                  Últimas publicadas
                </h3>
                <Link href="/archivo" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                  Ver más
                </Link>
              </div>
              <div className="mt-4 h-px w-8 bg-[#b5ff2a]" />
              <ol className="mt-6 space-y-5">
                {recentArticles.map((article, index) => (
                  <li key={article.id} className="grid grid-cols-[18px_1fr] gap-4">
                    <span className="text-[28px] leading-none text-[#b5ff2a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <Link
                        href={`/articulo/${article.id}`}
                        className="block text-[13px] leading-6 text-[#edf1f4] hover:text-white"
                      >
                        {article.title}
                      </Link>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-[#72808c]">{article.publishedAt}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </section>

          <section className="mt-5 border border-[#1b242d] bg-[#08111a] p-4 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[#1b242d] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
                  Automatización editorial
                </p>
                <h3 className="text-[24px] font-semibold uppercase tracking-[0.04em] text-[#f3f6f8] sm:text-[30px]">
                  No perseguimos titulares. Interpretamos señales.
                </h3>
                <p className="max-w-3xl text-[13px] leading-6 text-[#b8c1c9]">
                  Synaptik ya prepara una capa de ingesta modular para detectar fuentes fiables,
                  clasificar riesgo editorial y convertir señales en borradores revisables antes de
                  publicar.
                </p>
              </div>
              <div className="grid gap-px bg-[#1b242d] sm:grid-cols-3">
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Fuentes</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.sourceCount}</p>
                </div>
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Señales</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.signalCount}</p>
                </div>
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Revisión</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.reviewCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#7d8b96]">Radar Synaptik</p>
                    <h4 className="mt-2 text-[22px] font-semibold text-[#eef3f7]">Últimas señales detectadas</h4>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#88959f]">
                    Fuentes verificables
                  </span>
                </div>
                <SignalList signals={radarSignals} />
              </div>

              <aside className="border border-[#1b242d] bg-[#0b131c] p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
                  Mesa editorial
                </p>
                <h4 className="mt-3 text-[22px] font-semibold text-[#eef3f7]">
                  Análisis riguroso, contexto claro y lectura accesible
                </h4>
                <p className="mt-4 text-[13px] leading-6 text-[#b8c1c9]">
                  En Synaptik revisamos cada señal con criterio editorial, contrastamos fuentes y
                  ordenamos el contexto antes de publicar. La ambición no es complicar la
                  información, sino hacerla precisa, didáctica y útil para cualquier lector, tenga
                  o no una base técnica previa.
                </p>
                <div className="mt-6 space-y-3 border-t border-[#1b242d] pt-5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                    <span>Radar Synaptik</span>
                    <span className="text-[#8b98a3]">Señales clave del momento</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                    <span>Análisis Synaptik</span>
                    <span className="text-[#8b98a3]">Contexto, contraste y criterio</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                    <span>Opinión</span>
                    <span className="text-[#8b98a3]">Firma y mirada editorial propia</span>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.9fr_0.65fr]">
            <div className="border border-[#1b242d] bg-[#08111a] p-4">
              <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-[2px] bg-[#b5ff2a]" />
                  <h3 className="text-[22px] font-semibold uppercase tracking-[0.04em] text-[#f5f7f9] sm:text-[28px]">
                    Análisis y opinión
                  </h3>
                </div>
                <Link href="/categoria/opinion" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                  Abrir sección
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {analysisCards.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/articulo/${article.id}`}
                    className={index === 3 ? "md:col-span-2 xl:col-span-1" : ""}
                  >
                    <div className="relative h-[160px] overflow-hidden bg-[#0a141d]">
                      <ArticleVisual
                        article={article}
                        className="aspect-[4/3] h-full w-full"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,12,0.05)_0%,rgba(3,7,12,0.84)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                          {article.tag}
                        </p>
                        <h4 className="mt-2 text-[13px] leading-5 text-white">{article.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="border border-[#1b242d] bg-[#08111a] px-5 py-5 sm:px-6">
              <h3 className="text-[22px] font-semibold uppercase tracking-[0.04em] text-[#f3f6f8] sm:text-[28px]">
                Newsletter
              </h3>
              <p className="mt-4 text-[13px] leading-6 text-[#b8c1c9]">
                El boletín editorial abrirá con la primera versión pública. Hasta entonces puedes
                revisar el archivo o solicitar acceso anticipado.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/newsletter"
                  className="bg-[#b5ff2a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#11170f]"
                >
                  Ver estado del boletín
                </Link>
                <Link
                  href="/contacto"
                  className="border border-[#2a333d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-white"
                >
                  Solicitar acceso
                </Link>
              </div>
              <div className="mt-6 space-y-3 border-t border-[#1b242d] pt-5">
                <Link href="/categoria/energia" className="block text-[12px] uppercase tracking-[0.08em] text-[#dce3e8]">
                  Especial energía e IA
                </Link>
                <Link href="/categoria/salud" className="block text-[12px] uppercase tracking-[0.08em] text-[#dce3e8]">
                  Especial salud y biotech
                </Link>
              </div>
            </aside>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
