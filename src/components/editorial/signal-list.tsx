import { ImportedSignal } from "@/types/editorial";

type SignalListProps = {
  signals: ImportedSignal[];
};

const categoryLabels: Record<ImportedSignal["categoriaSugerida"], string> = {
  ia: "IA",
  ciencia: "Ciencia",
  tecnologia: "Tecnología",
  espacio: "Espacio",
  salud: "Salud",
  biotech: "Biotech",
  ciberseguridad: "Ciberseguridad",
  opinion: "Opinión",
  laboratorio: "Laboratorio"
};

function formatSignalDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function SignalList({ signals }: SignalListProps) {
  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <article key={signal.id} className="border border-[#1b242d] bg-[#0b131c] p-4 transition hover:bg-[#0e1721]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b5ff2a]">
                Radar
              </span>
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#7b8894]">
                {categoryLabels[signal.categoriaSugerida]}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.08em] text-[#6c7a86]">
              {formatSignalDate(signal.fechaPublicacion)}
            </span>
          </div>
          <h3 className="mt-3 text-[15px] leading-6 text-[#eef3f7]">{signal.tituloOriginal}</h3>
          <p className="mt-2 text-[12px] leading-6 text-[#b6c0c8]">{signal.resumenOriginal}</p>
        </article>
      ))}
    </div>
  );
}
