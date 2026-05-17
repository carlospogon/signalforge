"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { publishDraftArticle, regenerateDraftArticleFromSignal, updateDraftState } from "@/lib/editorial/store";
import { DraftArticle } from "@/types/editorial";

export type DraftActionState = {
  error?: string;
  success?: boolean;
  nextState?: DraftArticle["estado"];
};

export type BulkDraftActionState = {
  error?: string;
  success?: boolean;
  publishedCount?: number;
};

function revalidateEditorialPaths(category: DraftArticle["categoria"], slug?: string) {
  revalidatePath("/admin/drafts");
  revalidatePath("/admin/opinion");
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

  if (intent === "regenerate") {
    try {
      const result = await regenerateDraftArticleFromSignal(draftId, session.email);
      revalidateEditorialPaths(result.categoria, result.slug);

      return {
        success: true,
        nextState: "needs_review"
      };
    } catch {
      return {
        error: "No se ha podido regenerar el borrador."
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

export async function submitBulkPublishAction(
  _: BulkDraftActionState,
  formData: FormData
): Promise<BulkDraftActionState> {
  const session = await requireAdminSession();
  const draftIds = formData
    .getAll("draftIds")
    .map((value) => String(value))
    .filter(Boolean);

  if (draftIds.length === 0) {
    return {
      error: "Selecciona al menos un borrador para publicarlo."
    };
  }

  let publishedCount = 0;
  let lastCategory: DraftArticle["categoria"] | undefined;
  let lastSlug: string | undefined;

  try {
    for (const draftId of draftIds) {
      const result = await publishDraftArticle(draftId, session.email);
      publishedCount += 1;
      lastCategory = result.categoria;
      lastSlug = result.slug;
    }

    if (lastCategory) {
      revalidateEditorialPaths(lastCategory, lastSlug);
    } else {
      revalidatePath("/admin/drafts");
    }

    return {
      success: true,
      publishedCount
    };
  } catch {
    return {
      error:
        publishedCount > 0
          ? `Se publicaron ${publishedCount} borradores antes de que fallara la operación.`
          : "No se han podido publicar los borradores seleccionados."
    };
  }
}
