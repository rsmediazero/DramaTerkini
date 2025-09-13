"use client";
import { useCallback, useEffect, useRef } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Init sekali
  useEffect(() => {
    const el = videoRef.current;
    if (!el || playerRef.current) return;
    const mounted = true;
    (async () => {
      const [{ default: Plyr }] = await Promise.all([import("plyr")]);
      if (!mounted) return;
      playerRef.current = new Plyr(el, {
        ratio: opts?.orientation === "portrait" ? "9:16" : "16:9",
        autopause: true,
        clickToPlay: true,
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
        ],
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

  // Utility: unik per kualitas + urut desc
  const uniqOrdered = (list: PlayerSource[]) => {
    const m = new Map<number, PlayerSource>();
    for (const s of list) if (!m.has(s.quality)) m.set(s.quality, s);
    return Array.from(m.values()).sort((a, b) => b.quality - a.quality);
  };

  // Set sumber default saat sources berubah
  useEffect(() => {
    const p = playerRef.current;
    const v = videoRef.current;
    if (!p || !v) return;

    // poster
    if (opts?.poster) v.setAttribute("poster", opts.poster);
    else v.removeAttribute("poster");

    if (!sources?.length) {
      v.pause();
      v.removeAttribute("src");
      v.load();
      return;
    }

    // pasang semua kualitas (biar nanti bisa dipakai juga)
    const ordered = uniqOrdered(sources);
    const plyrSources = ordered.map((s) => ({
      src: s.url,
      type: s.mime || "video/mp4",
      size: s.quality,
    }));

    const keep = Number.isFinite(p.currentTime) ? p.currentTime : 0;
    const was = !!p.playing;

    p.source = {
      type: "video",
      poster: opts?.poster ?? undefined,
      sources: plyrSources,
    };

    // pilih default / tertinggi
    const defQ = opts?.defaultQuality ?? ordered[0]?.quality;
    p.once("loadeddata", () => {
      try {
        p.currentTime = keep;
      } catch {}
      if (defQ) {
        try {
          p.quality = defQ;
        } catch {}
      }
      if (was) p.play().catch(() => {});
    });
  }, [JSON.stringify(sources), opts?.poster, opts?.defaultQuality, videoRef]);

  // >>> Fungsi utama: ganti ke kualitas tertentu dengan hard switch sumber
  const switchQuality = useCallback(
    (q: number) => {
      const p = playerRef.current;
      const v = videoRef.current;
      if (!p || !v || !sources?.length) return;

      const ordered = uniqOrdered(sources);
      const target = ordered.find((s) => s.quality === q) ?? ordered[0];
      if (!target) return;

      const keep = Number.isFinite(p.currentTime) ? p.currentTime : 0;
      const was = !!p.playing;

      // set hanya satu source (yang dipilih) → pasti pindah
      p.source = {
        type: "video",
        poster: opts?.poster ?? undefined,
        sources: [
          {
            src: target.url,
            type: target.mime || "video/mp4",
            size: target.quality,
          },
        ],
      };

      console.log("Switch Quality To :", target.quality);

      const onLoaded = () => {
        try {
          p.currentTime = keep;
        } catch {}
        if (was) p.play().catch(() => {});
        v.removeEventListener("loadeddata", onLoaded);
      };
      v.addEventListener("loadeddata", onLoaded, { once: true });
    },
    [videoRef, JSON.stringify(sources), opts?.poster]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { player: playerRef.current as any, switchQuality };
}
