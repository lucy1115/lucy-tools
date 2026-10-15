import type { Metadata } from "next";
import { Noto_Sans_TC, Nunito } from "next/font/google";
import "./globals.css";

// 英文、數字用圓體 Nunito，中文用思源黑體
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  weight: ["500", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Lucy Tools",
  description: "我的小工具集合",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${nunito.variable} ${notoSansTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
