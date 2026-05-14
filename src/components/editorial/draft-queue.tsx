import Link from "next/link";
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

      <div className="hidden grid-cols-[2.1fr_1fr_0.9fr_0.8fr_0.95fr_1fr] gap-4 border-b border-[#1b242d] px-5 py-3 text-[10px] uppercase tracking-[0.1em] text-[#72808b] md:grid">
        <span>Titulo</span>
        <span>Fuente</span>
        <span>Categoria</span>
        <span>Estado</span>
        <span>Riesgo</span>
        <span>Fecha</span>
      </div>

      <div className="divide-y divide-[#1b242d]">
        {drafts.map((draft) => (
          <article key={draft.id} className="px-5 py-4">
            <div className="hidden items-center gap-4 md:grid md:grid-cols-[2.1fr_1fr_0.9fr_0.8fr_0.95fr_1fr]">
              <div>
                <p className="text-[14px] leading-6 text-[#edf2f5]">{draft.titulo}</p>
                <p className="mt-1 text-[11px] text-[#8f9aa4]">{draft.accionSugerida}</p>
              </div>
              <p className="text-[12px] text-[#c5ced5]">{draft.fuente.nombre}</p>
              <p className="text-[12px] uppercase tracking-[0.06em] text-[#c5ced5]">{draft.categoria}</p>
              <p className="text-[12px] uppercase tracking-[0.06em] text-[#c5ced5]">{draft.estado}</p>
              <p className={`text-[12px] uppercase tracking-[0.06em] ${riskTone[draft.riesgoEditorial]}`}>
                {draft.riesgoEditorial}
              </p>
              <p className="text-[12px] text-[#9aa6af]">{formatDate(draft.fechaCreacion)}</p>
            </div>

            <div className="space-y-3 md:hidden">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[14px] leading-6 text-[#edf2f5]">{draft.titulo}</h3>
                <span className={`text-[10px] uppercase tracking-[0.08em] ${riskTone[draft.riesgoEditorial]}`}>
                  {draft.riesgoEditorial}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.08em] text-[#8e99a3]">
                <span>{draft.fuente.nombre}</span>
                <span>{draft.categoria}</span>
                <span>{draft.estado}</span>
                <span>{formatDate(draft.fechaCreacion)}</span>
              </div>
              <p className="text-[11px] text-[#b9c2c9]">{draft.accionSugerida}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
