import { NextResponse } from "next/server";
import { getHero, updateHero } from "@/lib/hero";
import { validateHeroInput } from "@/lib/hero-types";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  const hero = await getHero();
  return NextResponse.json({ hero });
}

export async function PUT(request: Request) {
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

  const result = validateHeroInput(payload);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const saved = await updateHero(result.value);
  if (!saved.ok) {
    return NextResponse.json({ errors: [saved.error] }, { status: 500 });
  }
  return NextResponse.json({ hero: result.value });
}
