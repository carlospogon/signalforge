import Link from "next/link";
import { ArticleVisual } from "@/components/articles/article-visual";
import { SignalList } from "@/components/editorial/signal-list";
import { MarketStrip } from "@/components/home/market-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAllArticles } from "@/lib/content";
import { getEditorialSummary, getRadarSignals } from "@/lib/editorial";
import { Article } from "@/types/article";

const topLinks = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Quienes somos", href: "/quienes-somos" },
  { label: "Contacto", href: "/contacto" }
];

const sideStories = [
  { id: "agua-exoplaneta-habitable", category: "Espacio" },
  { id: "chip-fotonico-revoluciona-ia", category: "Tecnologia" },
  { id: "fusion-nuclear-22-minutos", category: "Ciencia" },
  { id: "terapia-genica-sin-cirugia", category: "Salud" }
];

const mostRead = [
  { id: "infraestructura-europea-ia" },
  { id: "chip-fotonico-revoluciona-ia" },
  { id: "fusion-nuclear-22-minutos" },
  { id: "rover-buscara-vida-marte-2026" },
  { id: "pacientes-crispr-exito" }
];

const metrics = [
  { value: "Desde 2012", detail: "Mas de una decada informando cada dia", href: "/quienes-somos" },
  { value: "+12.500", detail: "Articulos publicados sobre tecnologia y ciencia", href: "/archivo" },
  { value: "+2,5 millones", detail: "De lectores mensuales en todo el mundo", href: "/newsletter" },
  { value: "150+ paises", detail: "Una comunidad global apasionada por la innovacion", href: "/archivo" },
  { value: "Premios", detail: "Reconocidos por nuestra calidad editorial", href: "/quienes-somos" }
];

const bottomCards = ["la-fatiga-de-las-demos", "benchmark-agentes-redaccion", "mini-reactores-datos", "seguridad-modelos"];

export default async function Home() {
  const allArticles = await getAllArticles();
  const articleMap = new Map<string, Article>(allArticles.map((article) => [article.id, article]));
  const hero = articleMap.get("infraestructura-europea-ia");
  const nowStory = articleMap.get("chip-fotonico-revoluciona-ia");
  const sideArticles = sideStories
    .map((story) => {
      const article = articleMap.get(story.id);
      return article ? { ...story, article } : null;
    })
    .filter((story): story is NonNullable<typeof story> => story !== null);
  const mostReadArticles = mostRead
    .map((item) => {
      const article = articleMap.get(item.id);
      return article ? { ...item, article } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const analysisCards = bottomCards
    .map((item) => {
      const article = articleMap.get(item);
      return article ? { id: item, article } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const [radarSignals, editorialSummary] = await Promise.all([getRadarSignals(3), getEditorialSummary()]);

  if (!hero || !nowStory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <div className="mx-auto max-w-[1054px] bg-[#071018] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:border-x sm:border-[#202830]">
        <div className="hidden min-h-6 items-center justify-between border-b border-[#1b242d] px-8 text-[10px] text-[#b8c0c7] md:flex">
          <p>Desde 2012 informando sobre ciencia, tecnologia e innovacion</p>
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
                    Inteligencia Artificial
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
              {sideArticles.map((story) => (
                <Link
                  key={story.id}
                  href={`/articulo/${story.id}`}
                  className="flex gap-3 border-b border-[#1b242d] pb-3 transition hover:bg-white/[0.02] last:border-b-0"
                >
                  <ArticleVisual
                    article={story.article}
                    className="aspect-[6/5] w-[92px] shrink-0"
                    sizes="92px"
                  />
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#b5ff2a]">{story.category}</p>
                    <h3 className="text-[13px] leading-5 text-[#f0f4f7]">{story.article.title}</h3>
                    <p className="text-[10px] text-[#778491]">{story.article.publishedAt}</p>
                  </div>
                </Link>
              ))}
            </div>

            <aside className="bg-[#0b131c] px-5 py-6 sm:px-7">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold uppercase tracking-[0.04em] text-[#eef3f7] sm:text-[24px]">
                  Lo mas leido
                </h3>
                <Link href="/archivo" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                  Ver mas
                </Link>
              </div>
              <div className="mt-4 h-px w-8 bg-[#b5ff2a]" />
              <ol className="mt-6 space-y-5">
                {mostReadArticles.map((item, index) => (
                  <li key={item.id} className="grid grid-cols-[18px_1fr] gap-4">
                    <span className="text-[28px] leading-none text-[#b5ff2a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <Link
                        href={`/articulo/${item.id}`}
                        className="block text-[13px] leading-6 text-[#edf1f4] hover:text-white"
                      >
                        {item.article.title}
                      </Link>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-[#72808c]">{item.article.publishedAt}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </section>

          <section className="mt-4 grid gap-px bg-[#1b242d] sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <Link
                key={metric.value}
                href={metric.href}
                className="bg-[#0a131b] px-5 py-4 transition hover:bg-[#0d1620] sm:px-6 xl:px-8"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-lg text-[#f0f3f6]">+</div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[#a0acb7]">{metric.detail}</p>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <section className="mt-5 border border-[#1b242d] bg-[#08111a] p-4 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[#1b242d] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
                  Automatizacion editorial
                </p>
                <h3 className="text-[24px] font-semibold uppercase tracking-[0.04em] text-[#f3f6f8] sm:text-[30px]">
                  No perseguimos titulares. Interpretamos senales.
                </h3>
                <p className="max-w-3xl text-[13px] leading-6 text-[#b8c1c9]">
                  Synaptik ya prepara una capa de ingesta modular para detectar fuentes fiables,
                  clasificar riesgo editorial y convertir senales en borradores revisables antes de
                  publicar.
                </p>
              </div>
              <div className="grid gap-px bg-[#1b242d] sm:grid-cols-3">
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Fuentes</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.sourceCount}</p>
                </div>
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Senales</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.signalCount}</p>
                </div>
                <div className="bg-[#0b131c] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Revision</p>
                  <p className="mt-2 text-[20px] font-semibold text-white">{editorialSummary.reviewCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#7d8b96]">
                      Radar Synaptik
                    </p>
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
                  Analisis riguroso, contexto claro y lectura accesible
                </h4>
                <p className="mt-4 text-[13px] leading-6 text-[#b8c1c9]">
                  En Synaptik revisamos cada senal con criterio editorial, contrastamos fuentes y
                  ordenamos el contexto antes de publicar. La ambicion no es complicar la
                  informacion, sino hacerla precisa, didactica y util para cualquier lector, tenga
                  o no una base tecnica previa.
                </p>
                <div className="mt-6 space-y-3 border-t border-[#1b242d] pt-5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                      <span>Radar Synaptik</span>
                      <span className="text-[#8b98a3]">Señales clave del momento</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                    <span>Analisis Synaptik</span>
                    <span className="text-[#8b98a3]">Contexto, contraste y criterio</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[#d7dde2]">
                    <span>Opinion</span>
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
                    Analisis y opinion
                  </h3>
                </div>
                <Link href="/categoria/opinion" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                  Abrir seccion
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {analysisCards.map((card, index) => (
                  <Link
                    key={card.id}
                    href={`/articulo/${card.id}`}
                    className={index === 3 ? "md:col-span-2 xl:col-span-1" : ""}
                  >
                    <div className="relative h-[160px] overflow-hidden bg-[#0a141d]">
                      <ArticleVisual
                        article={card.article}
                        className="aspect-[4/3] h-full w-full"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,12,0.05)_0%,rgba(3,7,12,0.84)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                          {card.article.tag}
                        </p>
                        <h4 className="mt-2 text-[13px] leading-5 text-white">{card.article.title}</h4>
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
                El boletin editorial abrira con la primera version publica. Hasta entonces puedes
                revisar el archivo o solicitar acceso anticipado.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/newsletter"
                  className="bg-[#b5ff2a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#11170f]"
                >
                  Ver estado del boletin
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
                  Especial energia e IA
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
