import { NextResponse } from "next/server";
import { createNews, getAllNews, validateNewsInput } from "@/lib/news";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  const items = await getAllNews();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストが不正です。" },
      { status: 400 },
    );
  }

  const result = validateNewsInput(payload);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const item = await createNews(result.value);
  return NextResponse.json({ item }, { status: 201 });
}
