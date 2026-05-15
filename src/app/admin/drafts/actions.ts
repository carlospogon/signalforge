"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { publishDraftArticle, updateDraftState } from "@/lib/editorial/store";
import { DraftArticle } from "@/types/editorial";

export type DraftActionState = {
  error?: string;
  success?: boolean;
  nextState?: DraftArticle["estado"];
};

function revalidateEditorialPaths(category: DraftArticle["categoria"], slug?: string) {
  revalidatePath("/admin/drafts");
  revalidatePath("/");
  revalidatePath("/archivo");
  revalidatePath("/rss.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/categoria/${category}`);

  if (slug) {
    revalidatePath(`/articulo/${slug}`);
  }
}

const validStateTransitions = new Set<DraftArticle["estado"]>(["needs_review", "approved", "rejected"]);

export async function submitDraftAction(
  _: DraftActionState,
  formData: FormData
): Promise<DraftActionState> {
  const session = await requireAdminSession();
  const draftId = String(formData.get("draftId") ?? "");
  const intent = String(formData.get("intent") ?? "");

  if (!draftId) {
    return {
      error: "No se ha encontrado el borrador."
    };
  }

  if (intent === "publish") {
    try {
      const result = await publishDraftArticle(draftId, session.email);
      revalidateEditorialPaths(result.categoria, result.slug);

      return {
        success: true,
        nextState: "published"
      };
    } catch {
      return {
        error: "No se ha podido publicar el borrador."
      };
    }
  }

  if (!validStateTransitions.has(intent as DraftArticle["estado"])) {
    return {
      error: "La accion solicitada no es valida."
    };
  }

  try {
    const result = await updateDraftState(draftId, intent as DraftArticle["estado"], session.email);
    revalidateEditorialPaths(result.categoria, result.slug);

    return {
      success: true,
      nextState: intent as DraftArticle["estado"]
    };
  } catch {
    return {
      error: "No se ha podido actualizar el estado del borrador."
    };
  }
}
