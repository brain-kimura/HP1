import { supabase, getSupabaseAdmin } from "./supabase";
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

const TABLE = "news";

// Supabase の行（snake_case）を NewsItem（camelCase）へ変換
type NewsRow = {
  id: string;
  title: string;
  category: string;
  body: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

function rowToItem(row: NewsRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as NewsCategory,
    body: row.body,
    // date 型は "YYYY-MM-DD" 文字列で返る
    publishedAt: row.published_at,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(input: NewsInput) {
  return {
    title: input.title,
    category: input.category,
    body: input.body,
    published_at: input.publishedAt,
    is_published: input.isPublished,
  };
}

// 掲載日の降順、同日なら作成日時の降順
const ORDER = "published_at.desc,created_at.desc";

/** 管理画面用: すべてのお知らせ（下書き含む）を新しい順で取得 */
export async function getAllNews(): Promise<NewsItem[]> {
  // 下書きも含めるため RLS をバイパスする admin クライアントを使用
  const client = getSupabaseAdmin() ?? supabase;
  if (!client) return [];
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as NewsRow[]).map(rowToItem);
}

/** 公開側用: 公開中のお知らせのみを新しい順で取得 */
export async function getPublishedNews(limit?: number): Promise<NewsItem[]> {
  if (!supabase) return [];
  let query = supabase
    .from(TABLE)
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (typeof limit === "number") query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as NewsRow[]).map(rowToItem);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  // 管理画面の編集でも使うため、下書きも取得できる admin クライアントを優先
  const client = getSupabaseAdmin() ?? supabase;
  if (!client) return null;
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToItem(data as NewsRow);
}

export async function createNews(input: NewsInput): Promise<NewsItem> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error(
      "Supabase の書き込み設定（SUPABASE_SERVICE_ROLE_KEY）がありません。",
    );
  }
  const { data, error } = await admin
    .from(TABLE)
    .insert(inputToRow(input))
    .select("*")
    .single();
  if (error || !data) {
    throw new Error(error?.message ?? "お知らせの作成に失敗しました。");
  }
  return rowToItem(data as NewsRow);
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<NewsItem | null> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error(
      "Supabase の書き込み設定（SUPABASE_SERVICE_ROLE_KEY）がありません。",
    );
  }
  const { data, error } = await admin
    .from(TABLE)
    .update({ ...inputToRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToItem(data as NewsRow);
}

export async function deleteNews(id: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error(
      "Supabase の書き込み設定（SUPABASE_SERVICE_ROLE_KEY）がありません。",
    );
  }
  const { data, error } = await admin
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
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
