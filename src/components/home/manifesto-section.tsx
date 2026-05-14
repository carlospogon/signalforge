import { manifestoPoints } from "@/data/articles";
import { SectionHeading } from "@/components/ui/section-heading";

export function ManifestoSection() {
  return (
    <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionHeading
        eyebrow="Manifiesto"
        title="No seguimos la velocidad del ciclo. Seguimos la forma del cambio."
        description="Synaptik nace para leer senales complejas con criterio editorial, lenguaje preciso y una relacion explicita con la evidencia."
      />

      <div className="space-y-4">
        {manifestoPoints.map((point, index) => (
          <div key={point} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
                0{index + 1}
              </span>
              <p className="text-sm leading-7 text-slate-200">{point}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

