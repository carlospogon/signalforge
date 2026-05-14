import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Quienes somos</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            Un medio editorial para interpretar ciencia, tecnologia e innovacion
          </h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-[#b8c1c9]">
            <p>
              Synaptik nace con una premisa concreta: la informacion tecnologica no necesita mas
              volumen, necesita mejor lectura. Nuestro trabajo es separar senal de propaganda,
              avance real de promesa excesiva y contexto de ruido.
            </p>
            <p>
              Cubrimos inteligencia artificial, ciencia, espacio, salud, energia y cultura
              digital con enfoque editorial, no solo con inmediatez. El objetivo no es correr
              detras del titular, sino explicar por que una historia importa.
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
