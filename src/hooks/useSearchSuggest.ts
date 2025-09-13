import useSWR from "swr";
import { useDebouncedValue } from "./useDeboucedValue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postJson = (url: string, body: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

export function useSearchSuggest(keyword: string) {
  const debounced = useDebouncedValue(keyword, 500);
  const enabled = debounced.trim().length > 0;

  const { data, error, isLoading } = useSWR(
    enabled ? ["/api/dramabox/search", debounced] : null,
    ([url, kw]) => postJson(url, { keyword: kw }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  return {
    suggestList: data?.suggestList ?? [],
    isLoading: enabled && isLoading,
    isError: !!error,
    debounced,
  };
}
