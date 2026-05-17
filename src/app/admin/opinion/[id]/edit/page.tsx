import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminSessionBar } from "@/components/admin/admin-session-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdminSession } from "@/lib/auth/server";
import { getDraftArticleById } from "@/lib/editorial/store";
import { EditOpinionForm } from "@/app/admin/opinion/[id]/edit/edit-opinion-form";

type EditOpinionPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Editar opinión",
  description: "Edición manual de columnas de opinión desde el panel interno.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function EditOpinionPage({ params }: EditOpinionPageProps) {
  const session = await requireAdminSession();
  const { id } = await params;
  const draft = await getDraftArticleById(id);

  if (!draft || draft.tipo !== "opinion") {
    notFound();
  }

  const isPublished = draft.estado === "published";

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminSessionBar email={session.email} />

        <section className="border border-[#2f2612] bg-[#101012] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#ffe17a]">Edición de opinión</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{draft.titulo}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.08em] text-[#b8aa78]">
            <span>opinión</span>
            <span>{draft.estado}</span>
            <span>{draft.autor}</span>
            <span>{draft.fuente.nombre}</span>
          </div>
          <p className="mt-5 max-w-3xl text-[14px] leading-7 text-[#d3cab0]">
            {isPublished
              ? "Ajusta el contenido y guarda para actualizar la pieza publicada y su borrador editorial."
              : "Construye aquí la columna con un flujo separado del resto de borradores automatizados."}
          </p>
        </section>

        <section className="mt-8 border border-[#2f2612] bg-[#101012] p-6 sm:p-8">
          <EditOpinionForm draft={draft} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
