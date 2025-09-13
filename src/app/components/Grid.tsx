"use client";
import { useMemo } from "react";
import Image from "next/image";
import { useSearch } from "./Providers";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Item } from "@/types/item";
import Link from "next/link";

function SkeletonCard() {
  return (
    <article className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.06] shadow-md animate-pulse">
      <div className="relative aspect-[2/3]">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute left-2 top-2 h-5 w-14 rounded-md bg-white/20" />
        <div className="absolute left-2 bottom-2 h-6 w-24 rounded-full bg-black/40 border border-white/10" />
        <div className="absolute right-2 bottom-2 h-4 w-2/3 rounded bg-white/30" />
      </div>
    </article>
  );
}

export default function Grid({
  items,
  isLoading = false,
  isSearch = false,
  skeletonCount = 12,
  serverFiltered = false,
  q = "",
}: {
  items: Item[];
  isLoading?: boolean;
  isSearch?: boolean;
  skeletonCount?: number;
  serverFiltered?: boolean;
  q?: string;
}) {
  const { query } = useSearch();

  const filtered = useMemo(() => {
    if (isLoading) return [];
    if (serverFiltered) return items;
    const s = (q || "").trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (it) =>
        (it.bookName ?? "").toLowerCase().includes(s) ||
        (it.tags ?? []).join(",").toLowerCase().includes(s)
    );
  }, [items, isLoading, q, serverFiltered]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
      {isLoading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))
      ) : filtered.length > 0 ? (
        filtered.map((item) => (
          <Link key={item.bookId} href={`/tonton/${item.bookId}`}>
            <article className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.06] hover:bg-white/[0.08] transition shadow-md hover:shadow-xl cursor-pointer">
              <div className="relative aspect-[2/3]">
                {item.coverWap ? (
                  <Image
                    src={item.coverWap}
                    alt={item.bookName}
                    fill
                    className="absolute inset-0 h-full w-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-accent-500" />
                )}

                <div className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-black/85 to-transparent" />

                {!!item.corner?.name && (
                  <span
                    className="absolute left-2 top-2 inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium text-white"
                    style={{
                      background: item.corner?.color
                        ? item.corner.color == ""
                          ? "#000000AA"
                          : item.corner.color
                        : "#000000AA",
                    }}
                  >
                    {item.corner.name}
                  </span>
                )}

                {!!item.chapterCount && (
                  <span
                    className="absolute right-2 top-2 inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium text-white"
                    style={{
                      background: "#000000AA",
                    }}
                  >
                    {item.chapterCount} Eps
                  </span>
                )}

                {!isSearch && item.playCount && (
                  <span className="absolute left-2 bottom-2 inline-flex items-center gap-1.5 rounded-full bg-black/55 text-white/90 px-2.5 py-1 text-xs border border-white/10 backdrop-blur">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7 4-7 9-7zm0 4a3 3 0 100 6 3 3 0 000-6z" />
                    </svg>
                    <span className="font-medium">{item.playCount ?? "-"}</span>
                  </span>
                )}

                <h3 className="absolute bottom-2 right-2 max-w-[70%] text-right text-sm sm:text-base font-semibold leading-snug text-white">
                  {item.bookName}
                </h3>
              </div>
            </article>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center text-white/60 py-10">
          <DotLottieReact
            src="/dotlottie/notfound.lottie"
            loop
            autoplay
            className="py-6 text-center mx-auto"
          />
          Tidak ada hasil untuk pencarianmu.
        </div>
      )}
    </div>
  );
}
