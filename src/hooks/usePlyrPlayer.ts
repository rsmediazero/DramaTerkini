"use client";

import { useEffect, useRef } from "react";
import type { PlayerSource } from "@/types/drama";

type Opts = {
  poster?: string | null;
  orientation?: "portrait" | "landscape";
  defaultQuality?: number | null;
  controls?: string[];
};

export function usePlyrPlayer(
  videoRef: React.MutableRefObject<HTMLVideoElement | null>,
  sources: PlayerSource[],
  opts?: Opts
) {
  const playerRef = useRef<any>(null);

  // Init Plyr sekali saat <video> siap
  useEffect(() => {
    const el = videoRef.current;
    if (!el || playerRef.current) return;

    let mounted = true;
    (async () => {
      const [{ default: Plyr }] = await Promise.all([import("plyr")]);
      if (!mounted) return;

      playerRef.current = new Plyr(el, {
        ratio: opts?.orientation === "portrait" ? "9:16" : "16:9",
        clickToPlay: true,
        autopause: true,
        controls: opts?.controls ?? [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
          "quality",
        ],
        // Quality menu untuk HTML5 MP4 akan aktif kalau ada <source size=...>
        quality: {
          default: opts?.defaultQuality ?? 720,
          options: [], // akan diisi otomatis dari 'size'
          forced: true,
        },
      });
    })();

    return () => {
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  // Ganti sumber setiap kali daftar MP4 berubah
  useEffect(() => {
    const video = videoRef.current;
    const player = playerRef.current;
    if (!video || !player) return;

    // Bersihkan poster & isi ulang
    if (opts?.poster) video.setAttribute("poster", opts.poster);
    else video.removeAttribute("poster");

    // Jika kosong → reset
    if (!sources || sources.length === 0) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      return;
    }

    // Susun sources MP4 (pastikan di layer atas kamu sudah filter per-CDN
    // agar tiap 'quality' (size) unik)
    const uniqByQuality = new Map<number, PlayerSource>();
    for (const s of sources) {
      if (!uniqByQuality.has(s.quality)) uniqByQuality.set(s.quality, s);
    }
    const sorted = Array.from(uniqByQuality.values())
      // .filter((s) => !s.isVip) // <-- opsional: sembunyikan VIP
      .sort((a, b) => b.quality - a.quality); // tinggi → rendah

    const plyrSources = sorted.map((s) => ({
      src: s.url,
      type: s.mime || "video/mp4",
      size: s.quality, // << penting untuk menu Quality
    }));

    const keepTime = Number.isFinite(player.currentTime)
      ? player.currentTime
      : 0;
    const wasPlaying = !!player.playing;

    // Set sumber ke Plyr
    player.source = {
      type: "video",
      title: "",
      poster: opts?.poster ?? undefined,
      sources: plyrSources,
      // previewThumbnails & tracks kalau ada:
      // previewThumbnails: { src: "/thumbnails.vtt" },
      // tracks: [{ kind: "captions", label: "ID", srclang: "id", src: "/cap.vtt", default: true }],
    };

    // Atur default quality (kalau ada)
    const defaultQ = opts?.defaultQuality ?? sorted[0]?.quality;
    if (defaultQ) {
      try {
        player.quality = defaultQ;
      } catch {}
    }

    // Restore posisi & play jika sebelumnya playing
    player.once("loadeddata", () => {
      try {
        player.currentTime = keepTime;
      } catch {}
      if (wasPlaying) player.play().catch(() => {});
    });

    // Fallback: kalau error, turun ke kualitas berikutnya (lebih rendah)
    let tried = new Set<number>();
    const onError = () => {
      const qualList = sorted.map((s) => s.quality).sort((a, b) => b - a);
      const current = Number(player.quality) || defaultQ || qualList[0];
      tried.add(current);
      const next = qualList.find((q) => !tried.has(q));
      if (next) {
        try {
          player.quality = next;
        } catch {}
      }
    };
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("error", onError);
    };
  }, [JSON.stringify(sources), opts?.poster, opts?.defaultQuality, videoRef]);

  return { player: playerRef.current as any };
}
