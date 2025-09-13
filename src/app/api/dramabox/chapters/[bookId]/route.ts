import { NextRequest, NextResponse } from "next/server";
import { fetchStream } from "@/lib/dramabox";
import { applyCors, handlePreflight } from "@/lib/cors";

type Chapter = {
  chapterId: string | number;
  chapterIndex?: number;
  chapterName?: string;
  chapterImg?: string;
  isCharge?: number;
  chargeChapter?: boolean;
  cdnList?: Cdn[];
};

type Cdn = {
  cdnDomain: string;
  isDefault: number;
  videoPathList?: VideoPath[];
};

type VideoPath = {
  quality: number;
  videoPath: string;
  isDefault?: number;
  isVipEquity?: number;
};

type Episode = {
  id: string;
  index: number;
  name: string;
  thumbnail: string | null;
  isCharge: boolean;
  sources: Source[];
};

type Source = {
  url: string;
  quality: number;
  cdn: string;
  isDefault: boolean;
  isVip: boolean;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await ctx.params;
  const { headers } = applyCors(req);
  const url = new URL(req.url);
  const index = Number(url.searchParams.get("index") ?? 1);

  const { status, data } = await fetchStream(bookId, index);
  const d = data?.data ?? {};

  const meta = {
    bookId: d.bookId,
    bookName: d.bookName,
    bookCover: d.bookCover,
    playCount: d.playCount,
    corner: d.corner ?? null,
    chapterCount: d.chapterCount ?? d.chapterList?.length ?? 0,
    description: d.introduction ?? "",
    tags: d.tags ?? [],
    orientation: "portrait" as const, // <-- potrait
  };

  const episodes: Episode[] = (d.chapterList ?? []).map((ch: Chapter) => {
    const sources: Source[] = (ch.cdnList ?? [])
      .flatMap((cdn: Cdn) =>
        (cdn.videoPathList ?? []).map((v: VideoPath) => ({
          url: v.videoPath,
          quality: Number(v.quality ?? 0),
          cdn: String(cdn.cdnDomain ?? ""),
          isDefault: cdn.isDefault === 1 && v.isDefault === 1,
          isVip: v.isVipEquity === 1,
        }))
      )
      .filter((s): s is Source => Boolean(s.url && s.quality));

    sources.sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return b.quality - a.quality;
    });

    return {
      id: String(ch.chapterId),
      index: Number(ch.chapterIndex ?? 0),
      name: ch.chapterName ?? `EP ${Number(ch.chapterIndex ?? 0) + 1}`,
      thumbnail: ch.chapterImg ?? null,
      isCharge: !!(ch.isCharge ?? ch.chargeChapter),
      sources,
    };
  });

  return NextResponse.json({ meta, episodes }, { status, headers });
}
