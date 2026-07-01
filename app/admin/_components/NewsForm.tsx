"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news-types";

export type NewsFormValues = {
  title: string;
  category: NewsCategory;
  body: string;
  publishedAt: string;
  isPublished: boolean;
};

export default function NewsForm({
  mode,
  id,
  initial,
}: {
  mode: "create" | "edit";
  id?: string;
  initial: NewsFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<NewsFormValues>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof NewsFormValues>(
    key: K,
    value: NewsFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const url = mode === "create" ? "/api/news" : `/api/news/${id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(
          data.errors || [data.error || "保存に失敗しました。"],
        );
        return;
      }
      router.push("/admin");
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          maxLength={100}
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            カテゴリー
          </label>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value as NewsCategory)}
            className={inputClass}
          >
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            掲載日
          </label>
          <input
            type="date"
            value={values.publishedAt}
            onChange={(e) => update("publishedAt", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">本文</label>
        <textarea
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          rows={10}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-400">
          改行はそのまま反映されます。
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublished"
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => update("isPublished", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="isPublished" className="text-sm text-gray-700">
          公開する（チェックを外すと下書きとして保存）
        </label>
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
          キャンセル
        </Link>
      </div>
    </form>
  );
}
