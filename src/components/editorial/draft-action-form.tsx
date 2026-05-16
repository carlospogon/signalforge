"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitDraftAction, type DraftActionState } from "@/app/admin/drafts/actions";

type DraftActionFormProps = {
  draftId: string;
  intent: "needs_review" | "approved" | "rejected" | "publish" | "regenerate";
  label: string;
  className: string;
};

const initialState: DraftActionState = {};

export function DraftActionForm({ draftId, intent, label, className }: DraftActionFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitDraftAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="draftId" value={draftId} />
      <input type="hidden" name="intent" value={intent} />
      <button type="submit" disabled={pending} className={className}>
        {pending ? "Procesando..." : label}
      </button>
      {state.error ? <span className="text-[10px] text-[#ff8e8e]">{state.error}</span> : null}
    </form>
  );
}
