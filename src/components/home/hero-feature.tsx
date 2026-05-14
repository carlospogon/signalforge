import Link from "next/link";
import { featuredArticle } from "@/data/articles";

export function HeroFeature() {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-panel shadow-glow">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-transparent to-blue-500/10" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl transition duration-500 group-hover:scale-110" />

      <div className="relative grid gap-10 p-6 sm:p-8 xl:grid-cols-[1.25fr_0.9fr]">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                {featuredArticle.tag}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {featuredArticle.category}
              </span>
            </div>

            <div className="space-y-4">
              <p className="max-w-xl text-sm uppercase tracking-[0.35em] text-slate-400">
                Cobertura principal
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                <Link href={`/articulo/${featuredArticle.id}`} className="transition hover:text-cyan-100">
                  {featuredArticle.title}
                </Link>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {featuredArticle.excerpt}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 text-sm text-slate-300">
            <span>{featuredArticle.author}</span>
            <span className="text-slate-600">|</span>
            <span>{featuredArticle.readingTime}</span>
            <span className="text-slate-600">|</span>
            <span>{featuredArticle.publishedAt}</span>
            <Link
              href={`/articulo/${featuredArticle.id}`}
              className="ml-auto rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Leer analisis
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,242,255,0.28),transparent_0_28%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.3),transparent_0_22%),linear-gradient(135deg,#081120_0%,#0e1e38_45%,#050816_100%)]" />
          <div className="absolute inset-0 bg-radial-grid bg-grid opacity-60" />
          <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-100">
            Senal clave
          </div>
          <div className="absolute bottom-6 left-6 right-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {["Compute", "Energia", "Escala"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-medium text-white">Vector critico</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-50">
              La infraestructura se ha convertido en el nuevo lenguaje de poder para la IA aplicada.
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
