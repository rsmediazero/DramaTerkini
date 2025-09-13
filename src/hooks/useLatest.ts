import useSWR from "swr";

const fetcher = (u: string) =>
  fetch(u, { cache: "no-store" }).then((r) => r.json());

export function useLatest(pageNo = 1) {
  const { data, error, isLoading } = useSWR(
    `/api/dramabox/latest?pageNo=${pageNo}`,
    fetcher,
    { dedupingInterval: 1000, revalidateOnFocus: false }
  );
  return { records: data?.records ?? [], isLoading, isError: !!error };
}
