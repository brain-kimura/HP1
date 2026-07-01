import Link from "next/link";
import { getPublishedNews } from "@/lib/news";
import { getHero } from "@/lib/hero";
import { formatDateDot } from "@/lib/format";

export const dynamic = "force-dynamic";

const services = [
  {
    title: "業務システム開発",
    description:
      "在庫管理・生産管理・販売管理など、お客様の業務に合わせたオーダーメイドのシステムを設計・開発します。",
  },
  {
    title: "Webサイト・Webサービス制作",
    description:
      "企業サイトからECサイト、業務用Webアプリケーションまで、目的に応じた最適なWebサービスを構築します。",
  },
  {
    title: "ITコンサルティング",
    description:
      "業務フローの可視化から、システム導入計画の策定まで、DX推進を上流工程からサポートします。",
  },
  {
    title: "クラウド導入・運用支援",
    description:
      "クラウド環境の設計・構築・移行から、運用・保守までワンストップで対応します。",
  },
];

const features = [
  {
    title: "豊富な導入実績",
    description: "製造業・流通業・サービス業など、多様な業界での開発実績があります。",
  },
  {
    title: "ワンストップ対応",
    description: "要件定義から設計・開発・運用まで、専任チームが一貫して対応します。",
  },
  {
    title: "柔軟な体制",
    description: "お客様の規模やご予算に合わせて、最適なチーム体制をご提案します。",
  },
];

const companyInfo = [
  { label: "会社名", value: "株式会社サンプルテクノロジー" },
  { label: "設立", value: "2015年4月" },
  { label: "代表者", value: "代表取締役　山田 太郎" },
  { label: "資本金", value: "3,000万円" },
  { label: "従業員数", value: "42名" },
  { label: "所在地", value: "〒100-0001　東京都千代田区千代田1-1　サンプルビル5F" },
  { label: "事業内容", value: "業務システム開発、Webサービス開発、ITコンサルティング" },
];

export default async function Home() {
  const [news, hero] = await Promise.all([getPublishedNews(3), getHero()]);
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="text-lg font-bold tracking-tight">
            サンプルテクノロジー
          </a>
          <nav className="hidden gap-8 text-sm font-medium sm:flex">
            <a href="#news" className="hover:text-blue-600">
              お知らせ
            </a>
            <a href="#services" className="hover:text-blue-600">
              サービス
            </a>
            <a href="#features" className="hover:text-blue-600">
              選ばれる理由
            </a>
            <a href="#company" className="hover:text-blue-600">
              会社概要
            </a>
            <a href="#contact" className="hover:text-blue-600">
              お問い合わせ
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            お問い合わせ
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 px-6 py-28 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold tracking-widest text-blue-200">
              SAMPLE TECHNOLOGY CO., LTD.
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              {hero.line1}
              <br />
              {hero.line2}
            </h1>
            <p className="mt-6 max-w-xl text-blue-100">
              業務システム開発からWebサービス構築、ITコンサルティングまで。
              お客様の課題に寄り添い、最適なソリューションをワンストップでご提供します。
            </p>
            <div className="mt-10 flex gap-4">
              <a
                href="#contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                お問い合わせはこちら
              </a>
              <a
                href="#services"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                サービスを見る
              </a>
            </div>
          </div>
        </section>

        <section id="news" className="border-b border-black/5 bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-widest text-blue-600">
                  NEWS
                </h2>
                <p className="mt-2 text-3xl font-bold">お知らせ</p>
              </div>
              <Link
                href="/news"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                一覧を見る →
              </Link>
            </div>

            {news.length === 0 ? (
              <p className="mt-10 text-sm text-gray-500">
                現在お知らせはありません。
              </p>
            ) : (
              <ul className="mt-10 divide-y divide-black/10 border-y border-black/10 bg-white">
                {news.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.id}`}
                      className="flex flex-col gap-2 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <time className="text-sm text-gray-500">
                        {formatDateDot(item.publishedAt)}
                      </time>
                      <span className="w-fit rounded-full bg-slate-100 px-3 py-0.5 text-xs text-slate-600">
                        {item.category}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section id="services" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-sm font-semibold tracking-widest text-blue-600">SERVICES</h2>
            <p className="mt-2 text-3xl font-bold">サービス紹介</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-black/10 p-8 transition hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-sm font-semibold tracking-widest text-blue-600">
              WHY CHOOSE US
            </h2>
            <p className="mt-2 text-3xl font-bold">選ばれる理由</p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title}>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="company" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-sm font-semibold tracking-widest text-blue-600">COMPANY</h2>
            <p className="mt-2 text-3xl font-bold">会社概要</p>
            <dl className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {companyInfo.map((item) => (
                <div key={item.label} className="grid gap-2 py-4 sm:grid-cols-4">
                  <dt className="font-semibold text-gray-500">{item.label}</dt>
                  <dd className="sm:col-span-3">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contact" className="bg-slate-900 px-6 py-24 text-white">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-sm font-semibold tracking-widest text-blue-300">CONTACT</h2>
            <p className="mt-2 text-3xl font-bold">お問い合わせ</p>
            <p className="mt-4 text-slate-300">
              ご相談・お見積りなど、お気軽にお問い合わせください。
            </p>
            <div className="mt-10 grid gap-6 sm:mx-auto sm:max-w-2xl sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 p-6">
                <p className="text-sm text-slate-400">お電話でのお問い合わせ</p>
                <p className="mt-2 text-2xl font-bold">03-0000-0000</p>
                <p className="mt-1 text-sm text-slate-400">受付時間　平日 9:00〜18:00</p>
              </div>
              <div className="rounded-2xl border border-white/10 p-6">
                <p className="text-sm text-slate-400">メールでのお問い合わせ</p>
                <a
                  href="mailto:info@sample-technology.example.com"
                  className="mt-2 block text-base font-bold text-blue-300 hover:underline"
                >
                  info@sample-technology.example.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 株式会社サンプルテクノロジー（ダミー会社）
      </footer>
    </>
  );
}
