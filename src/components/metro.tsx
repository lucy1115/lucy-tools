import Link from "next/link";
import type { ReactNode } from "react";

/** 黑底黃字的主要按鈕（不含尺寸，搭配 btnPrimary 或自訂尺寸使用） */
export const btnPrimaryBase =
  "rounded-full border-[4px] border-ink bg-ink py-3 font-black tracking-wider text-metro transition hover:-translate-y-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

export const btnPrimary = `${btnPrimaryBase} px-8 text-lg`;

/** 白底黑框的次要按鈕 */
export const btnSecondary =
  "rounded-full border-[3px] border-ink bg-white px-5 py-2 font-black transition hover:bg-metro active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40";

/** 白底黑框輸入框 */
export const inputBox =
  "w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2 font-bold outline-none focus:ring-4 focus:ring-ink/20 disabled:opacity-60";

/** 海報裡的漫畫格：白底、粗黑框、大圓角，右下角有編號 */
export function Panel({
  number,
  className = "",
  children,
}: {
  number?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative rounded-[28px] border-[5px] border-ink bg-white p-5 sm:p-6 ${className}`}
    >
      {children}
      {number !== undefined && (
        <span className="pointer-events-none absolute right-4 bottom-2 text-4xl font-black leading-none">
          {number}
        </span>
      )}
    </section>
  );
}

/** 海報底部的圓圈說明 */
export function Note({ zh, en }: { zh: string; en: string }) {
  return (
    <footer className="mt-12 grid gap-6 sm:grid-cols-2">
      <div className="flex items-start gap-4">
        <Ring />
        <p className="text-lg font-black leading-relaxed whitespace-pre-line">{zh}</p>
      </div>
      <div className="flex items-start gap-4">
        <Ring />
        <p className="font-black leading-snug">{en}</p>
      </div>
    </footer>
  );
}

function Ring() {
  return <span className="mt-1 size-10 shrink-0 rounded-full border-[9px] border-white bg-[#fde98a]" />;
}

/** 頁面外框：返回鍵、大標題、英文副標 */
export function PosterPage({
  title,
  subtitle,
  width = "max-w-5xl",
  children,
}: {
  title: string;
  subtitle: string;
  width?: string;
  children: ReactNode;
}) {
  return (
    <main className={`mx-auto w-full flex-1 px-4 pt-6 pb-12 ${width}`}>
      <Link
        href="/"
        aria-label="回首頁"
        className="inline-flex size-14 items-center justify-center rounded-2xl bg-white text-3xl font-black transition hover:-translate-y-0.5"
      >
        ←
      </Link>
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black tracking-wider sm:text-7xl">{title}</h1>
        <p className="mt-4 text-xl font-black sm:text-2xl">{subtitle}</p>
      </header>
      {children}
    </main>
  );
}
