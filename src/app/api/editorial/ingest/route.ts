import { refreshEditorialData, getEditorialSummaryFromDb } from "@/lib/editorial/store";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  if (!env.CRON_SECRET) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.replace(/^Bearer\s+/i, "");

  return bearerToken === env.CRON_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batch = await refreshEditorialData();
  const summary = await getEditorialSummaryFromDb();

  return Response.json({
    ok: true,
    batch,
    summary
  });
}
