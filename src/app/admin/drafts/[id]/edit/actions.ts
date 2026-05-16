"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { updateDraftArticleManually } from "@/lib/editorial/store";
import { EditorialCategory } from "@/types/editorial";

export type EditDraftState = {
  error?: string;
};

function parseBody(value: string) {
  return value
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function saveDraftEditAction(_: EditDraftState, formData: FormData): Promise<EditDraftState> {
  const session = await requireAdminSession();
  const draftId = String(formData.get("draftId") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const subtitulo = String(formData.get("subtitulo") ?? "").trim();
  const entradilla = String(formData.get("entradilla") ?? "").trim();
  const cuerpoRaw = String(formData.get("cuerpo") ?? "");
  const categoria = String(formData.get("categoria") ?? "").trim() as EditorialCategory;
  const etiquetasRaw = String(formData.get("etiquetas") ?? "");
  const autor = String(formData.get("autor") ?? "").trim();
  const tiempoLectura = String(formData.get("tiempoLectura") ?? "").trim();
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const imagenAlt = String(formData.get("imagenAlt") ?? "").trim();
  const cuerpo = parseBody(cuerpoRaw);
  const etiquetas = parseTags(etiquetasRaw);

  if (!draftId) {
    return { error: "No se ha encontrado el borrador." };
  }

  if (!titulo || !subtitulo || !entradilla || cuerpo.length === 0 || !categoria || !autor || !tiempoLectura) {
    return { error: "Completa titulo, subtitulo, entradilla, categoria, autor, tiempo de lectura y al menos un parrafo del cuerpo." };
  }

  try {
    const result = await updateDraftArticleManually(
      draftId,
      {
        titulo,
        subtitulo,
        entradilla,
        cuerpo,
        categoria,
        etiquetas,
        autor,
        tiempoLectura,
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
    revalidatePath(`/articulo/${result.previousSlug}`);
    revalidatePath(`/articulo/${result.slug}`);
  } catch {
    return { error: "No se ha podido guardar la edicion del borrador." };
  }

  redirect("/admin/drafts");
}
