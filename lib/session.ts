import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** ルートハンドラー内で現在のリクエストが認証済みかを判定 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
