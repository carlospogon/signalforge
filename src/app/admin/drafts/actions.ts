"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { publishDraftArticle, updateDraftState } from "@/lib/editorial/store";
import { DraftArticle } from "@/types/editorial";

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

export async function updateDraftStateAction(draftId: string, estado: DraftArticle["estado"]) {
  const session = await requireAdminSession();
  const result = await updateDraftState(draftId, estado, session.email);
  revalidateEditorialPaths(result.categoria, result.slug);
}

export async function publishDraftAction(draftId: string) {
  const session = await requireAdminSession();
  const result = await publishDraftArticle(draftId, session.email);
  revalidateEditorialPaths(result.categoria, result.slug);
}
