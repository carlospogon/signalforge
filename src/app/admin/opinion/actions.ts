"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/server";
import { createOpinionDraft } from "@/lib/editorial";

export async function createOpinionDraftAction() {
  const session = await requireAdminSession();
  const draft = await createOpinionDraft(session.email);

  revalidatePath("/admin/opinion");
  redirect(`/admin/opinion/${draft.id}/edit`);
}
