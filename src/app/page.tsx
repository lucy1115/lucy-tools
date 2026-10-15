import Link from "next/link";
import { Note, btnPrimary, btnSecondary } from "@/components/metro";
import HeroBasket from "./HeroBasket";
import { tools } from "./tools";

function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        className={`flex size-10 items-center justify-center rounded-full text-xl font-black ${
          inverted ? "bg-metro text-ink" : "bg-ink text-metro"
        }`}
      >
        L
      </span>
      <span className="text-xl font-black tracking-wide">Lucy Tools</span>
    </Link>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[5px] border-ink bg-metro">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <nav className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full border-[3px] border-ink bg-white px-4 py-1.5 text-sm font-black transition hover:bg-ink hover:text-metro"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto]">
        <div>
          <Logo inverted />
          <p className="mt-3 text-2xl font-black text-metro">今天也加油。</p>
          <p className="font-black">Let&apos;s do it again.</p>
        </div>
        <nav>
          <p className="mb-2 font-black text-metro">工具 Tools</p>
          <ul className="space-y-1 font-bold">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="hover:text-metro hover:underline">
                  {tool.icon} {tool.name}
                  <span className="ml-2 text-white/50">{tool.en}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t-2 border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm font-bold text-white/60">
          © 2026 Lucy Tools · Made with Next.js
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        {/* Hero */}
        <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
          <div className="text-center md:text-left">
            <p className="inline-block rounded-full bg-ink px-4 py-1 text-sm font-black text-metro">
              小工具，大幫手
            </p>
            <h1 className="mt-5 text-6xl font-black tracking-wider sm:text-7xl">今天也加油。</h1>
            <p className="mt-4 text-2xl font-black">Let&apos;s do it again.</p>
            <p className="mt-6 text-lg font-bold leading-relaxed">
              抽獎、專注、問問今天的運勢——
              <br />
              生活裡的小事，交給這個籃子就好。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href="#tools" className={btnPrimary}>
                開始使用
              </a>
              <Link href="/omikuji" className={`${btnSecondary} py-3 text-lg`}>
                先抽支籤 ⛩️
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border-[5px] border-ink bg-white p-4 sm:p-6">
            <HeroBasket />
          </div>
        </section>

        {/* 工具卡片 */}
        <section id="tools" className="scroll-mt-24">
          <h2 className="mb-6 text-center text-3xl font-black">
            籃子裡有什麼？
            <span className="mt-1 block text-lg">What&apos;s in the basket?</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="relative flex flex-col rounded-[28px] border-[5px] border-ink bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-ink)]"
              >
                <div className="halftone mb-4 flex h-32 items-center justify-center rounded-2xl border-[3px] border-ink">
                  <span className="flex size-20 items-center justify-center rounded-full border-[4px] border-ink bg-metro text-4xl">
                    {tool.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-black">{tool.name}</h3>
                <p className="font-black text-ink/60">{tool.en}</p>
                <p className="mt-2 pr-8 font-bold">{tool.description}</p>
                <span className="absolute right-4 bottom-2 text-4xl font-black">{i + 1}</span>
              </Link>
            ))}
          </div>
        </section>

        <Note
          zh={"想用哪個工具，\n點一下格子就能出發。"}
          en="Please choose a tool and tap the panel to get started."
        />
      </main>

      <SiteFooter />
    </>
  );
}
