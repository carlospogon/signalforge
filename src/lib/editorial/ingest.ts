import "server-only";

import { listEditorialSources, listImportedSignals } from "@/lib/editorial/store";

export async function getEditorialSources() {
  return listEditorialSources();
}

export async function ingestSignals(limit?: number) {
  return listImportedSignals(limit);
}
