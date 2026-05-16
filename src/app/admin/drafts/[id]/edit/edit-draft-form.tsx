"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArticleVisual } from "@/components/articles/article-visual";
import { saveDraftEditAction } from "@/app/admin/drafts/[id]/edit/actions";
import { categories } from "@/data/categories";
import { Article } from "@/types/article";
import { DraftArticle } from "@/types/editorial";

type EditDraftFormProps = {
  draft: DraftArticle;
};

const initialState = {
  error: ""
};

export function EditDraftForm({ draft }: EditDraftFormProps) {
  const [state, formAction, pending] = useActionState(saveDraftEditAction, initialState);
  const isPublished = draft.estado === "published";
  const [titulo, setTitulo] = useState(draft.titulo);
  const [subtitulo, setSubtitulo] = useState(draft.subtitulo);
  const [entradilla, setEntradilla] = useState(draft.entradilla);
  const [cuerpo, setCuerpo] = useState(draft.cuerpo.join("\n\n"));
  const [imagenUrl, setImagenUrl] = useState(draft.fuente.imagenUrl ?? "");
  const [imagenAlt, setImagenAlt] = useState(draft.fuente.imagenAlt ?? "");
  const categoryLabel = categories.find((category) => category.slug === draft.categoria)?.label ?? draft.categoria;
  const previewArticle: Article = {
    id: draft.slug,
    title: titulo.trim() || draft.titulo,
    excerpt: entradilla.trim() || draft.entradilla,
    category: draft.categoria,
    author: draft.autor,
    readingTime: draft.tiempoLectura,
    publishedAt: draft.fechaPublicacionOriginal.slice(0, 10),
    accent:
      draft.categoria === "ia"
        ? "from-[#0b2f35] via-[#0f5e63] to-[#9be3ef]"
        : draft.categoria === "ciencia"
          ? "from-[#1a224d] via-[#3148b7] to-[#8cc0ff]"
          : draft.categoria === "tecnologia"
            ? "from-[#10211b] via-[#236b4c] to-[#89f0ad]"
            : draft.categoria === "espacio"
              ? "from-[#120d27] via-[#342a79] to-[#9bb8ff]"
              : draft.categoria === "salud"
                ? "from-[#29151a] via-[#7e3245] to-[#ffb4c0]"
                : draft.categoria === "biotech"
                  ? "from-[#182328] via-[#2d6c78] to-[#98ecea]"
                  : draft.categoria === "ciberseguridad"
                    ? "from-[#1f1510] via-[#7a4b1f] to-[#ffb77a]"
                    : draft.categoria === "laboratorio"
                      ? "from-[#111f29] via-[#2a6b7d] to-[#90e8ff]"
                      : "from-[#1f1a0c] via-[#6f5b19] to-[#ffe17a]",
    tag: draft.tipo === "analysis" ? "Análisis" : draft.tipo === "opinion" ? "Opinión" : "Radar",
    deck: subtitulo.trim() || draft.subtitulo,
    body: cuerpo
      .split(/\r?\n\r?\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    visual: imagenUrl.trim()
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
            <label htmlFor="titulo" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Titulo
            </label>
            <input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#b5ff2a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="subtitulo" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Subtitulo
            </label>
            <textarea
              id="subtitulo"
              name="subtitulo"
              value={subtitulo}
              onChange={(event) => setSubtitulo(event.target.value)}
              rows={3}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] leading-6 text-white outline-none transition focus:border-[#b5ff2a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="entradilla" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Entradilla
            </label>
            <textarea
              id="entradilla"
              name="entradilla"
              value={entradilla}
              onChange={(event) => setEntradilla(event.target.value)}
              rows={4}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] leading-6 text-white outline-none transition focus:border-[#b5ff2a]"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="cuerpo" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Cuerpo
            </label>
            <textarea
              id="cuerpo"
              name="cuerpo"
              value={cuerpo}
              onChange={(event) => setCuerpo(event.target.value)}
              rows={16}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] leading-7 text-white outline-none transition focus:border-[#b5ff2a]"
            />
            <p className="text-[12px] text-[#7f8d98]">Separa los parrafos con una linea en blanco.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenUrl" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Imagen URL
            </label>
            <input
              id="imagenUrl"
              name="imagenUrl"
              value={imagenUrl}
              onChange={(event) => setImagenUrl(event.target.value)}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#b5ff2a]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenAlt" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
              Imagen Alt
            </label>
            <input
              id="imagenAlt"
              name="imagenAlt"
              value={imagenAlt}
              onChange={(event) => setImagenAlt(event.target.value)}
              className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#b5ff2a]"
            />
          </div>
        </div>

        {state.error ? (
          <p className="border border-[#402126] bg-[#221015] px-4 py-3 text-[13px] text-[#ffb8b8]">{state.error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#b5ff2a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#11170f] transition hover:bg-[#c6ff57] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Guardando..." : isPublished ? "Guardar y actualizar publicacion" : "Guardar borrador"}
          </button>
          <Link
            href="/admin/drafts"
            className="border border-[#29333d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#b5ff2a] hover:text-[#b5ff2a]"
          >
            Volver
          </Link>
        </div>
      </form>

      <section className="border border-[#1b242d] bg-[#0b131c]">
        <div className="border-b border-[#1b242d] px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#b5ff2a]">Previsualizacion</p>
          <p className="mt-2 text-[13px] text-[#9fadb8]">Vista aproximada de como quedaria la pieza en el sitio.</p>
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
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#8d9aa6]">
                <span className="border border-[#2a333d] bg-[#0d1620] px-3 py-1 text-[#b5ff2a]">{categoryLabel}</span>
                <span>{previewArticle.tag}</span>
              </div>
              <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {previewArticle.title}
              </h2>
              <p className="text-lg leading-8 text-[#c7d0d7]">{previewArticle.deck ?? previewArticle.excerpt}</p>
              <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-sm text-[#8d9aa6]">
                <span>{previewArticle.author}</span>
                <span>{previewArticle.publishedAt}</span>
                <span>{previewArticle.readingTime}</span>
              </div>
            </div>

            <div className="space-y-5 text-[15px] leading-8 text-[#e2e7eb]">
              {previewArticle.body.length > 0 ? (
                previewArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p className="text-[#8d9aa6]">Añade contenido en el cuerpo para ver la previsualización del artículo.</p>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
