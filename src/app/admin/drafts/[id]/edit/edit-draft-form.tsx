"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveDraftEditAction } from "@/app/admin/drafts/[id]/edit/actions";
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

  return (
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
            defaultValue={draft.titulo}
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
            defaultValue={draft.subtitulo}
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
            defaultValue={draft.entradilla}
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
            defaultValue={draft.cuerpo.join("\n\n")}
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
            defaultValue={draft.fuente.imagenUrl ?? ""}
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
            defaultValue={draft.fuente.imagenAlt ?? ""}
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
  );
}
