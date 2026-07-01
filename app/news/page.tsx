import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedNews } from "@/lib/news";
import { formatDateDot } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "お知らせ｜株式会社サンプルテクノロジー",
  description: "株式会社サンプルテクノロジーからのお知らせ一覧です。",
};

export default async function NewsListPage() {
  const news = await getPublishedNews();

  return (
    <>
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            サンプルテクノロジー
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-sm font-semibold tracking-widest text-blue-600">
            NEWS
          </h1>
          <p className="mt-2 text-3xl font-bold">お知らせ</p>

          {news.length === 0 ? (
            <p className="mt-12 text-sm text-gray-500">
              現在お知らせはありません。
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
              {news.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/news/${item.id}`}
                    className="flex flex-col gap-2 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <time className="text-sm text-gray-500">
                      {formatDateDot(item.publishedAt)}
                    </time>
                    <span className="w-fit rounded-full bg-slate-100 px-3 py-0.5 text-xs text-slate-600">
                      {item.category}
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 株式会社サンプルテクノロジー（ダミー会社）
      </footer>
    </>
  );
}
