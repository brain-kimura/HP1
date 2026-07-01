/** "2026-06-20" → "2026年6月20日" */
export function formatDateJa(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, y, m, d] = match;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** "2026-06-20" → "2026.06.20" */
export function formatDateDot(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, y, m, d] = match;
  return `${y}.${m}.${d}`;
}
