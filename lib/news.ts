import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  NEWS_CATEGORIES,
  type NewsCategory,
  type NewsItem,
  type NewsInput,
} from "./news-types";

export {
  NEWS_CATEGORIES,
  type NewsCategory,
  type NewsItem,
  type NewsInput,
};

const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");

async function readAll(): Promise<NewsItem[]> {
  try {
    const raw = await fs.readFile(NEWS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NewsItem[]) : [];
  } catch (err: unknown) {
    // ファイルが無い場合は空配列で初期化
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(NEWS_FILE, "[]", "utf-8");
      return [];
    }
    throw err;
  }
}

async function writeAll(items: NewsItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(NEWS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

function sortByPublishedDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

/** 管理画面用: すべてのお知らせ（下書き含む）を新しい順で取得 */
export async function getAllNews(): Promise<NewsItem[]> {
  return sortByPublishedDesc(await readAll());
}

/** 公開側用: 公開中のお知らせのみを新しい順で取得 */
export async function getPublishedNews(limit?: number): Promise<NewsItem[]> {
  const published = sortByPublishedDesc(
    (await readAll()).filter((n) => n.isPublished),
  );
  return typeof limit === "number" ? published.slice(0, limit) : published;
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const items = await readAll();
  return items.find((n) => n.id === id) ?? null;
}

export async function createNews(input: NewsInput): Promise<NewsItem> {
  const items = await readAll();
  const now = new Date().toISOString();
  const item: NewsItem = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  items.push(item);
  await writeAll(items);
  return item;
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<NewsItem | null> {
  const items = await readAll();
  const index = items.findIndex((n) => n.id === id);
  if (index === -1) return null;
  const updated: NewsItem = {
    ...items[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteNews(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((n) => n.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}

/** 入力値を検証して NewsInput に整形。エラーがあればメッセージ配列を返す */
export function validateNewsInput(
  data: unknown,
): { ok: true; value: NewsInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const obj = (data ?? {}) as Record<string, unknown>;

  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  if (!title) errors.push("タイトルを入力してください。");
  if (title.length > 100) errors.push("タイトルは100文字以内で入力してください。");

  const category = obj.category;
  if (!NEWS_CATEGORIES.includes(category as NewsCategory)) {
    errors.push("カテゴリーが不正です。");
  }

  const body = typeof obj.body === "string" ? obj.body.trim() : "";
  if (!body) errors.push("本文を入力してください。");

  const publishedAt =
    typeof obj.publishedAt === "string" ? obj.publishedAt.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    errors.push("掲載日は YYYY-MM-DD 形式で入力してください。");
  }

  const isPublished = Boolean(obj.isPublished);

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      title,
      category: category as NewsCategory,
      body,
      publishedAt,
      isPublished,
    },
  };
}
