export type PlayerSource = {
  url: string;
  quality: number; // 540/720/1080
  cdn: string; // e.g. "nawsvideo.dramaboxdb.com"
  isDefault?: boolean;
  isVip?: boolean;
  mime?: string;
  expiresAtEpoch?: number; // optional
  expiresAtIso?: string; // optional
};

export type Episode = {
  id: string;
  number: number; // 1-based
  name: string;
  thumbnail?: string | null;
  isPaywalled?: boolean;
  sources: PlayerSource[];
};

export type DramaDetail = {
  id: string;
  title: string;
  cover?: string | null;
  description?: string | null;
  tags?: string[];
  playCount?: string;
  chapterCount: number;
  corner?: { name?: string; color?: string };
  orientation: "portrait" | "landscape"; // <- portrait
  aspectRatio?: "9:16" | "16:9" | string; // <- "9:16"
  uiHints?: {
    primaryColor?: string;
    defaultQuality?: number;
    showQualitySelector?: boolean;
    showEpisodeList?: boolean;
    layout?: "portrait-drama" | "default";
  };
  episodes: Episode[];
};
