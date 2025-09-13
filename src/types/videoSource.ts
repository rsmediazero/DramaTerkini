export type VideoSource = {
  url: string;
  quality: number; // 540/720/1080
  cdn: string; // e.g. "nawsvideo.dramaboxdb.com"
  isDefaultCdn: boolean;
  isDefaultQuality: boolean;
  isVip: boolean;
};
