"use client";

import useSWRInfinite from "swr/infinite";

const fetcher = (u: string) =>
  fetch(u, { cache: "no-store" }).then((r) => r.json());

type EpisodeResp = {
  id: string;
  index: number; // 0-based dari API
  name: string;
  thumbnail?: string | null;
  isCharge?: boolean;
  sources: Array<{
    url: string;
    quality: number;
    cdn: string;
    isDefault?: boolean;
    isVip?: boolean;
  }>;
};

type PageResp = {
  meta?: {
    bookId?: string;
    bookName?: string;
    bookCover?: string;
    playCount?: string;
    corner?: { name?: string; color?: string };
    chapterCount?: number; // total semua episode (boleh hilang di page selain pertama)
    description?: string;
    tags?: string[];
    orientation?: "portrait" | "landscape";
  };
  episodes?: EpisodeResp[]; // chunk (biasanya 5-6 item)
};

export function useDramaChaptersInfinite(bookId: string) {
  const getKey = (pageIndex: number, prevPage: PageResp | null) => {
    if (!bookId) return null;

    // Page pertama
    if (pageIndex === 0) return `/api/dramabox/chapters/${bookId}?index=1`;

    // Kalau page sebelumnya belum ada data, stop
    if (!prevPage) return null;
    const eps = prevPage.episodes ?? [];
    if (eps.length === 0) return null; // habis

    // Ambil index episode terakhir di page sebelumnya (0-based)
    const lastIdx0 = eps[eps.length - 1]?.index ?? -1;

    // Next start param itu 1-based
    const nextStart = lastIdx0 + 2; // (0 -> 2 = EP2; 5 -> 7 = EP7)
    return `/api/dramabox/chapters/${bookId}?index=${nextStart}`;
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite<PageResp>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      // revalidateIfStale: false,
      // revalidateOnReconnect: false,
      // persistSize: true,
      // parallel: true,
      dedupingInterval: 10000,
    }
  );

  const pages = data ?? [];
  const firstMeta = pages[0]?.meta ?? {};

  // gabung + de-dupe
  const all = new Map<string, EpisodeResp>();
  for (const p of pages) {
    for (const e of p.episodes ?? []) all.set(e.id, e);
  }
  const episodes = Array.from(all.values()).sort((a, b) => a.index - b.index);

  // hitung end-state
  const total = firstMeta.chapterCount ?? 0;
  const isEmpty = episodes.length === 0;
  const lastPage = pages[pages.length - 1];
  const lastChunk = lastPage?.episodes ?? [];
  const lastGlobalIdx0 = episodes.length
    ? episodes[episodes.length - 1].index
    : -1;
  const isReachingEnd =
    isEmpty ||
    lastChunk.length === 0 ||
    (total > 0 && lastGlobalIdx0 >= total - 1);

  const isLoadingMore =
    isLoading || (size > 0 && pages && typeof pages[size - 1] === "undefined");

  const loadMore = () => {
    if (!isReachingEnd) setSize((s) => s + 1);
  };

  return {
    meta: firstMeta,
    episodes,
    isLoadingInitial: !data && !error,
    isLoadingMore,
    isReachingEnd,
    isError: !!error,
    loadMore,
  };
}
