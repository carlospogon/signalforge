import type { Metadata } from "next";
import { DraftQueue } from "@/components/editorial/draft-queue";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getDraftQueue, getEditorialSummary } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Admin Drafts",
  description: "Cola interna de borradores automatizados y revision editorial de Synaptik.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDraftsPage() {
  const session = await requireAdminSession();
  const [drafts, summary] = await Promise.all([getDraftQueue(), getEditorialSummary()]);

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
            Esta vista no tiene autenticacion todavia y debe protegerse antes de produccion. La
            cola separa radar automatizado, analisis en preparacion y opinion manual fuera del
            pipeline automatico.
          </p>

          <div className="mt-8 grid gap-px bg-[#1b242d] sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Fuentes</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.sourceCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Senales</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.signalCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Revision</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.reviewCount}</p>
            </div>
            <div className="bg-[#0b131c] px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Listas para radar</p>
              <p className="mt-2 text-[24px] font-semibold text-white">{summary.autopublishReadyCount}</p>
            </div>
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
