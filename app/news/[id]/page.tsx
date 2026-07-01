import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsById } from "@/lib/news";
import { formatDateJa } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item || !item.isPublished) return { title: "お知らせ" };
  return {
    title: `${item.title}｜株式会社サンプルテクノロジー`,
    description: item.body.slice(0, 100),
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(id);
  // 非公開・存在しないものは 404
  if (!item || !item.isPublished) notFound();

  return (
    <>
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            サンプルテクノロジー
          </Link>
          <Link href="/news" className="text-sm font-medium hover:text-blue-600">
            お知らせ一覧
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <time>{formatDateJa(item.publishedAt)}</time>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs text-slate-600">
              {item.category}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-snug">{item.title}</h1>

          <div className="mt-8 whitespace-pre-wrap leading-relaxed text-gray-700">
            {item.body}
          </div>

          <div className="mt-16 border-t border-black/10 pt-8">
            <Link
              href="/news"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← お知らせ一覧へ戻る
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 株式会社サンプルテクノロジー（ダミー会社）
      </footer>
    </>
  );
}
