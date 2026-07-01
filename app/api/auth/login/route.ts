import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  verifyCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: { user?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストが不正です。" },
      { status: 400 },
    );
  }

  const user = (body.user ?? "").trim();
  const password = body.password ?? "";

  if (!verifyCredentials(user, password)) {
    return NextResponse.json(
      { error: "ユーザー名またはパスワードが正しくありません。" },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8時間
  });
  return response;
}
