import Link from "next/link";
import { DraftArticle } from "@/types/editorial";

type DraftGridProps = {
  drafts: DraftArticle[];
};

function formatDraftDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

export function DraftGrid({ drafts }: DraftGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {drafts.map((draft) => (
        <article key={draft.id} className="flex h-full flex-col border border-[#1b242d] bg-[#0b131c] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
              {draft.tipo === "analysis" ? "Analisis Synaptik" : "Radar Synaptik"}
            </span>
            <span className="text-[10px] uppercase tracking-[0.08em] text-[#6f7e8b]">
              {formatDraftDate(draft.fechaCreacion)}
            </span>
          </div>
          <h3 className="mt-3 text-[15px] leading-6 text-[#eff3f6]">{draft.titulo}</h3>
          <p className="mt-2 text-[12px] leading-6 text-[#b6c0c8]">{draft.entradilla}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.08em] text-[#83919d]">
            <span>{draft.categoria}</span>
            <span>{draft.estado}</span>
            <span>{draft.riesgoEditorial}</span>
          </div>
          <div className="mt-auto border-t border-[#1b242d] pt-4">
            <p className="text-[11px] leading-5 text-[#c6cfd6]">Fuente: {draft.fuente.nombre}</p>
            <Link href="/admin/drafts" className="mt-3 inline-block text-[10px] uppercase tracking-[0.08em] text-[#b5ff2a]">
              Revisar cola editorial
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
