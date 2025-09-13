import type { Item } from "@/types/item";

function compactNumber(n: number) {
  try {
    return new Intl.NumberFormat("id-ID", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    return String(n);
  }
}

function defaultCornerColor(name?: string) {
  if (!name) return "#000000AA";
  const n = name.toLowerCase();
  if (n.includes("terbaru")) return "#4D65ED";
  if (n.includes("hot") || n.includes("anggota")) return "#E94E77";
  return "#000000AA";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapToItem(r: any): Item {
  const tags =
    r.tags ??
    r.tagNames ??
    r.tagList ??
    (Array.isArray(r.tagV3s)
      ? r.tagV3s.map((t: any) => t.tagName).filter(Boolean)
      : []);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const cover = r.coverWap ?? r.cover ?? r.coverUrl ?? r.image ?? r.pic ?? "";

  const chapterCount = r.chapterCount ?? r.episodeCount;

  const play =
    r.playCount ??
    (typeof r.inLibraryCount === "number"
      ? compactNumber(r.inLibraryCount)
      : "");

  let corner: Item["corner"] = undefined;
  if (r.corner && (r.corner.name || r.corner.cornerType !== undefined)) {
    corner = {
      name: r.corner.name ?? undefined,
      color:
        (r.corner.color as string | undefined) ??
        defaultCornerColor(r.corner.name),
    };
  }

  return {
    bookId: String(r.bookId ?? r.id ?? r.contentId),
    bookName: r.bookName ?? r.name ?? r.title ?? r.keyword ?? "",
    coverWap: cover,
    tags,
    playCount: play,
    chapterCount: typeof chapterCount === "number" ? chapterCount : undefined,
    corner,
  };
}
