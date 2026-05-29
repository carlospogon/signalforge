import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buildSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales editoriales, alianzas y eventos de Synaptik.",
  alternates: {
    canonical: "/contacto"
  },
  openGraph: {
    url: buildSiteUrl("/contacto"),
    title: "Contacto",
    description: "Canales editoriales, alianzas y eventos de Synaptik."
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Contacto</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            Pistas, colaboraciones y conversaciones editoriales
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#b8c1c9]">
            Esta version del sitio todavia no expone formularios operativos. Centralizamos el
            contacto por correo para mantener trazabilidad y responder con contexto.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b5ff2a]">Redaccion</p>
              <p className="mt-3 text-sm leading-7 text-[#c6d0d8]">
                Pistas, temas en seguimiento y conversaciones editoriales.
              </p>
              <a href={`mailto:${siteConfig.contactEmail}`} className="mt-4 inline-block text-sm text-white">
                {siteConfig.contactEmail}
              </a>
            </div>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b5ff2a]">Alianzas</p>
              <p className="mt-3 text-sm leading-7 text-[#c6d0d8]">
                Patrocinios selectivos, colaboraciones y proyectos de marca.
              </p>
              <a href={`mailto:${siteConfig.partnershipsEmail}`} className="mt-4 inline-block text-sm text-white">
                {siteConfig.partnershipsEmail}
              </a>
            </div>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#b5ff2a]">Eventos</p>
              <p className="mt-3 text-sm leading-7 text-[#c6d0d8]">
                Ponencias, moderacion y formatos editoriales en directo.
              </p>
              <a href={`mailto:${siteConfig.eventsEmail}`} className="mt-4 inline-block text-sm text-white">
                {siteConfig.eventsEmail}
              </a>
            </div>
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
