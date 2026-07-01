import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/news";
import AdminHeader from "../../../_components/AdminHeader";
import NewsForm from "../../../_components/NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <nav className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-blue-600">
            お知らせ管理
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">編集</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold">お知らせを編集</h1>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
          <NewsForm
            mode="edit"
            id={item.id}
            initial={{
              title: item.title,
              category: item.category,
              body: item.body,
              publishedAt: item.publishedAt,
              isPublished: item.isPublished,
            }}
          />
        </div>
      </main>
    </div>
  );
}
