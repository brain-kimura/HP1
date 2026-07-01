-- ============================================================
-- ヒーロー見出し用テーブル
-- Supabase の SQL Editor に貼り付けて実行してください。
-- ============================================================

-- 1 行だけを持つ設定テーブル（id = 1 固定）
create table if not exists public.hero_content (
  id         integer primary key,
  line1      text not null,
  line2      text not null,
  updated_at timestamptz not null default now()
);

-- 初期値（現在のサイトと同じ文言）を投入。既にあれば何もしない。
insert into public.hero_content (id, line1, line2)
values (1, 'テクノロジーで、', '明日のビジネスを創る')
on conflict (id) do nothing;

-- 行レベルセキュリティを有効化
alter table public.hero_content enable row level security;

-- 公開読み取りを許可（anon / authenticated 双方が SELECT 可能）。
-- 更新は service_role キー経由のみ（RLS をバイパス）で行うため、
-- 書き込み用ポリシーは作成しない。
drop policy if exists "Public read hero_content" on public.hero_content;
create policy "Public read hero_content"
  on public.hero_content
  for select
  using (true);

-- ============================================================
-- お知らせ（News）用テーブル
-- ============================================================

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null,
  body         text not null,
  published_at date not null,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 一覧取得の並び替え（掲載日の降順）を高速化
create index if not exists news_published_at_idx
  on public.news (published_at desc, created_at desc);

alter table public.news enable row level security;

-- 公開中のお知らせのみ anon / authenticated が SELECT 可能。
-- 下書きの閲覧・作成・更新・削除は service_role キー経由（RLS バイパス）で行う。
drop policy if exists "Public read published news" on public.news;
create policy "Public read published news"
  on public.news
  for select
  using (is_published = true);
