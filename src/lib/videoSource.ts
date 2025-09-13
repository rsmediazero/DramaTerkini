import { VideoSource } from "@/types/videoSource";

export function mapVideoSources(cdnList: any[] = []): VideoSource[] {
  const out: VideoSource[] = [];
  for (const cdn of cdnList ?? []) {
    const cdnDomain = String(cdn.cdnDomain || "");
    const isDefaultCdn = cdn.isDefault === 1;
    for (const v of cdn.videoPathList ?? []) {
      const q = Number(v.quality ?? 0);
      const url = String(v.videoPath || "");
      if (!url || !q) continue;
      out.push({
        url,
        quality: q,
        cdn: cdnDomain,
        isDefaultCdn,
        isDefaultQuality: v.isDefault === 1,
        isVip: v.isVipEquity === 1,
      });
    }
  }
  // urutkan: default CDN dulu, lalu default quality, lalu kualitas tertinggi
  out.sort((a, b) => {
    if (a.isDefaultCdn !== b.isDefaultCdn) return a.isDefaultCdn ? -1 : 1;
    if (a.isDefaultQuality !== b.isDefaultQuality)
      return a.isDefaultQuality ? -1 : 1;
    return b.quality - a.quality;
  });

  // de-dupe per kualitas pada CDN yang sama (opsional)
  const seen = new Set<string>();
  return out.filter((s) => {
    const k = `${s.cdn}:${s.quality}:${s.url.split("?")[0]}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Pilih awal: pakai preferensi quality kalau ada, fallback ke urutan terbaik
export function pickInitialSource(
  sources: VideoSource[],
  preferQuality?: number
) {
  if (preferQuality) {
    const exact = sources.find((s) => s.quality === preferQuality && !s.isVip);
    if (exact) return exact;
  }
  // non-VIP dulu
  const nonVip = sources.find((s) => !s.isVip);
  return nonVip ?? sources[0] ?? null;
}

// Ambil TTL dari URL signed (Expires=unix)
export function getUrlExpiryMs(url: string) {
  try {
    const u = new URL(url);
    const exp = Number(u.searchParams.get("Expires") ?? 0) * 1000;
    return exp || 0;
  } catch {
    return 0;
  }
}
