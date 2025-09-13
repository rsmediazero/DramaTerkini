import useSWRInfinite from "swr/infinite";
import { useEffect } from "react";

type FeedRecord = {
  bookId: string | number;
  [key: string]: unknown;
};

type FeedPage = {
  records?: FeedRecord[];
};

const getJson = (u: string, init?: RequestInit) =>
  fetch(u, { cache: "no-store", ...init }).then((r) => r.json());

export function useFeedInfinite(debouncedQuery: string) {
  const isSearch = debouncedQuery.trim().length > 0;

  const getKey = (pageIndex: number, previousPageData: FeedPage | null) => {
    if (
      pageIndex > 0 &&
      previousPageData &&
      (!previousPageData.records || previousPageData.records.length === 0)
    ) {
      return null;
    }

    if (isSearch) {
      if (pageIndex > 0) return null;
      return ["search", debouncedQuery, 1] as const;
    }

    const pageNo = pageIndex + 1;
    return ["latest", pageNo] as const;
  };

  const fetcher = async (key: readonly unknown[]) => {
    const [mode, a, b] = key as [string, string | number, number?];
    if (mode === "latest") {
      const pageNo = a as number;
      return getJson(`/api/dramabox/latest?pageNo=${pageNo}`);
    }
    const q = a as string;
    const pageNo = (b as number) ?? 1;
    return getJson(`/api/dramabox/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: q, pageNo }),
    });
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 1500,
      initialSize: 1,
      persistSize: true,
      revalidateFirstPage: false, // SWR v2
      // revalidateAll: false, // SWR v1
    }
  );

  useEffect(() => {
    setSize(1);
    mutate(undefined, { revalidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const pages = data ?? [];
  const flat = pages.flatMap((p) => p?.records ?? []);

  // de-dupe by bookId
  const seen = new Set<string>();

  const records = flat.filter((r: FeedRecord) => {
    const id = String(r.bookId);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  const last = pages[pages.length - 1];
  const isReachingEnd = !!last && (!last.records || last.records.length === 0);
  const isLoadingInitial = !data && !error;
  const isLoadingMore = isValidating && size > 0;

  return {
    records,
    isLoadingInitial,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    error,
  };
}
