/**
 * 簡易ログイン認証。
 * - 認証情報は環境変数 ADMIN_USER / ADMIN_PASSWORD で上書き可能（既定は admin / admin1234）。
 * - ログイン成功時に httpOnly Cookie に「シークレットから導出したトークン」を保存する。
 * - middleware（Edge ランタイム）でも検証できるよう Web Crypto API を使用。
 */

export const SESSION_COOKIE = "bb_admin_session";

const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1234";
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "sample-technology-dev-secret";

/** SHA-256 で 16 進文字列のダイジェストを生成（Node/Edge 両対応） */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** ログイン成功時に Cookie へ保存するセッショントークンを生成 */
export async function createSessionToken(): Promise<string> {
  return sha256Hex(`${ADMIN_USER}:${ADMIN_PASSWORD}:${SESSION_SECRET}`);
}

/** Cookie のトークンが正当かどうかを検証 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  // 長さ差によるタイミングを避けるため単純比較（デモ用途では十分）
  return token === expected;
}

/** ユーザー名・パスワードの照合 */
export function verifyCredentials(user: string, password: string): boolean {
  return user === ADMIN_USER && password === ADMIN_PASSWORD;
}
