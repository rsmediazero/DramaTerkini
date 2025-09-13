"use client";
import { useEffect, useState } from "react";
import { useSearch } from "./Providers";
import clsx from "clsx";
import { useDebouncedValue } from "@/hooks/useDeboucedValue";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Header() {
  const { query, setQuery } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const debounced = useDebouncedValue(query, 500);

  useEffect(() => {
    const u = new URL(window.location.href);
    if (debounced) u.searchParams.set("q", debounced);
    else u.searchParams.delete("q");
    window.history.replaceState(null, "", u.toString());
  }, [debounced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className={clsx("glass", scrolled && "glass--scrolled")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="DramaBoxGratis Home"
          >
            {/* <span className="h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-br from-primary-700 to-accent-500 shadow-glow">
              ▶
            </span> */}
            <DotLottieReact
              src="/dotlottie/video-flow.lottie"
              loop
              autoplay
              className="w-24 grid place-items-center rounded-xl bg-gradient-to-br from-primary-700 to-accent-500 shadow-glow"
            />
            <span className="font-display text-xl tracking-tight">
              DramaBox<span className="grad-text">Gratis</span>
            </span>
          </a>

          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 4a6 6 0 104.472 10.033l4.247 4.248 1.414-1.414-4.248-4.247A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari judul atau tag..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl bg-white/5 focus:bg-white/10 transition placeholder:text-white/40 text-white pl-12 pr-24 py-3.5 border border-white/10 focus:outline-none focus:ring-4 focus:ring-primary-700/25 focus:border-white/20"
              />
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/15 active:scale-95 transition cursor-pointer"
              >
                Bersihkan
              </button>
            </div>
            <p className="mt-1.5 text-xs text-white/60">
              {query ? `Hasil untuk “${query}”` : ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
