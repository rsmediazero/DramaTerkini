import { NextRequest, NextResponse } from "next/server";
import { fetchLatest } from "@/lib/dramabox";
import { hit } from "@/lib/ratelimit";
import { applyCors, handlePreflight } from "@/lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const { headers } = applyCors(req);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = hit(ip, 60, 60_000);
  if (!rl.ok)
    return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const url = new URL(req.url);
  const pageNo = Number(url.searchParams.get("pageNo") ?? 1);
  const { status, data } = await fetchLatest(pageNo);

  const records = data?.data?.newTheaterList?.records ?? [];
  return NextResponse.json({ records }, { status, headers });
}
