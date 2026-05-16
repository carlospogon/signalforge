"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { updateDraftArticleManually } from "@/lib/editorial/store";

export type EditDraftState = {
  error?: string;
};

function parseBody(value: string) {
  return value
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function saveDraftEditAction(_: EditDraftState, formData: FormData): Promise<EditDraftState> {
  const session = await requireAdminSession();
  const draftId = String(formData.get("draftId") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const subtitulo = String(formData.get("subtitulo") ?? "").trim();
  const entradilla = String(formData.get("entradilla") ?? "").trim();
  const cuerpoRaw = String(formData.get("cuerpo") ?? "");
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const imagenAlt = String(formData.get("imagenAlt") ?? "").trim();
  const cuerpo = parseBody(cuerpoRaw);

  if (!draftId) {
    return { error: "No se ha encontrado el borrador." };
  }

  if (!titulo || !subtitulo || !entradilla || cuerpo.length === 0) {
    return { error: "Completa titulo, subtitulo, entradilla y al menos un parrafo del cuerpo." };
  }

  try {
    const result = await updateDraftArticleManually(
      draftId,
      {
        titulo,
        subtitulo,
        entradilla,
        cuerpo,
        imagenUrl: imagenUrl || undefined,
        imagenAlt: imagenAlt || undefined
      },
      session.email
    );

    revalidatePath("/admin/drafts");
    revalidatePath("/");
    revalidatePath("/archivo");
    revalidatePath("/rss.xml");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/categoria/${result.categoria}`);
    revalidatePath(`/articulo/${result.slug}`);
  } catch {
    return { error: "No se ha podido guardar la edicion del borrador." };
  }

  redirect("/admin/drafts");
}
