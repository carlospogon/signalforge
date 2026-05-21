"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitBulkPublishAction, type BulkDraftActionState } from "@/app/admin/drafts/actions";
import { RemoteArticleImage } from "@/components/articles/remote-article-image";
import { DraftActionForm } from "@/components/editorial/draft-action-form";
import { DraftArticle } from "@/types/editorial";

type DraftQueueProps = {
  drafts: DraftArticle[];
  title?: string;
  eyebrow?: string;
  showBulkPublish?: boolean;
  editBasePath?: string;
};

const initialBulkState: BulkDraftActionState = {};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatMovementLabel(value?: string) {
  if (!value) {
    return "Movimiento";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
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

function DraftPreviewImage({
  src,
  alt,
  className,
  imageClassName
}: {
  src: string;
  alt: string;
  className: string;
  imageClassName: string;
}) {
  const fallback = <div className={`rounded border border-[#1b242d] bg-[#101821] ${className}`} />;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <RemoteArticleImage
        src={src}
        alt={alt}
        className={className}
        imageClassName={imageClassName}
        fallback={fallback}
      />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`${className} ${imageClassName}`} />
    </>
  );
}

export function DraftQueue({
  drafts,
  title = "Cola editorial",
  eyebrow = "Interno",
  showBulkPublish = true,
  editBasePath = "/admin/drafts"
}: DraftQueueProps) {
  const router = useRouter();
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [bulkState, bulkFormAction, bulkPending] = useActionState(submitBulkPublishAction, initialBulkState);
  const selectableDraftIds = useMemo(
    () => drafts.filter((draft) => draft.estado !== "published").map((draft) => draft.id),
    [drafts]
  );
  const effectiveSelectedDraftIds = useMemo(
    () => selectedDraftIds.filter((draftId) => selectableDraftIds.includes(draftId)),
    [selectableDraftIds, selectedDraftIds]
  );
  const allSelectableChecked =
    selectableDraftIds.length > 0 && selectableDraftIds.every((draftId) => effectiveSelectedDraftIds.includes(draftId));
  const desktopGridClassName = showBulkPublish
    ? "hidden grid-cols-[0.34fr_2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr] gap-4 border-b border-[#1b242d] px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-[#72808b] xl:grid"
    : "hidden grid-cols-[2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr] gap-4 border-b border-[#1b242d] px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-[#72808b] xl:grid";
  const desktopRowClassName = showBulkPublish
    ? "hidden gap-4 xl:grid xl:grid-cols-[0.34fr_2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr]"
    : "hidden gap-4 xl:grid xl:grid-cols-[2fr_0.95fr_0.8fr_0.75fr_0.9fr_1.2fr]";

  useEffect(() => {
    if (bulkState.success) {
      router.refresh();
    }
  }, [bulkState.success, router]);

  function toggleDraftSelection(draftId: string, checked: boolean) {
    setSelectedDraftIds((current) => {
      if (checked) {
        return current.includes(draftId) ? current : [...current, draftId];
      }

      return current.filter((value) => value !== draftId);
    });
  }

  function toggleVisibleSelection(checked: boolean) {
    setSelectedDraftIds(checked ? selectableDraftIds : []);
  }

  return (
    <div className="overflow-hidden border border-[#1b242d] bg-[#08111a]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b242d] px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#b5ff2a]">{eyebrow}</p>
          <h2 className="mt-2 text-[24px] font-semibold uppercase tracking-[0.04em] text-[#eff3f6]">
            {title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link href="/rss.xml" className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
            RSS propio
          </Link>

          {showBulkPublish ? (
            <form action={bulkFormAction} className="flex flex-wrap items-center justify-end gap-3">
              {effectiveSelectedDraftIds.map((draftId) => (
                <input key={draftId} type="hidden" name="draftIds" value={draftId} />
              ))}
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[#8f9ca7]">
                <input
                  type="checkbox"
                  checked={allSelectableChecked}
                  onChange={(event) => toggleVisibleSelection(event.target.checked)}
                  disabled={selectableDraftIds.length === 0}
                  className="h-4 w-4 border border-[#32404b] bg-[#0b131c] accent-[#b5ff2a]"
                />
                Seleccionar visibles
              </label>
              <span className="text-[11px] text-[#8f9ca7]">
                {effectiveSelectedDraftIds.length} seleccionado{effectiveSelectedDraftIds.length === 1 ? "" : "s"}
              </span>
              <button
                type="submit"
                disabled={bulkPending || effectiveSelectedDraftIds.length === 0}
                className="bg-[#b5ff2a] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#10170d] transition hover:bg-[#c6ff58] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bulkPending ? "Publicando..." : "Publicar seleccionados"}
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {showBulkPublish && bulkState.error ? (
        <div className="border-b border-[#1b242d] px-5 py-3 text-[12px] text-[#ff8e8e]">{bulkState.error}</div>
      ) : null}
      {showBulkPublish && bulkState.success ? (
        <div className="border-b border-[#1b242d] px-5 py-3 text-[12px] text-[#7ee081]">
          Se publicaron {bulkState.publishedCount ?? 0} borradores seleccionados.
        </div>
      ) : null}

      <div className={desktopGridClassName}>
        {showBulkPublish ? <span>Sel.</span> : null}
        <span>Borrador</span>
        <span>Fuente</span>
        <span>Categoría</span>
        <span>Estado</span>
        <span>Riesgo</span>
        <span>Acciones</span>
      </div>

      <div className="divide-y divide-[#1b242d]">
        {drafts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[16px] text-[#d7dde2]">No hay artículos que coincidan con la búsqueda actual.</p>
            <p className="mt-2 text-[13px] text-[#7f8d98]">
              Prueba con parte del título, la fuente, el slug, el autor o el estado del borrador.
            </p>
          </div>
        ) : null}
        {drafts.map((draft) => {
          const isSelectable = draft.estado !== "published";
          const isSelected = effectiveSelectedDraftIds.includes(draft.id);
          const brief = draft.fuente.briefEditorial;

          return (
            <article key={draft.id} className="px-5 py-5">
              <div className={desktopRowClassName}>
                {showBulkPublish ? (
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(event) => toggleDraftSelection(draft.id, event.target.checked)}
                      disabled={!isSelectable}
                      aria-label={`Seleccionar ${draft.titulo}`}
                      className="h-4 w-4 border border-[#32404b] bg-[#0b131c] accent-[#b5ff2a] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                ) : null}

                <div>
                  <p className="text-[15px] leading-6 text-[#edf2f5]">{draft.titulo}</p>
                  {draft.fuente.tituloOriginal ? (
                    <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#8eb8ff]">
                      Fuente original: {draft.fuente.tituloOriginal}
                    </p>
                  ) : null}
                  {draft.fuente.resumenOriginal ? (
                    <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#7f8d98]">
                      Origen: {draft.fuente.resumenOriginal}
                    </p>
                  ) : null}
                  {brief ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                          {formatMovementLabel(brief.movementType)}
                        </p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.keyPoint}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Por que importa</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.whyItMatters}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Foco editorial</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.editorialFocus}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Siguientes senales</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.nextSignals}</p>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.08em] text-[#72808b]">
                    <span>{draft.tipo}</span>
                    <span>{draft.prioridadPublicacion}</span>
                    <span>{formatDate(draft.fechaCreacion)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-[12px] text-[#c5ced5]">
                  {draft.fuente.imagenUrl ? (
                    <DraftPreviewImage
                      src={draft.fuente.imagenUrl}
                      alt={draft.fuente.imagenAlt ?? draft.titulo}
                      className="h-16 w-full"
                      imageClassName="rounded border border-[#1b242d] object-cover"
                    />
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
                  <Link href={`${editBasePath}/${draft.id}/edit`} className={actionButtonClassName}>
                    Editar
                  </Link>
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
                    <div className="flex items-start gap-3">
                      {showBulkPublish ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(event) => toggleDraftSelection(draft.id, event.target.checked)}
                          disabled={!isSelectable}
                          aria-label={`Seleccionar ${draft.titulo}`}
                          className="mt-1 h-4 w-4 border border-[#32404b] bg-[#0b131c] accent-[#b5ff2a] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      ) : null}
                      <h3 className="text-[15px] leading-6 text-[#edf2f5]">{draft.titulo}</h3>
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.08em] ${riskTone[draft.riesgoEditorial]}`}>
                      {draft.riesgoEditorial}
                    </span>
                  </div>
                  <p className="text-[12px] leading-6 text-[#c4d0d8]">{draft.subtitulo}</p>
                  {draft.fuente.tituloOriginal ? (
                    <p className="text-[12px] leading-6 text-[#8eb8ff]">Fuente original: {draft.fuente.tituloOriginal}</p>
                  ) : null}
                  {draft.fuente.resumenOriginal ? (
                    <p className="text-[12px] leading-6 text-[#7f8d98]">Origen: {draft.fuente.resumenOriginal}</p>
                  ) : null}
                  {brief ? (
                    <div className="grid gap-3">
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
                          {formatMovementLabel(brief.movementType)}
                        </p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.keyPoint}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Por que importa</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.whyItMatters}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Foco editorial</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.editorialFocus}</p>
                      </div>
                      <div className="border border-[#182029] bg-[#0b131c] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">Siguientes senales</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#d6dde3]">{brief.nextSignals}</p>
                      </div>
                    </div>
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
                    <DraftPreviewImage
                      src={draft.fuente.imagenUrl}
                      alt={draft.fuente.imagenAlt ?? draft.titulo}
                      className="h-10 w-14"
                      imageClassName="rounded border border-[#1b242d] object-cover"
                    />
                  ) : null}
                  <Link href={`${editBasePath}/${draft.id}/edit`} className={actionButtonClassName}>
                    Editar
                  </Link>
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
          );
        })}
      </div>
    </div>
  );
}
