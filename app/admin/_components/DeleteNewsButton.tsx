"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteNewsButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${title}」を削除します。よろしいですか?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("削除に失敗しました。");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:opacity-60"
    >
      {loading ? "削除中..." : "削除"}
    </button>
  );
}
