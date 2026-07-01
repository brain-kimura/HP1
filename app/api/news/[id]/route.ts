import { NextResponse } from "next/server";
import {
  deleteNews,
  getNewsById,
  updateNews,
  validateNewsInput,
} from "@/lib/news";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  const { id } = await params;

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

  const item = await updateNews(id, result.value);
  if (!item) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteNews(id);
  if (!ok) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
