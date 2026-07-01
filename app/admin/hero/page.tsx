import Link from "next/link";
import { getHero } from "@/lib/hero";
import { isSupabaseConfigured, isSupabaseAdminConfigured } from "@/lib/supabase";
import AdminHeader from "../_components/AdminHeader";
import HeroForm from "../_components/HeroForm";

export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  const hero = await getHero();
  const readOnly = !isSupabaseConfigured;
  const writeMissing = !isSupabaseAdminConfigured;

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <nav className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-blue-600">
            管理トップ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">ヒーロー見出し編集</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold">ヒーロー見出し編集</h1>
        <p className="mt-1 text-sm text-gray-500">
          トップページ上部の大見出し（2行）を編集します。内容は Supabase に保存されます。
        </p>

        {(readOnly || writeMissing) && (
          <div className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {readOnly
              ? "Supabase が未設定のため、現在はデフォルト文言を表示しています。.env.local に接続情報を設定してください。"
              : "SUPABASE_SERVICE_ROLE_KEY が未設定のため、保存できません。.env.local に設定してください。"}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
          <HeroForm initial={hero} />
        </div>
      </main>
    </div>
  );
}
