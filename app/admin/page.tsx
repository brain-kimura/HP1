import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { formatDateJa } from "@/lib/format";
import AdminHeader from "./_components/AdminHeader";
import DeleteNewsButton from "./_components/DeleteNewsButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const news = await getAllNews();
  const publishedCount = news.filter((n) => n.isPublished).length;
  const draftCount = news.length - publishedCount;

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">お知らせ管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              公開 {publishedCount} 件 ／ 下書き {draftCount} 件（全 {news.length} 件）
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ＋ 新規作成
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {news.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-gray-500">
              お知らせがありません。「新規作成」から追加してください。
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">掲載日</th>
                  <th className="px-6 py-3 font-medium">カテゴリー</th>
                  <th className="px-6 py-3 font-medium">タイトル</th>
                  <th className="px-6 py-3 font-medium">状態</th>
                  <th className="px-6 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {formatDateJa(item.publishedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.isPublished ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          公開中
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                          下書き
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                        >
                          編集
                        </Link>
                        <DeleteNewsButton id={item.id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
