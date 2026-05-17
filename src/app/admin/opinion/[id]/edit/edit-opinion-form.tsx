"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArticleVisual } from "@/components/articles/article-visual";
import { saveOpinionEditAction } from "@/app/admin/opinion/[id]/edit/actions";
import { Article } from "@/types/article";
import { DraftArticle } from "@/types/editorial";

type EditOpinionFormProps = {
  draft: DraftArticle;
};

const initialState = {
  error: ""
};

export function EditOpinionForm({ draft }: EditOpinionFormProps) {
  const [state, formAction, pending] = useActionState(saveOpinionEditAction, initialState);
  const isPublished = draft.estado === "published";
  const [titulo, setTitulo] = useState(draft.titulo);
  const [subtitulo, setSubtitulo] = useState(draft.subtitulo);
  const [entradilla, setEntradilla] = useState(draft.entradilla);
  const [cuerpo, setCuerpo] = useState(draft.cuerpo.join("\n\n"));
  const [etiquetas, setEtiquetas] = useState(draft.etiquetas.join(", "));
  const [autor, setAutor] = useState(draft.autor);
  const [tiempoLectura, setTiempoLectura] = useState(draft.tiempoLectura);
  const [imagenUrl, setImagenUrl] = useState(draft.fuente.imagenUrl ?? "");
  const [imagenAlt, setImagenAlt] = useState(draft.fuente.imagenAlt ?? "");
  const previewUsesPageUrl = Boolean(imagenUrl.trim()) && !/^https?:\/\/.+\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(imagenUrl.trim());
  const previewArticle: Article = {
    id: draft.slug,
    title: titulo.trim() || draft.titulo,
    excerpt: entradilla.trim() || draft.entradilla,
    category: "opinion",
    author: autor.trim() || draft.autor,
    readingTime: tiempoLectura.trim() || draft.tiempoLectura,
    publishedAt: draft.fechaPublicacionOriginal.slice(0, 10),
    accent: "from-[#1f1a0c] via-[#6f5b19] to-[#ffe17a]",
    tag: "Opinión",
    deck: subtitulo.trim() || draft.subtitulo,
    body: cuerpo
      .split(/\r?\n\r?\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    visual:
      imagenUrl.trim() && !previewUsesPageUrl
        ? {
            mode: "asset",
            src: imagenUrl.trim(),
            alt: imagenAlt.trim() || titulo.trim() || draft.titulo
          }
        : undefined
  };

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="draftId" value={draft.id} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="titulo" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Título
            </label>
            <input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="subtitulo" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Subtítulo
            </label>
            <textarea
              id="subtitulo"
              name="subtitulo"
              value={subtitulo}
              onChange={(event) => setSubtitulo(event.target.value)}
              rows={3}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] leading-6 text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="entradilla" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Entradilla
            </label>
            <textarea
              id="entradilla"
              name="entradilla"
              value={entradilla}
              onChange={(event) => setEntradilla(event.target.value)}
              rows={4}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] leading-6 text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="cuerpo" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Cuerpo
            </label>
            <textarea
              id="cuerpo"
              name="cuerpo"
              value={cuerpo}
              onChange={(event) => setCuerpo(event.target.value)}
              rows={18}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] leading-7 text-white outline-none transition focus:border-[#ffe17a]"
            />
            <p className="text-[12px] text-[#b8aa78]">Separa los párrafos con una línea en blanco.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="autor" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Autor
            </label>
            <input
              id="autor"
              name="autor"
              value={autor}
              onChange={(event) => setAutor(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tiempoLectura" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Tiempo de lectura
            </label>
            <input
              id="tiempoLectura"
              name="tiempoLectura"
              value={tiempoLectura}
              onChange={(event) => setTiempoLectura(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="etiquetas" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Etiquetas
            </label>
            <input
              id="etiquetas"
              name="etiquetas"
              value={etiquetas}
              onChange={(event) => setEtiquetas(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
            <p className="text-[12px] text-[#b8aa78]">Sepáralas con comas.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenUrl" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Imagen URL
            </label>
            <input
              id="imagenUrl"
              name="imagenUrl"
              value={imagenUrl}
              onChange={(event) => setImagenUrl(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
            <p className="text-[12px] text-[#b8aa78]">
              Puedes pegar una URL directa o una página como Pexels. Intentaremos resolver la imagen principal al guardar.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenAlt" className="text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
              Imagen Alt
            </label>
            <input
              id="imagenAlt"
              name="imagenAlt"
              value={imagenAlt}
              onChange={(event) => setImagenAlt(event.target.value)}
              className="w-full border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#ffe17a]"
            />
          </div>
        </div>

        {state.error ? (
          <p className="border border-[#4a2929] bg-[#261313] px-4 py-3 text-[13px] text-[#ffb8b8]">{state.error}</p>
        ) : null}

        {previewUsesPageUrl ? (
          <p className="border border-[#4a3f1d] bg-[#261f10] px-4 py-3 text-[13px] text-[#f2db84]">
            La URL actual parece una página web. La vista previa local puede no mostrarla, pero al guardar intentaremos extraer su imagen principal automáticamente.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#ffe17a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#17130a] transition hover:bg-[#ffeb9f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Guardando..." : isPublished ? "Guardar y actualizar publicación" : "Guardar columna"}
          </button>
          <Link
            href="/admin/opinion"
            className="border border-[#3a3222] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#ffe17a] hover:text-[#ffe17a]"
          >
            Volver
          </Link>
        </div>
      </form>

      <section className="border border-[#2f2612] bg-[#161518]">
        <div className="border-b border-[#2f2612] px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#ffe17a]">Previsualización base</p>
          <p className="mt-2 text-[13px] text-[#d3cab0]">
            Vista de trabajo provisional. El layout premium de opinión irá en el siguiente bloque.
          </p>
        </div>

        <article className="overflow-hidden">
          <ArticleVisual
            article={previewArticle}
            className="aspect-[16/9] w-full"
            sizes="(max-width: 1024px) 100vw, 960px"
            priority={false}
          />
          <div className="space-y-6 p-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#b8aa78]">
                <span className="border border-[#3a3222] bg-[#1b1911] px-3 py-1 text-[#ffe17a]">Opinión</span>
                <span>{previewArticle.tag}</span>
              </div>
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {previewArticle.title}
              </h2>
              <p className="text-lg leading-8 text-[#dfd8c3]">{previewArticle.deck ?? previewArticle.excerpt}</p>
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-sm text-[#b8aa78]">
                <span>{previewArticle.author}</span>
                <span>{previewArticle.publishedAt}</span>
                <span>{previewArticle.readingTime}</span>
              </div>
            </div>

            <div className="space-y-5 text-[15px] leading-8 text-[#f2ede0]">
              {previewArticle.body.length > 0 ? (
                previewArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p className="text-[#b8aa78]">Añade contenido en el cuerpo para ver la previsualización de la columna.</p>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
