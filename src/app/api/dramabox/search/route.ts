import { NextRequest, NextResponse } from "next/server";
import { fetchSuggest } from "@/lib/dramabox";
import { hit } from "@/lib/ratelimit";
import { applyCors, handlePreflight } from "@/lib/cors";
import { mapToItem } from "@/lib/mapToItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function POST(req: NextRequest) {
  const { headers } = applyCors(req);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = hit(ip, 60, 60_000);
  if (!rl.ok)
    return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const { keyword } = await req.json();
  if (typeof keyword !== "string" || !keyword.trim()) {
    return NextResponse.json({ error: "keyword required" }, { status: 400 });
  }

  const { status, data } = await fetchSuggest(keyword.trim());
  const raw = data?.data?.suggestList ?? [];

  const records = raw.map(mapToItem);
  return NextResponse.json({ records }, { status, headers });
}
