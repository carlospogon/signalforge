import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
        <section className="border border-[#1b242d] bg-[#08111a] p-8 sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Error 404</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">La pagina que buscas no esta disponible</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#b8c1c9]">
            Puede que la ruta haya cambiado, que el contenido aun no este publicado o que el enlace
            sea incorrecto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="bg-[#b5ff2a] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#11170f]"
            >
              Volver a portada
            </Link>
            <Link
              href="/archivo"
              className="border border-[#2a333d] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              Abrir archivo
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
