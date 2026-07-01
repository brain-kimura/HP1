import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "株式会社サンプルテクノロジー｜業務システム開発・ITコンサルティング",
  description:
    "株式会社サンプルテクノロジーは、業務システム開発・Webサービス構築・ITコンサルティングを通じて、お客様のビジネス課題を解決します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
