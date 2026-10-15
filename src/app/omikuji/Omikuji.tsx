"use client";

import { useRef, useState } from "react";
import { Panel, btnPrimary, btnPrimaryBase, btnSecondary } from "@/components/metro";
import OmikujiRack from "./OmikujiRack";
import {
  CATEGORIES,
  LUCKY_COLORS,
  LUCKY_DIRECTIONS,
  LUCKY_ITEMS,
  levelOf,
  toKanji,
  type Level,
} from "./fortunes";

type Stage = "idle" | "shaking" | "stick" | "result";

type Fortune = {
  number: number;
  level: Level;
  summary: string;
  categories: { name: string; text: string }[];
  luckyColor: string;
  luckyItem: string;
  luckyDirection: string;
  luckyNumber: number;
  date: string;
};

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function drawFortune(): Fortune {
  const number = Math.floor(Math.random() * 100) + 1;
  const level = levelOf(number);
  return {
    number,
    level,
    summary: pick(level.summaries),
    categories: CATEGORIES.map((c) => ({ name: c.name, text: pick(c.text[level.tier]) })),
    luckyColor: pick(LUCKY_COLORS),
    luckyItem: pick(LUCKY_ITEMS),
    luckyDirection: pick(LUCKY_DIRECTIONS),
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    date: new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
  };
}

// 籤等的徽章樣式：吉系黃底、中間白底、凶網點
const LEVEL_BADGE = {
  good: "bg-metro",
  mid: "bg-white",
  bad: "halftone",
} as const;

function Cylinder({ stage, number }: { stage: Stage; number?: number }) {
  return (
    <div className={`relative h-64 w-32 ${stage === "shaking" ? "animate-shake" : ""}`}>
      {/* 籤 */}
      {stage === "stick" && number && (
        <div className="animate-stick-out absolute left-1/2 top-0 z-0 flex h-40 w-7 -translate-x-1/2 flex-col items-center rounded-t-md border-[3px] border-ink bg-white pt-1">
          <span className="text-[13px] font-black leading-tight [writing-mode:vertical-rl]">
            第{toKanji(number)}番
          </span>
        </div>
      )}
      {/* 籤筒 */}
      <div className="absolute bottom-0 z-10 flex h-52 w-32 overflow-hidden rounded-xl border-[5px] border-ink">
        <div className="halftone w-1/4 border-r-[3px] border-ink" />
        <div className="flex w-1/2 items-center justify-center bg-metro">
          <span className="text-2xl font-black tracking-widest [writing-mode:vertical-rl]">御神籤</span>
        </div>
        <div className="halftone w-1/4 border-l-[3px] border-ink" />
      </div>
      {/* 筒口 */}
      <div className="absolute bottom-[196px] left-0 z-10 h-5 w-32 rounded-[50%] border-[5px] border-ink bg-ink" />
    </div>
  );
}

export default function Omikuji() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [tied, setTied] = useState(false);
  const [tiedNumbers, setTiedNumbers] = useState<number[]>([]);
  const rackRef = useRef<HTMLDivElement>(null);

  function tie() {
    if (!fortune || tied) return;
    setTied(true);
    setTiedNumbers((list) => [...list, fortune.number]);
    rackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function draw() {
    if (stage === "shaking" || stage === "stick") return;
    const f = drawFortune();
    setFortune(f);
    setTied(false);
    setStage("shaking");
    setTimeout(() => setStage("stick"), 1600);
    setTimeout(() => setStage("result"), 3000);
  }

  const busy = stage === "shaking" || stage === "stick";

  return (
    <div className="flex flex-col items-center">
      {stage !== "result" && (
        <Panel number={1} className="flex w-full flex-col items-center py-10">
          <p className="mb-14 text-center text-xl font-black">
            {stage === "idle" && "誠心默念想問的事，然後搖動籤筒。"}
            {stage === "shaking" && "搖呀搖……"}
            {stage === "stick" && fortune && `抽到了第 ${fortune.number} 番籤！`}
          </p>
          <Cylinder stage={stage} number={fortune?.number} />
          <button onClick={draw} disabled={busy} className={`${btnPrimaryBase} mt-10 px-12 text-xl`}>
            {busy ? "抽籤中…" : "搖籤筒"}
          </button>
        </Panel>
      )}

      {stage === "result" && fortune && (
        <div className="animate-unfold w-full origin-top">
          <div className="relative">
          <Panel number={2} className={`pb-14 ${tied ? "opacity-50 grayscale" : ""}`}>
            <header className="mb-6 flex items-start justify-between gap-4 border-b-[4px] border-ink pb-5">
              <div>
                <p className="font-black tracking-[0.3em]">淺草觀音靈籤</p>
                <p className="mt-1 text-3xl font-black">第{toKanji(fortune.number)}番</p>
                <p className="mt-1 text-sm font-black text-ink/60">No. {fortune.number}</p>
              </div>
              <div
                className={`flex size-28 shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-ink ${LEVEL_BADGE[fortune.level.tier]}`}
              >
                <span
                  className={`font-black leading-none ${fortune.level.name.length > 2 ? "text-2xl" : "text-4xl"} ${
                    fortune.level.tier === "bad" ? "rounded-md bg-white px-1" : ""
                  }`}
                >
                  {fortune.level.name}
                </span>
                <span className={`mt-1 text-[10px] font-bold ${fortune.level.tier === "bad" ? "bg-white px-1" : ""}`}>
                  {fortune.level.reading}
                </span>
              </div>
            </header>

            <p className="mb-6 text-xl font-black leading-relaxed">{fortune.summary}</p>

            <dl className="mb-6 grid gap-3 sm:grid-cols-2">
              {fortune.categories.map((c) => (
                <div key={c.name} className="flex gap-3 rounded-2xl border-[3px] border-ink p-3">
                  <dt className="shrink-0 self-start rounded-full bg-ink px-2.5 py-0.5 text-sm font-black text-metro">
                    {c.name}
                  </dt>
                  <dd className="font-bold">{c.text}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border-[3px] border-ink bg-metro p-4 sm:grid-cols-4">
              {[
                ["幸運色", fortune.luckyColor],
                ["幸運物", fortune.luckyItem],
                ["幸運方位", fortune.luckyDirection],
                ["幸運數字", fortune.luckyNumber],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-lg font-black">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 font-bold">{fortune.date}</p>
          </Panel>
          {/* 印章放在卡片外層，才不會跟著變灰 */}
          {tied && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="rotate-[-8deg] rounded-2xl border-[5px] border-ink bg-white px-6 py-3 text-2xl font-black">
                已綁在籤架上
              </p>
            </div>
          )}
          </div>

          {fortune.level.tier === "bad" && (
            <p className="mt-4 text-center font-black">
              {tied
                ? "厄運已經留在這裡了，好運會跟著你走！"
                : "抽到凶也別擔心！在淺草寺，把凶籤綁在籤架上，厄運就會留在寺裡。"}
            </p>
          )}

          <div className="mt-6 flex justify-center gap-3">
            {fortune.level.tier === "bad" && !tied && (
              <button onClick={tie} className={btnSecondary}>
                🪢 把凶籤綁起來
              </button>
            )}
            <button onClick={draw} className={btnPrimary}>
              再抽一次
            </button>
          </div>
        </div>
      )}

      <div ref={rackRef} className="w-full">
        <OmikujiRack
          tied={tiedNumbers}
          canTie={stage === "result" && fortune?.level.tier === "bad" && !tied}
          onTie={tie}
        />
      </div>
    </div>
  );
}
