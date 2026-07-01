import { supabase, getSupabaseAdmin } from "./supabase";
import { DEFAULT_HERO, type Hero } from "./hero-types";

const TABLE = "hero_content";
const ROW_ID = 1;

/**
 * ヒーロー見出しを取得。
 * Supabase 未設定・行なし・エラー時はデフォルト文言にフォールバックする
 * （DB 障害でトップページが落ちないようにするため）。
 */
export async function getHero(): Promise<Hero> {
  if (!supabase) return DEFAULT_HERO;
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("line1, line2")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error || !data) return DEFAULT_HERO;
    return { line1: data.line1, line2: data.line2 };
  } catch {
    return DEFAULT_HERO;
  }
}

/** ヒーロー見出しを更新（service_role キー使用、要認証） */
export async function updateHero(
  input: Hero,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      error:
        "Supabase の書き込み設定（SUPABASE_SERVICE_ROLE_KEY）がありません。",
    };
  }
  const { error } = await admin.from(TABLE).upsert({
    id: ROW_ID,
    line1: input.line1,
    line2: input.line2,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
