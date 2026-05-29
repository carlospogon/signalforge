import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buildSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "La propuesta editorial y el enfoque de Synaptik sobre ciencia, tecnología e innovación.",
  alternates: {
    canonical: "/quienes-somos"
  },
  openGraph: {
    url: buildSiteUrl("/quienes-somos"),
    title: "Quiénes somos",
    description: "La propuesta editorial y el enfoque de Synaptik sobre ciencia, tecnología e innovación."
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="border border-[#1b242d] bg-[#08111a] p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Quiénes somos</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-white">
            No perseguimos titulares. Interpretamos señales.
          </h1>
          <div className="mt-8 space-y-6 text-base leading-8 text-[#b8c1c9]">
            <p>
              Synaptik nace de una convicción sencilla, pero cada vez más necesaria: el problema
              de la información tecnológica ya no es la falta de acceso, sino el exceso de ruido.
              Nunca ha sido tan fácil conocer un titular y nunca ha sido tan difícil entender qué
              significa realmente.
            </p>
            <p>
              Cada día aparecen nuevas inteligencias artificiales, anuncios de grandes
              tecnológicas, avances científicos, promesas espaciales, startups multimillonarias y
              supuestas revoluciones capaces de “cambiarlo todo”. La mayoría desaparecen semanas
              después. Otras, en cambio, terminan alterando industrias enteras, modificando
              relaciones de poder o redefiniendo cómo vivimos, trabajamos y nos comunicamos. La
              dificultad está en distinguir unas de otras mientras todavía están ocurriendo.
            </p>
            <p>Ahí es donde entra Synaptik.</p>
            <p>
              No entendemos la tecnología como una sucesión infinita de gadgets, lanzamientos o
              notas de prensa. La entendemos como una fuerza capaz de reorganizar economía,
              política, cultura, trabajo, ciencia y sociedad. Por eso nuestro enfoque no consiste
              únicamente en contar qué ha pasado, sino en analizar por qué importa, quién gana
              influencia, qué intereses chocan y qué consecuencias pueden emerger detrás de cada
              movimiento.
            </p>
            <p>
              En un ecosistema dominado por la velocidad, el algoritmo y la reacción inmediata,
              Synaptik apuesta por otra idea: interpretar señales antes que perseguir tendencias.
              Creemos que el valor periodístico ya no está solo en publicar primero, sino en
              ofrecer contexto cuando todo el mundo compite por atención.
            </p>
            <p>
              Nuestra cobertura se centra en inteligencia artificial, ciencia, espacio,
              biotecnología, salud, energía, ciberseguridad y cultura digital. Pero no abordamos
              estos temas únicamente desde la fascinación tecnológica. Nos interesa la tensión real
              que generan: las disputas empresariales, las implicaciones regulatorias, las
              transformaciones laborales, las nuevas dependencias geopolíticas y las preguntas
              éticas que empiezan a surgir alrededor de cada avance.
            </p>
            <p>
              Por eso en Synaptik conviven noticias rápidas con análisis más profundos. Algunas
              historias exigen inmediatez. Otras necesitan distancia, contexto y lectura
              estratégica. Nuestro objetivo es construir un medio capaz de hacer ambas cosas sin
              caer ni en el sensacionalismo ni en el lenguaje corporativo disfrazado de
              periodismo.
            </p>
            <p>
              También creemos que gran parte de la cobertura tecnológica actual ha terminado
              atrapada entre dos extremos: la propaganda optimista y el catastrofismo permanente.
              En Synaptik intentamos escapar de ambos. Ni toda innovación es una revolución
              inevitable, ni toda inteligencia artificial es una amenaza existencial inmediata. La
              tecnología rara vez avanza de forma lineal, y entender sus límites es tan importante
              como entender sus posibilidades.
            </p>
            <p>
              Esa mirada también condiciona cómo escribimos. No buscamos titulares vacíos ni
              exageraciones diseñadas para maximizar clics. Preferimos artículos que expliquen,
              conecten ideas y ayuden al lector a comprender mejor el escenario que se está
              construyendo delante de él. Queremos que cada pieza deje algo más que una impresión
              momentánea: contexto, perspectiva y capacidad de interpretación.
            </p>
            <p>
              Synaptik es, en parte, un medio tecnológico. Pero también es un espacio para observar
              cómo la innovación reconfigura el mundo contemporáneo. Porque detrás de cada avance
              en IA, cada misión espacial o cada nuevo modelo energético, lo que realmente está en
              juego no es solo la tecnología, sino el tipo de sociedad que acabará construyéndose
              alrededor de ella.
            </p>
            <p>No perseguimos titulares. Interpretamos señales.</p>
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
