import type { Metadata } from "next";
import Link from "next/link";
import { DraftQueue } from "@/components/editorial/draft-queue";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getOpinionQueue } from "@/lib/editorial";
import { createOpinionDraftAction } from "@/app/admin/opinion/actions";

type AdminOpinionPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Admin Opinion",
  description: "Mesa editorial interna para columnas de opinión.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminOpinionPage({ searchParams }: AdminOpinionPageProps) {
  const session = await requireAdminSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const drafts = await getOpinionQueue(query);
  const draftCount = drafts.filter((draft) => draft.estado === "draft").length;
  const reviewCount = drafts.filter((draft) => draft.estado === "needs_review").length;
  const publishedCount = drafts.filter((draft) => draft.estado === "published").length;
  const rejectedCount = drafts.filter((draft) => draft.estado === "rejected").length;

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminSessionBar email={session.email} />

        <section className="border border-[#2f2612] bg-[#101012] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#ffe17a]">Mesa de opinion</p>
              <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">Columna de opinión</h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#d3cab0]">
                Flujo editorial manual para piezas firmadas. Aquí nace, se revisa y se publica la sección que luego
                tendrá su layout propio en portada y en ficha.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/drafts"
                className="border border-[#3a3222] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#ffe17a] hover:text-[#ffe17a]"
              >
                Volver a drafts
              </Link>
              <form action={createOpinionDraftAction}>
                <button
                  type="submit"
                  className="bg-[#ffe17a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#17130a] transition hover:bg-[#ffeb9f]"
                >
                  Nueva opinión
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="border border-[#2f2612] bg-[#161518] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#b8aa78]">En borrador</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{draftCount}</p>
            </div>
            <div className="border border-[#2f2612] bg-[#161518] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#b8aa78]">En revisión</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{reviewCount}</p>
            </div>
            <div className="border border-[#2f2612] bg-[#161518] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#b8aa78]">Publicadas</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{publishedCount}</p>
            </div>
            <div className="border border-[#2f2612] bg-[#161518] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#b8aa78]">Rechazadas</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{rejectedCount}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 border border-[#2f2612] bg-[#101012] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#ffe17a]">Buscador de opinión</p>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#d3cab0]">
                Busca columnas por título, slug, autor, estado o etiquetas dentro de la mesa de opinión.
              </p>
            </div>

            <form action="/admin/opinion" className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar columna, slug, autor..."
                className="min-w-0 flex-1 border border-[#3a3222] bg-[#161518] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-[#7b7460] focus:border-[#ffe17a]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#ffe17a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#17130a] transition hover:bg-[#ffeb9f]"
                >
                  Buscar
                </button>
                {query ? (
                  <Link
                    href="/admin/opinion"
                    className="border border-[#3a3222] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#ffe17a] hover:text-[#ffe17a]"
                  >
                    Limpiar
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="mt-4 text-[12px] text-[#b8aa78]">
            {query ? (
              <p>
                {drafts.length} resultado{drafts.length === 1 ? "" : "s"} para <span className="text-white">{query}</span>.
              </p>
            ) : (
              <p>Mostrando todas las piezas de opinión, incluidas las ya publicadas.</p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <DraftQueue
            drafts={drafts}
            eyebrow="Mesa de opinion"
            title="Cola de columnas"
            showBulkPublish={false}
            editBasePath="/admin/opinion"
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
