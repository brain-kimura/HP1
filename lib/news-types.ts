// クライアント/サーバー双方から安全に import できる型・定数のみを定義（fs などを含めない）

export const NEWS_CATEGORIES = [
  "お知らせ",
  "プレスリリース",
  "イベント",
  "採用",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type NewsItem = {
  id: string;
  title: string;
  category: NewsCategory;
  body: string;
  /** 掲載日 (YYYY-MM-DD) */
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewsInput = {
  title: string;
  category: NewsCategory;
  body: string;
  publishedAt: string;
  isPublished: boolean;
};
