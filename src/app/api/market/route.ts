import { NextResponse } from "next/server";
import { getMarketSnapshot } from "@/lib/market";

export async function GET() {
  const snapshot = await getMarketSnapshot();

  return NextResponse.json(snapshot, {
    status: snapshot.items.length > 0 ? 200 : 503
  });
}
