import Link from "next/link";
import { DraftActionForm } from "@/components/editorial/draft-action-form";
import { DraftArticle } from "@/types/editorial";

type DraftQueueProps = {
  drafts: DraftArticle[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

const riskTone = {
  bajo: "text-[#7ee081]",
  medio: "text-[#ffd76c]",
  alto: "text-[#ff8e8e]"
} as const;

const stateTone = {
  imported: "text-[#8ea0ae]",
  draft: "text-[#9fd1ff]",
  needs_review: "text-[#ffd76c]",
  approved: "text-[#7ee081]",
  published: "text-[#b5ff2a]",
  rejected: "text-[#ff8e8e]"
} as const;

const stateLabel = {
  imported: "Importado",
  draft: "Borrador",
  needs_review: "Revisión",
  approved: "Aprobado",
  published: "Publicado",
  rejected: "Rechazado"
} as const;

const actionButtonClassName =
  "border border-[#2a333d] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:border-[#b5ff2a] hover:text-[#b5ff2a]";

export function DraftQueue({ drafts }: DraftQueueProps) {
  return (
    <div className="overflow-hidden border border-[#1b242d] bg-[#08111a]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b242d] px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#b5ff2a]">Interno</p>
          <h2 className="mt-2 text-[24px] font-semibold uppercase tracking-[0.04em] text-[#eff3f6]">
            Cola editorial
          </h2>
        </div>
        <Link href="/rss.xml" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
          RSS propio
        </Link>
      </div>

      <div className="hidden grid-cols-[2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr] gap-4 border-b border-[#1b242d] px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-[#72808b] xl:grid">
        <span>Borrador</span>
        <span>Fuente</span>
        <span>Categoría</span>
        <span>Estado</span>
        <span>Riesgo</span>
        <span>Acciones</span>
      </div>

      <div className="divide-y divide-[#1b242d]">
        {drafts.map((draft) => (
          <article key={draft.id} className="px-5 py-5">
            <div className="hidden gap-4 xl:grid xl:grid-cols-[2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr]">
              <div>
                <p className="text-[15px] leading-6 text-[#edf2f5]">{draft.titulo}</p>
                <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#c4d0d8]">{draft.subtitulo}</p>
                <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#9eabb5]">{draft.entradilla}</p>
                {draft.fuente.resumenOriginal ? (
                  <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#7f8d98]">
                    Origen: {draft.fuente.resumenOriginal}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.08em] text-[#72808b]">
                  <span>{draft.tipo}</span>
                  <span>{draft.prioridadPublicacion}</span>
                  <span>{formatDate(draft.fechaCreacion)}</span>
                </div>
              </div>

              <div className="space-y-2 text-[12px] text-[#c5ced5]">
                {draft.fuente.imagenUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.fuente.imagenUrl}
                      alt={draft.fuente.imagenAlt ?? draft.titulo}
                      className="h-16 w-full rounded border border-[#1b242d] object-cover"
                    />
                  </>
                ) : null}
                <p>{draft.fuente.nombre}</p>
                <Link href={draft.fuente.urlOriginal} target="_blank" className="text-[#8eb8ff] hover:text-white">
                  Abrir original
                </Link>
              </div>

              <p className="text-[12px] uppercase tracking-[0.06em] text-[#c5ced5]">{draft.categoria}</p>
              <p className={`text-[12px] uppercase tracking-[0.06em] ${stateTone[draft.estado]}`}>
                {stateLabel[draft.estado]}
              </p>
              <p className={`text-[12px] uppercase tracking-[0.06em] ${riskTone[draft.riesgoEditorial]}`}>
                {draft.riesgoEditorial}
              </p>

              <div className="flex flex-wrap gap-2">
                {draft.estado !== "published" ? (
                  <Link
                    href={`/admin/drafts/${draft.id}/edit`}
                    className={actionButtonClassName}
                  >
                    Editar
                  </Link>
                ) : null}
                {draft.estado !== "published" ? (
                  <DraftActionForm
                    draftId={draft.id}
                    intent="regenerate"
                    label="Regenerar"
                    className={actionButtonClassName}
                  />
                ) : null}
                <DraftActionForm
                  draftId={draft.id}
                  intent="needs_review"
                  label="Revisión"
                  className={actionButtonClassName}
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="approved"
                  label="Aprobar"
                  className={actionButtonClassName}
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="publish"
                  label="Publicar"
                  className="bg-[#b5ff2a] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#10170d] transition hover:bg-[#c6ff58] disabled:cursor-not-allowed disabled:opacity-70"
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="rejected"
                  label="Rechazar"
                  className={actionButtonClassName}
                />
              </div>
            </div>

            <div className="space-y-4 xl:hidden">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[15px] leading-6 text-[#edf2f5]">{draft.titulo}</h3>
                  <span className={`text-[10px] uppercase tracking-[0.08em] ${riskTone[draft.riesgoEditorial]}`}>
                    {draft.riesgoEditorial}
                  </span>
                </div>
                <p className="text-[12px] leading-6 text-[#c4d0d8]">{draft.subtitulo}</p>
                <p className="text-[12px] leading-6 text-[#a4afb8]">{draft.entradilla}</p>
                {draft.fuente.resumenOriginal ? (
                  <p className="text-[12px] leading-6 text-[#7f8d98]">Origen: {draft.fuente.resumenOriginal}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.08em] text-[#8e99a3]">
                <span>{draft.fuente.nombre}</span>
                <span>{draft.categoria}</span>
                <span className={stateTone[draft.estado]}>{stateLabel[draft.estado]}</span>
                <span>{formatDate(draft.fechaCreacion)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={draft.fuente.urlOriginal}
                  target="_blank"
                  className="border border-[#2a333d] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[#8eb8ff]"
                >
                  Fuente
                </Link>
                {draft.fuente.imagenUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.fuente.imagenUrl}
                      alt={draft.fuente.imagenAlt ?? draft.titulo}
                      className="h-10 w-14 rounded border border-[#1b242d] object-cover"
                    />
                  </>
                ) : null}
                {draft.estado !== "published" ? (
                  <Link
                    href={`/admin/drafts/${draft.id}/edit`}
                    className={actionButtonClassName}
                  >
                    Editar
                  </Link>
                ) : null}
                {draft.estado !== "published" ? (
                  <DraftActionForm
                    draftId={draft.id}
                    intent="regenerate"
                    label="Regenerar"
                    className={actionButtonClassName}
                  />
                ) : null}
                <DraftActionForm
                  draftId={draft.id}
                  intent="needs_review"
                  label="Revisión"
                  className={actionButtonClassName}
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="approved"
                  label="Aprobar"
                  className={actionButtonClassName}
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="publish"
                  label="Publicar"
                  className="bg-[#b5ff2a] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#10170d] disabled:cursor-not-allowed disabled:opacity-70"
                />
                <DraftActionForm
                  draftId={draft.id}
                  intent="rejected"
                  label="Rechazar"
                  className={actionButtonClassName}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
