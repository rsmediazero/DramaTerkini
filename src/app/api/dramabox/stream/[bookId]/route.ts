import { NextRequest, NextResponse } from "next/server";
import { fetchStream } from "@/lib/dramabox";
import { hit } from "@/lib/ratelimit";
import { applyCors, handlePreflight } from "@/lib/cors";
import {
  mapVideoSources,
  pickInitialSource,
  getUrlExpiryMs,
} from "@/lib/videoSource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ bookId: string }> }
) {
  const { headers } = applyCors(req);
  const { bookId } = await ctx.params;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = hit(ip, 60, 60_000);
  if (!rl.ok)
    return NextResponse.json(
      { error: "rate limited" },
      { status: 429, headers }
    );

  const url = new URL(req.url);
  const index = Number(url.searchParams.get("index") ?? 1);
  const raw = url.searchParams.get("raw") === "1";

  let { status, data } = await fetchStream(bookId, index);

  // pilih episode yg sesuai index (0-based di chapterIndex)
  const chapters = data?.data?.chapterList ?? [];
  const wantedIdx = Math.max(0, Number(index) - 1);
  const chapter =
    chapters.find((ch: any) => Number(ch.chapterIndex ?? 0) === wantedIdx) ??
    chapters[0] ??
    null;

  if (!chapter)
    return NextResponse.json({ chapter: null }, { status: 404, headers });

  if (raw) return NextResponse.json(data, { status, headers }); // debug penuh

  const sources = mapVideoSources(chapter.cdnList);
  const initial = pickInitialSource(sources);

  const payload = {
    index: Number(chapter.chapterIndex ?? wantedIdx),
    id: String(chapter.chapterId ?? ""),
    name: chapter.chapterName ?? `EP ${wantedIdx + 1}`,
    thumb: chapter.chapterImg ?? null,
    isCharge: !!(chapter.isCharge ?? chapter.chargeChapter),
    // meta buku ringkas
    book: {
      id: data?.data?.bookId,
      name: data?.data?.bookName,
      cover: data?.data?.bookCover,
      playCount: data?.data?.playCount,
    },
    // daftar sumber yang sudah diurutkan
    sources: sources.map((s) => ({
      url: s.url,
      quality: s.quality,
      cdn: s.cdn,
      isDefault: s.isDefaultCdn && s.isDefaultQuality,
      isVip: s.isVip,
      expiresAt: getUrlExpiryMs(s.url), // unix ms atau 0
    })),
    initialQuality: initial?.quality ?? null,
  };

  // console.log(pa);

  return NextResponse.json({ chapter: payload }, { status, headers });
}
