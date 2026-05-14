import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Newsletter</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            El cierre editorial de Synaptik, en tu correo
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c1c9]">
            El boletin esta en preparacion. La version publica se abrira cuando cerremos el flujo
            editorial y la operativa de suscripcion. Hasta entonces mantenemos una lista privada de
            interes para lectores tempranos.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b5ff2a]">Estado actual</p>
              <p className="mt-3 text-sm leading-7 text-[#c6d0d8]">
                Sin formularios activos hasta conectar el proveedor definitivo y la politica de
                consentimiento.
              </p>
            </div>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b5ff2a]">Canal provisional</p>
              <p className="mt-3 text-sm leading-7 text-[#c6d0d8]">
                Puedes pedir acceso temprano o dejar interes editorial por correo.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.newsletterEmail}?subject=Lista%20privada%20Synaptik`}
              className="bg-[#b5ff2a] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#11170f]"
            >
              Solicitar acceso
            </a>
            <Link
              href="/archivo"
              className="border border-[#2a333d] px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              Ver archivo
            </Link>
          </div>
          <Link href="/" className="mt-8 inline-block text-sm text-[#b5ff2a]">
            Volver a la portada
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
