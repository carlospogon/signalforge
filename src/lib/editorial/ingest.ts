import "server-only";

import { unstable_cache } from "next/cache";
import { listEditorialSources, listImportedSignals, refreshEditorialData } from "@/lib/editorial/store";

const refreshEditorialDataCached = unstable_cache(
  async () => {
    await refreshEditorialData();
  },
  ["editorial-refresh"],
  {
    revalidate: 1800
  }
);

export async function getEditorialSources() {
  await refreshEditorialDataCached();
  return listEditorialSources();
}

export async function ingestSignals(limit?: number) {
  await refreshEditorialDataCached();
  return listImportedSignals(limit);
}
