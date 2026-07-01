import Link from "next/link";
import AdminHeader from "../../_components/AdminHeader";
import NewsForm from "../../_components/NewsForm";

export const dynamic = "force-dynamic";

export default function NewNewsPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <nav className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-blue-600">
            お知らせ管理
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">新規作成</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold">お知らせを新規作成</h1>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
          <NewsForm
            mode="create"
            initial={{
              title: "",
              category: "お知らせ",
              body: "",
              publishedAt: today,
              isPublished: true,
            }}
          />
        </div>
      </main>
    </div>
  );
}
