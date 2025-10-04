"use client";
import { use as usePromise } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = usePromise(params);
  return <WatchClient bookId={bookId} />;
}

/* ================= CLIENT ================= */

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDramaDetail } from "@/hooks/useDramaDetail";
import { usePlyrPlayer } from "@/hooks/usePlyrPlayer";
import type { PlayerSource } from "@/types/drama";
import { useDramaChaptersInfinite } from "@/hooks/useDramaChaptersInfinite";
import Image from "next/image";
import Iklan from "@/app/components/Iklan";
import Head from "next/head";

export function WatchClient({ bookId }: { bookId: string }) {
  const { meta, episodes, isLoadingMore, isReachingEnd, loadMore } =
    useDramaChaptersInfinite(bookId);

  const { detail } = useDramaDetail(bookId, 1);
  const [episodeIdx, setEpisodeIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-refresh jika halaman kosong
  useEffect(() => {
    if (!detail && !episodes.length) {
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }, [detail, episodes]);

  // Sync episode count dengan chapterCount
  const expectedCount = detail?.chapterCount ?? 0;
  useEffect(() => {
    if (expectedCount > episodes.length && !isLoadingMore && !isReachingEnd) {
      const diff = expectedCount - episodes.length;
      const loadBatch = async () => {
        for (let i = 0; i < Math.ceil(diff / 30); i++) {
          await loadMore();
          await new Promise((res) => setTimeout(res, 300));
        }
      };
      loadBatch();
    }
  }, [expectedCount, episodes.length, isLoadingMore, isReachingEnd]);

  // safe guards
  const ep = episodes[episodeIdx];
  const cover = meta.bookCover ?? "";
  const poster = ep?.thumbnail || cover || "";

  // --- CDN selection
  const cdnOptions = useMemo(
    () => Array.from(new Set((ep?.sources ?? []).map((s) => s.cdn))),
    [ep?.sources]
  );

  const [cdn, setCdn] = useState<string | null>(null);

  const filteredSources: PlayerSource[] = useMemo(() => {
    const list = ep?.sources ?? [];
    const onCdn = cdn ? list.filter((s) => s.cdn === cdn) : list;
    return onCdn.slice().sort((a, b) => {
      if (!!b.isDefault !== !!a.isDefault) return b.isDefault ? 1 : -1;
      return b.quality - a.quality;
    });
  }, [ep?.sources, cdn]);

  const qualities = useMemo(
    () =>
      Array.from(new Set((filteredSources ?? []).map((s) => s.quality))).sort(
        (a, b) => b - a
      ),
    [filteredSources]
  );

  // Default quality 1080p, fallback 720p
  const defaultQ = useMemo(() => {
    if (qualities.includes(1080)) return 1080;
    if (qualities.includes(720)) return 720;
    return qualities[0] ?? 720;
  }, [qualities]);

  useEffect(() => {
    const def =
      ep?.sources?.find((s) => s.isDefault) ??
      ep?.sources?.slice().sort((a, b) => b.quality - a.quality)[0];
    setCdn(def?.cdn ?? ep?.sources?.[0]?.cdn ?? null);
    setQuality(defaultQ);
  }, [defaultQ, episodeIdx, ep?.sources]);

  const { switchQuality } = usePlyrPlayer(videoRef, filteredSources, {
    poster: ep?.thumbnail ?? detail?.cover ?? null,
    orientation: detail?.orientation ?? "portrait",
    defaultQuality: defaultQ,
    controls: [
      "quality",
      "play",
      "progress",
      "current-time",
      "mute",
      "fullscreen",
      "settings",
      "pip",
      "volume",
    ],
  });

  const [quality, setQuality] = useState<number | undefined>(defaultQ);

  useEffect(() => {
    setQuality(defaultQ);
  }, [defaultQ]);

  const onSetQuality = async (q: number) => {
    setQuality(q);
    if (videoRef.current) switchQuality(q);
  };

  // --- Link viewer state
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUnlock = () => {
    if (password === "rootrsmediazero") {
      setUnlocked(true);
    } else {
      alert("Password salah!");
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{`Tonton ${meta?.bookName ?? "Drama"} - MySite`}</title>
        <meta
          name="description"
          content={meta?.description ?? `Tonton ${meta?.bookName ?? "Drama"}`}
        />
        {meta?.tags?.length && (
          <meta name="keywords" content={meta.tags.join(", ")} />
        )}
      </Head>

      <main className="py-6 sm:py-8 min-h-[91vh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header area */}
          <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">
                Tonton Drama
              </p>
              <h1 className="font-display text-2xl sm:text-3xl leading-tight grad-text">
                {detail?.title ?? "Memuat…"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 border border-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5c5 0 9 5 9 7s-4 7-9 7-9-5-9-7 4-7 9-7zm0 4a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                  {detail?.playCount ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 border border-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
                  </svg>
                  {detail?.chapterCount ?? 0} Episode
                </span>
                {!!detail?.corner?.name && (
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-white"
                    style={{ background: detail.corner.color ?? "#000" }}
                  >
                    {detail.corner.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className={clsx("grid gap-6", "lg:grid-cols-3")}>
            {/* Player */}
            <section className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: poster
                      ? `url('${poster}') center/cover no-repeat`
                      : "linear-gradient(135deg,#4D65ED44,#06B6D444)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <video
                    ref={videoRef}
                    muted
                    className={clsx(
                      "w-full h-full bg-black",
                      detail?.orientation === "portrait"
                        ? "aspect-[9/16]"
                        : "aspect-video"
                    )}
                    playsInline
                    preload="metadata"
                    controls
                  />
                  <div className="absolute inset-x-0 top-0 p-3 sm:p-4">
                    <div className="glass rounded-xl px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">CDN</span>
                        <select
                          value={cdn ?? ""}
                          onChange={(e) => setCdn(e.target.value || null)}
                          className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-xs hover:bg-white/15"
                        >
                          <option value="" className="bg-black">
                            Auto
                          </option>
                          {cdnOptions.map((c) => (
                            <option key={c} value={c} className="bg-black">
                              {c.split(".")[0].toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {qualities.length > 1 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/70">Kualitas</span>
                          <div className="flex items-center gap-1">
                            {qualities.map((q) => (
                              <button
                                key={q}
                                onClick={() => onSetQuality(q)}
                                disabled={q === quality}
                                className={clsx(
                                  "rounded-md px-2 py-1 text-xs border transition",
                                  q === quality
                                    ? "bg-primary/[.25] border-primary/50"
                                    : "bg-white/10 hover:bg-white/15 border-white/15"
                                )}
                              >
                                {q}p
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="ml-auto text-xs text-white/70">
                        {ep ? `${ep.name} — ${detail?.title ?? ""}` : "Memuat…"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-white/80">{detail?.description ?? ""}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(detail?.tags ?? []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link Video Box */}
              <div className="mt-6 glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg">Link Video</h3>
                  <button
                    onClick={() => setShowLinkBox((v) => !v)}
                    className="text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg px-3 py-1"
                  >
                    {showLinkBox ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                {showLinkBox && (
                  <div className="space-y-3">
                    {!unlocked ? (
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="Masukkan password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm"
                        />
                        <button
                          onClick={handleUnlock}
                          className="rounded-lg bg-primary/25 hover:bg-primary/30 border border-primary/50 px-4 py-2 text-sm"
                        >
                          Buka
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-auto pr-2">
                        {episodes.map((e) => {
                          const src = e.sources?.[0]?.url || "";
                          return src ? (
                            <div
                              key={e.id}
                              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                            >
                              <span className="text-xs text-white/80">
                                {e.name}
                              </span>
                              <button
                                onClick={() => copyLink(src)}
                                className={clsx(
                                  "rounded-md px-3 py-1 text-xs border transition",
                                  copied
                                    ? "bg-green-500/25 border-green-500/50"
                                    : "bg-white/10 hover:bg-white/15 border-white/15"
                                )}
                              >
                                {copied ? "Tersalin!" : "Salin"}
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Aside */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg">Pilih Episode</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 max-h-[28rem] overflow-auto pr-1 p-2">
                  {episodes.map((e, i) => (
                    <button
                      key={e.id}
                      onClick={() => setEpisodeIdx(i)}
                      className={clsx(
                        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition",
                        i === episodeIdx && "ring-2 ring-primary"
                      )}
                    >
                      <div className="aspect-video w-full relative">
                        {e.thumbnail && (
                          <Image
                            src={e.thumbnail}
                            alt={`${e.name} thumbnail`}
                            width={256}
                            height={144}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(ev) =>
                              ((ev.currentTarget as HTMLImageElement).src =
                                "/placeholder.png")
                            }
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                        <div className="absolute left-1.5 top-1.5">
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] bg-black/55 border border-white/10">
                            {e.name}
                          </span>
                        </div>
                        <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end">
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-black/55 px-2 py-0.5 rounded-full border border-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7L8 5z" />
                            </svg>
                            Putar
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {!isReachingEnd ? (
                    <>
                      <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2 text-sm transition disabled:opacity-60"
                      >
                        {isLoadingMore ? "Memuat..." : "Muat episode lainnya"}
                      </button>
                      <p className="text-xs text-blue-400 text-center mt-2 italic opacity-80">
                        Klik terlalu cepat akan mengakibatkan error.
                      </p>
                    </>
                  ) : (
                    <p className="text-center text-xs text-white/50">
                      Semua episode sudah dimuat.
                    </p>
                  )}
                </div>
              </div>

              <Iklan key={bookId} className="max-h-fit" />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}