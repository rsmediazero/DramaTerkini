"use client";
import { useEffect, useMemo, useRef } from "react";
import Grid from "./components/Grid";
import { useInView } from "@/hooks/useInView";
import { mapToItem } from "@/lib/mapToItem";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useFeedInfinite } from "@/hooks/useFeedInfinite";
import { useDebouncedValue } from "@/hooks/useDeboucedValue";
import { useSearch } from "./components/Providers";

export default function Page() {
  const { query } = useSearch();
  const debounced = useDebouncedValue(query, 500);

  const {
    records,
    isLoadingInitial,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
  } = useFeedInfinite(debounced);

  const items = useMemo(() => records.map(mapToItem), [records]);

  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const seenInView = useRef(false);

  const isSearch = debounced.trim().length > 0;

  useEffect(() => {
    seenInView.current = false;
  }, [isSearch]);

  useEffect(() => {
    if (isSearch) return;
    if (inView && !seenInView.current && !isLoadingMore && !isReachingEnd) {
      seenInView.current = true;
      Promise.resolve(setSize((s) => s + 1)).finally(() => {
        // seenInView.current = false;
      });
    }
    if (!inView) seenInView.current = false;
  }, [isSearch, inView, isLoadingMore, isReachingEnd, setSize]);

  return (
    <main className="py-6 sm:py-8 min-h-screen">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!isSearch && (
          <div className="mb-6 flex gap-3 items-center">
            <DotLottieReact
              src="/dotlottie/Fire.lottie"
              loop
              autoplay
              className="w-24 mr-0 pr-0"
            />
            <div>
              <h2 className="text-2xl mt-4 pl-0 mr-0 font-bold">Terbaru!</h2>
              <p className="text-white/70 mt-1 pl-0 mr-0">
                Nikmati drama <span className="font-semibold">terbaru</span>{" "}
                setiap harinya dengan gratis!
              </p>
            </div>
          </div>
        )}

        <Grid
          items={items}
          isLoading={isLoadingInitial && items.length === 0}
          isSearch={isSearch}
          skeletonCount={12}
          serverFiltered={isSearch}
          q={debounced}
        />

        {isLoadingMore && (
          <DotLottieReact
            src="/dotlottie/loading.lottie"
            loop
            autoplay
            className="py-6 text-center mx-auto"
          />
          // <div className="py-6 text-center text-white/70">Memuat…</div>
        )}

        {!isReachingEnd && <div ref={ref} className="h-10" aria-hidden />}

        {!isSearch && !isReachingEnd && !isLoadingMore && (
          <div className="py-6 text-center">
            <button
              onClick={() => setSize(size + 1)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer active:scale-95 transition"
            >
              Muat lebih banyak
            </button>
          </div>
        )}

        {/* {isReachingEnd && items.length > 0 && (
          <div className="py-6 text-center text-white/50">
            Sudah sampai akhir ✨
          </div>
        )} */}
      </section>
    </main>
  );
}
