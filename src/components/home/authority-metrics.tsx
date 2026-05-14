import { authorityMetrics } from "@/data/articles";

export function AuthorityMetrics() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(6,11,22,0.95),rgba(10,25,47,0.92))] p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200">Autoridad editorial</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white">Un medio que ya habla con peso propio</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-300">
          La portada combina señal, escala y memoria editorial para evitar la sensacion de producto naciente.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {authorityMetrics.map((metric) => (
          <div key={metric.value} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="font-display text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

