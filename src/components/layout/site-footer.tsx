import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1b242d] bg-[#071018]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-lg text-white">Synaptik</p>
          <p>
            Ciencia, tecnologia e innovacion con criterio editorial. Un medio pensado para
            interpretar senales, no para perseguir ruido.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white">Explorar</p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="hover:text-white">
              Portada
            </Link>
            <Link href="/archivo" className="hover:text-white">
              Archivo
            </Link>
            <Link href="/newsletter" className="hover:text-white">
              Newsletter
            </Link>
            <Link href="/contacto" className="hover:text-white">
              Contacto
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white">Legal</p>
          <div className="flex flex-col gap-2">
            <Link href="/politica-de-privacidad" className="hover:text-white">
              Politica de privacidad
            </Link>
            <Link href="/preferencias-de-privacidad" className="hover:text-white">
              Preferencias de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

