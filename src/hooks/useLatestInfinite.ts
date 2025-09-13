import useSWRInfinite from "swr/infinite";

const fetcher = (u: string) =>
  fetch(u, { cache: "no-store" }).then((r) => r.json());

const getKey = (pageIndex: number, previousPageData: any) => {
  if (
    previousPageData &&
    (!previousPageData.records || previousPageData.records.length === 0)
  ) {
    return null; // stop
  }
  const pageNo = pageIndex + 1;
  return `/api/dramabox/latest?pageNo=${pageNo}`;
};

export function useLatestInfinite() {
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
      initialSize: 1,
    }
  );

  const pages = data ?? [];
  const flatRecords: any[] = pages.flatMap((p) => p?.records ?? []);

  const seen = new Set<string>();
  const uniqueRecords = flatRecords.filter((r) => {
    const id = String(r.bookId);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  const isLoadingInitial = !data && !error;
  const lastPage = pages[pages.length - 1];
  const isReachingEnd =
    !!lastPage && (!lastPage.records || lastPage.records.length === 0);
  const isLoadingMore = isValidating && size > 0;

  return {
    records: uniqueRecords,
    isLoadingInitial,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    mutate,
    error,
  };
}
