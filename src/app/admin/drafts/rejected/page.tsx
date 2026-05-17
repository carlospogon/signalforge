import type { Metadata } from "next";
import Link from "next/link";
import { DraftQueue } from "@/components/editorial/draft-queue";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getRejectedDraftQueue } from "@/lib/editorial";

type RejectedDraftsPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Rejected Drafts",
  description: "Vista interna de revisión exhaustiva para borradores rechazados.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function RejectedDraftsPage({ searchParams }: RejectedDraftsPageProps) {
  const session = await requireAdminSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const drafts = await getRejectedDraftQueue(query);

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminSessionBar email={session.email} />
        <section className="border border-[#1b242d] bg-[#08111a] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#ff8e8e]">Revision exhaustiva</p>
              <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
                Borradores rechazados
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#b8c1c9]">
                Espacio separado para revisar piezas rechazadas con más detalle antes de corregirlas, devolverlas a
                revisión o descartarlas definitivamente.
              </p>
            </div>

            <Link
              href="/admin/drafts"
              className="border border-[#29333d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#b5ff2a] hover:text-[#b5ff2a]"
            >
              Volver a activos
            </Link>
          </div>
        </section>

        <section className="mt-8 border border-[#1b242d] bg-[#08111a] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#ff8e8e]">Buscador de rechazados</p>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#9fadb8]">
                Busca dentro de los borradores rechazados por título, slug, fuente, autor, categoría o etiquetas.
              </p>
            </div>

            <form action="/admin/drafts/rejected" className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar borrador rechazado..."
                className="min-w-0 flex-1 border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-[#667481] focus:border-[#ff8e8e]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#ff8e8e] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1a0f0f] transition hover:bg-[#ffaaaa]"
                >
                  Buscar
                </button>
                {query ? (
                  <Link
                    href="/admin/drafts/rejected"
                    className="border border-[#29333d] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#ff8e8e] hover:text-[#ff8e8e]"
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
                {drafts.length} resultado{drafts.length === 1 ? "" : "s"} en rechazados para <span className="text-white">{query}</span>.
              </p>
            ) : (
              <p>Mostrando los borradores rechazados más recientes para revisión exhaustiva.</p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <DraftQueue
            drafts={drafts}
            eyebrow="Revision exhaustiva"
            title="Cola de rechazados"
            showBulkPublish={false}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
