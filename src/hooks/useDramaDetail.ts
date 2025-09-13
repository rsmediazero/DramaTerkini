import useSWR from "swr";
import type { DramaDetail, Episode, PlayerSource } from "@/types/drama";

const getJson = (u: string) =>
  fetch(u, { cache: "no-store" }).then((r) => r.json());

type ChaptersResp = {
  meta?: {
    bookId?: string;
    bookName?: string;
    bookCover?: string;
    playCount?: string;
    corner?: { name?: string; color?: string };
    chapterCount?: number;
    description?: string;
    tags?: string[];
    orientation?: "portrait" | "landscape";
  };
  episodes?: Array<{
    id: string;
    index: number;
    name: string;
    thumbnail?: string;
    isCharge?: boolean;
    sources: Array<{
      url: string;
      quality: number;
      cdn: string;
      isDefault?: boolean;
      isVip?: boolean;
      expiresAt?: number;
    }>;
  }>;
};

function toDetail(bookId: string, j: ChaptersResp): DramaDetail {
  const eps: Episode[] = (j.episodes ?? []).map((ep) => ({
    id: String(ep.id),
    number: Number(ep.index ?? 0) + 1,
    name: ep.name ?? `EP ${Number(ep.index ?? 0) + 1}`,
    thumbnail: ep.thumbnail ?? null,
    isPaywalled: !!ep.isCharge,
    sources: (ep.sources ?? []).map((s) => ({
      url: s.url,
      quality: s.quality,
      cdn: s.cdn,
      isDefault: s.isDefault,
      isVip: s.isVip,
      mime: "video/mp4",
      expiresAtEpoch: s as any as number, // ignore if not present
    })) as PlayerSource[],
  }));

  const meta = j.meta ?? {};
  return {
    id: meta.bookId ?? bookId,
    title: meta.bookName ?? "Judul",
    cover: meta.bookCover ?? null,
    description: meta.description ?? "",
    tags: meta.tags ?? [],
    playCount: meta.playCount,
    chapterCount: meta.chapterCount ?? eps.length,
    corner: meta.corner,
    orientation: meta.orientation ?? "portrait",
    aspectRatio: "9:16",
    uiHints: {
      primaryColor: meta.corner?.color ?? "#4D65ED",
      defaultQuality: 720,
      showQualitySelector: true,
      showEpisodeList: true,
      layout: "portrait-drama",
    },
    episodes: eps,
  };
}

export function useDramaDetail(bookId: string, initialIndex = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    bookId ? `/api/dramabox/chapters/${bookId}?index=${initialIndex}` : null,
    getJson,
    { revalidateOnFocus: false, dedupingInterval: 1000 }
  );

  const detail: DramaDetail | null = data ? toDetail(bookId, data) : null;
  return { detail, isLoading, isError: !!error, refresh: () => mutate() };
}
