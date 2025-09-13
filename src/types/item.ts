export type Corner = { name?: string; color?: string };

export type Item = {
  bookId: string;
  bookName: string;
  coverWap?: string;
  tags?: string[];
  playCount?: string;
  corner?: Corner;
  chapterCount?: number;
};
