import Link from "next/link";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Ciencia", href: "/categoria/ciencia" },
  { label: "Tecnologia", href: "/categoria/tecnologia" },
  { label: "IA", href: "/categoria/ia" },
  { label: "Espacio", href: "/categoria/espacio" },
  { label: "Salud", href: "/categoria/salud" },
  { label: "Energia", href: "/categoria/energia" },
  { label: "Opinion", href: "/categoria/opinion" },
  { label: "Laboratorio", href: "/categoria/laboratorio" },
  { label: "Archivo", href: "/archivo" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1b242d] bg-[#071018]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <details className="relative lg:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-[#2a333d] bg-[#0d1620] text-white marker:hidden">
                <span className="text-lg leading-none">≡</span>
              </summary>
              <div className="absolute left-0 top-full mt-3 w-[min(20rem,calc(100vw-2rem))] border border-[#1b242d] bg-[#08111a] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b5ff2a]">Menu</p>
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="border border-[#1b242d] px-3 py-3 text-sm uppercase tracking-[0.05em] text-slate-200 transition hover:border-[#b5ff2a] hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-3 grid gap-2 border-t border-[#1b242d] pt-3">
                  <Link
                    href="/newsletter"
                    className="bg-[#b5ff2a] px-3 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-[#11170f]"
                  >
                    Newsletter
                  </Link>
                  <Link
                    href="/contacto"
                    className="border border-[#2a333d] px-3 py-3 text-sm uppercase tracking-[0.05em] text-slate-200"
                  >
                    Contacto
                  </Link>
                </div>
              </div>
            </details>

            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
                <span className="absolute left-0 top-3 h-3 w-3 rounded-full bg-[#b8ff24]" />
                <span className="absolute left-3 top-0 h-3 w-3 rounded-full bg-[#d9ff7f]" />
                <span className="absolute left-3 top-6 h-3 w-3 rounded-full bg-[#93d91c]" />
                <span className="absolute left-8 top-3 h-3 w-3 rounded-full bg-[#d9ff7f]" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold tracking-[0.14em] text-white sm:text-xl sm:tracking-[0.18em]">
                  Synaptik
                </p>
                <p className="hidden text-[11px] uppercase tracking-[0.24em] text-[#b5ff2a] sm:block">
                  Ciencia | Tecnologia | Futuro
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/archivo"
              className="hidden border border-[#2a333d] px-4 py-2 text-sm text-slate-300 transition hover:border-[#b5ff2a] hover:text-white sm:inline-flex"
            >
              Archivo
            </Link>
            <Link
              href="/newsletter"
              className="bg-[#b5ff2a] px-3 py-2 text-xs font-medium uppercase tracking-[0.04em] text-[#11170f] transition hover:bg-[#d1ff69] sm:px-4 sm:text-sm sm:normal-case sm:tracking-normal"
            >
              Newsletter
            </Link>
          </div>
        </div>

        <nav className="hidden flex-wrap items-center gap-2 text-sm text-slate-300 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="border border-transparent px-3 py-2 uppercase tracking-[0.05em] transition hover:border-[#1b242d] hover:bg-[#0d1620] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
