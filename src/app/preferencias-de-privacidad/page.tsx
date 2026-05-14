import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PrivacyPreferencesPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">
            Preferencias de privacidad
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            Control sobre cookies, medicion y comunicaciones
          </h1>
          <div className="mt-8 space-y-5 text-base leading-8 text-[#b8c1c9]">
            <p>
              Esta pagina resume las preferencias que Synaptik ofrecera para gestionar medicion de
              audiencia, personalizacion limitada y comunicaciones por correo.
            </p>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="font-medium text-white">Cookies esenciales</p>
              <p className="mt-2">
                Necesarias para el funcionamiento basico del sitio, seguridad y sesiones.
              </p>
            </div>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="font-medium text-white">Medicion y analitica</p>
              <p className="mt-2">
                Utilizadas para entender lectura, rendimiento y navegacion agregada.
              </p>
            </div>
            <div className="border border-[#1b242d] bg-[#0d1620] p-5">
              <p className="font-medium text-white">Newsletter y avisos editoriales</p>
              <p className="mt-2">
                Solo activados cuando la persona usuaria se suscribe de forma voluntaria.
              </p>
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
