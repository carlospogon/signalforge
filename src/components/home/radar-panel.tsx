import { getRadarSignals } from "@/lib/editorial";

export async function RadarPanel() {
  const signals = await getRadarSignals();

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">Radar</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">Ultima hora</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold uppercase tracking-[0.3em] text-cyan-100">
          Live
        </div>
      </div>

      <div className="space-y-4">
        {signals.map((signal) => (
          <article
            key={signal.id}
            className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-400/20 hover:bg-slate-950/70"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cyan-200">
                {signal.categoriaSugerida}
              </span>
              <span className="text-xs text-slate-500">{signal.clasificacion.prioridadPublicacion}</span>
            </div>
            <h3 className="mt-3 text-sm font-medium leading-6 text-slate-100">{signal.tituloOriginal}</h3>
          </article>
        ))}
      </div>
    </aside>
  );
}
