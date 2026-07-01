import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-base font-bold">サンプルテクノロジー</span>
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
              CMS
            </span>
          </Link>
          <nav className="hidden gap-5 text-sm font-medium text-gray-600 sm:flex">
            <Link href="/admin" className="hover:text-blue-600">
              お知らせ管理
            </Link>
            <Link href="/admin/hero" className="hover:text-blue-600">
              ヒーロー見出し
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            サイトを表示 ↗
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
