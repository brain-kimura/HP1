"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Hero } from "@/lib/hero-types";

export default function HeroForm({ initial }: { initial: Hero }) {
  const router = useRouter();
  const [values, setValues] = useState<Hero>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof Hero>(key: K, value: Hero[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors || [data.error || "保存に失敗しました。"]);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setErrors(["通信エラーが発生しました。"]);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <ul className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.map((err, i) => (
            <li key={i}>・{err}</li>
          ))}
        </ul>
      )}
      {saved && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          保存しました。トップページに反映されています。
        </p>
      )}

      {/* プレビュー */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 px-6 py-10 text-white">
        <p className="mb-2 text-xs font-semibold tracking-widest text-blue-200">
          PREVIEW
        </p>
        <p className="text-2xl font-bold leading-tight sm:text-3xl">
          {values.line1 || "（1行目）"}
          <br />
          {values.line2 || "（2行目）"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          見出し 1行目
        </label>
        <input
          type="text"
          value={values.line1}
          onChange={(e) => update("line1", e.target.value)}
          maxLength={40}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          見出し 2行目
        </label>
        <input
          type="text"
          value={values.line2}
          onChange={(e) => update("line2", e.target.value)}
          maxLength={40}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "保存中..." : "保存する"}
        </button>
        <Link
          href="/admin"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          お知らせ管理へ戻る
        </Link>
      </div>
    </form>
  );
}
