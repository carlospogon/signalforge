import type { Metadata } from "next";
import Link from "next/link";
import { DraftQueue } from "@/components/editorial/draft-queue";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getDraftQueue, getEditorialSummary } from "@/lib/editorial";

type AdminDraftsPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Admin Drafts",
  description: "Cola interna de borradores automatizados y revisión editorial de Synaptik.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDraftsPage({ searchParams }: AdminDraftsPageProps) {
  const session = await requireAdminSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const [drafts, summary] = await Promise.all([getDraftQueue(query), getEditorialSummary()]);
  const needsReviewCount = drafts.filter((draft) => draft.estado === "needs_review").length;
  const approvedCount = drafts.filter((draft) => draft.estado === "approved").length;
  const publishedCount = drafts.filter((draft) => draft.estado === "published").length;

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminSessionBar email={session.email} />
        <section className="border border-[#1b242d] bg-[#08111a] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Admin interno</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Borradores automatizados
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#b8c1c9]">
            Panel editorial interno para revisar borradores, moverlos entre estados, editar piezas
            publicadas y localizar cualquier artículo desde la base de datos.
          </p>

          <div className="mt-8 grid gap-px bg-[#1b242d] sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Fuentes</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.sourceCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Señales</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.signalCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Revisión</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.reviewCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Listas para radar</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.autopublishReadyCount}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="border border-[#1b242d] bg-[#0b131c] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Necesitan revisión</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{needsReviewCount}</p>
            </div>
            <div className="border border-[#1b242d] bg-[#0b131c] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Aprobadas</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{approvedCount}</p>
            </div>
            <div className="border border-[#1b242d] bg-[#0b131c] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#7f8d98]">Publicadas</p>
              <p className="mt-2 text-[18px] font-semibold text-white">{publishedCount}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 border border-[#1b242d] bg-[#08111a] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#b5ff2a]">Buscador editorial</p>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#9fadb8]">
                Busca por título, slug, fuente, autor, estado, categoría o etiquetas. Incluye piezas
                publicadas y no publicadas.
              </p>
            </div>

            <form action="/admin/drafts" className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar articulo, fuente, slug, autor..."
                className="min-w-0 flex-1 border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-[#667481] focus:border-[#b5ff2a]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#b5ff2a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#11170f] transition hover:bg-[#c6ff57]"
                >
                  Buscar
                </button>
                {query ? (
                  <Link
                    href="/admin/drafts"
                    className="border border-[#29333d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#b5ff2a] hover:text-[#b5ff2a]"
                  >
                    Limpiar
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="mt-4 text-[12px] text-[#7f8d98]">
            {query ? (
              <p>
                {drafts.length} resultado{drafts.length === 1 ? "" : "s"} para <span className="text-white">{query}</span>.
              </p>
            ) : (
              <p>Mostrando los 100 borradores más recientes. Usa el buscador para localizar cualquier pieza histórica o publicada.</p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <DraftQueue drafts={drafts} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
