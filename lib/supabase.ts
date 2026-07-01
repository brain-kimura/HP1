import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 読み取り用（公開 anon キー）。未設定なら null。 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * 書き込み用（service_role キー、サーバー専用）。
 * RLS をバイパスするため、認証済みのルートハンドラーからのみ使用すること。
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseAdminConfigured = Boolean(url && serviceRoleKey);
