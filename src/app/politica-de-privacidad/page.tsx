import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">
            Politica de privacidad
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            Como tratamos la informacion de quienes leen Synaptik
          </h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-[#b8c1c9]">
            <p>
              Synaptik recoge unicamente la informacion necesaria para prestar el servicio, medir
              rendimiento editorial y gestionar suscripciones o comunicaciones voluntarias.
            </p>
            <p>
              Los datos enviados a traves de formularios, newsletter o contacto se utilizan con
              fines editoriales, operativos o de atencion. No vendemos informacion personal a
              terceros ni la utilizamos para fines incompatibles con la relacion establecida con la
              persona usuaria.
            </p>
            <p>
              Cuando existan herramientas de analitica o personalizacion, estas se aplicaran bajo
              criterios de minimizacion, seguridad y transparencia. Las personas usuarias podran
              solicitar acceso, rectificacion o supresion de sus datos en los canales de contacto
              habilitados por el medio.
            </p>
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

