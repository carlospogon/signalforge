import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getDraftArticleById } from "@/lib/editorial/store";
import { EditDraftForm } from "@/app/admin/drafts/[id]/edit/edit-draft-form";

type EditDraftPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Editar borrador",
  description: "Edicion manual de borradores y piezas publicadas desde el panel interno.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function EditDraftPage({ params }: EditDraftPageProps) {
  const session = await requireAdminSession();
  const { id } = await params;
  const draft = await getDraftArticleById(id);

  if (!draft) {
    notFound();
  }

  const isPublished = draft.estado === "published";

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminSessionBar email={session.email} />

        <section className="border border-[#1b242d] bg-[#08111a] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Edicion manual</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            {draft.titulo}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
            <span>{draft.categoria}</span>
            <span>{draft.estado}</span>
            <span>{draft.tipo}</span>
            <span>{draft.fuente.nombre}</span>
          </div>
          <p className="mt-5 max-w-3xl text-[14px] leading-7 text-[#b8c1c9]">
            {isPublished
              ? "Ajusta el texto o la imagen y guarda para actualizar de inmediato la pieza publicada y su borrador vinculado."
              : "Ajusta el texto y la imagen del borrador. Al guardar volvera a revision dentro del panel para que puedas aprobarlo o publicarlo despues."}
          </p>
        </section>

        <section className="mt-8 border border-[#1b242d] bg-[#08111a] p-6 sm:p-8">
          <EditDraftForm draft={draft} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
