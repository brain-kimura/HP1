// クライアント/サーバー双方から安全に import できる型・定数のみ

export type Hero = {
  line1: string;
  line2: string;
};

/** Supabase 未設定・行が無い場合のフォールバック（従来の固定文言） */
export const DEFAULT_HERO: Hero = {
  line1: "テクノロジーで、",
  line2: "明日のビジネスを創る",
};

export function validateHeroInput(
  data: unknown,
): { ok: true; value: Hero } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const obj = (data ?? {}) as Record<string, unknown>;

  const line1 = typeof obj.line1 === "string" ? obj.line1.trim() : "";
  const line2 = typeof obj.line2 === "string" ? obj.line2.trim() : "";

  if (!line1) errors.push("1行目を入力してください。");
  if (!line2) errors.push("2行目を入力してください。");
  if (line1.length > 40) errors.push("1行目は40文字以内で入力してください。");
  if (line2.length > 40) errors.push("2行目は40文字以内で入力してください。");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { line1, line2 } };
}
