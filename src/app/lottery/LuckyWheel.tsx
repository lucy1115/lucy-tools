"use client";

import { useMemo, useState } from "react";
import { Panel, btnPrimary, btnPrimaryBase, btnSecondary, inputBox } from "@/components/metro";

const INK = "#141414";
const YELLOW = "#fcd92a";
const SPIN_MS = 5000;
const C = 220; // 轉盤中心
const SLICE_R = 180; // 扇區半徑
const BULBS = 12;

// 角度以「正上方、順時針」為 0 度
function point(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return [C + radius * Math.sin(rad), C - radius * Math.cos(rad)];
}

function slicePath(start: number, end: number) {
  const [x1, y1] = point(start, SLICE_R);
  const [x2, y2] = point(end, SLICE_R);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${C} ${C} L ${x1} ${y1} A ${SLICE_R} ${SLICE_R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function starPath(cx: number, cy: number, outer: number, inner: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i;
    return `${cx + r * Math.sin(a)},${cy - r * Math.cos(a)}`;
  });
  return `M ${pts.join(" L ")} Z`;
}

export default function LuckyWheel() {
  const [input, setInput] = useState("小明\n小華\n小美\n阿強\n小芳\n大雄\n阿哲\n小婷");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(true);

  const names = useMemo(
    () => input.split("\n").map((n) => n.trim()).filter(Boolean),
    [input],
  );
  const seg = names.length ? 360 / names.length : 360;
  const canSpin = !spinning && names.length >= 2;

  function spin() {
    if (!canSpin) return;
    const index = Math.floor(Math.random() * names.length);
    // 讓被抽中的扇區停在指針（正上方），並在扇區內加一點隨機偏移
    const jitter = (Math.random() - 0.5) * seg * 0.7;
    const target = 360 - ((index + 0.5) * seg + jitter);
    const current = ((rotation % 360) + 360) % 360;
    const delta = ((target - current) % 360 + 360) % 360;
    setWinner(null);
    setSpinning(true);
    setRotation(rotation + 360 * 6 + delta);

    const picked = names[index];
    setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setHistory((h) => [picked, ...h]);
    }, SPIN_MS);
  }

  function removeFromList(name: string) {
    const lines = input.split("\n");
    const i = lines.findIndex((l) => l.trim() === name);
    if (i >= 0) lines.splice(i, 1);
    setInput(lines.join("\n"));
  }

  function closeResult() {
    if (winner && removeWinner) removeFromList(winner);
    setWinner(null);
  }

  // 黃、白交錯；奇數個時最後一塊用網點，避免同色相鄰
  function sliceFill(i: number) {
    if (names.length % 2 && i === names.length - 1) return "url(#dots)";
    return i % 2 ? "#fff" : YELLOW;
  }

  const fontSize = Math.max(11, Math.min(24, 240 / names.length + 6));

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      {/* 名單輸入 */}
      <Panel number={1} className="flex flex-col gap-3 pb-14">
        <label className="text-xl font-black" htmlFor="names">
          抽獎名單（{names.length} 人）
        </label>
        <textarea
          id="names"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={spinning}
          rows={10}
          placeholder="一行輸入一個名字"
          className={`${inputBox} resize-y`}
        />
        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            className="size-5 accent-ink"
          />
          抽中後從名單移除
        </label>
        <button onClick={() => setInput("")} disabled={spinning} className={btnSecondary}>
          清空名單
        </button>

        {history.length > 0 && (
          <div className="mt-3 border-t-[3px] border-dashed border-ink pt-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-black">中獎紀錄</h2>
              <button onClick={() => setHistory([])} className="text-sm font-bold underline">
                清除
              </button>
            </div>
            <ol className="list-decimal space-y-1 pl-6 font-bold">
              {[...history].reverse().map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ol>
          </div>
        )}
      </Panel>

      {/* 轉盤 */}
      <Panel number={2} className="flex flex-col items-center pb-12">
        <svg viewBox="0 -44 440 484" className="w-full max-w-[420px]">
          <defs>
            <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <rect width="7" height="7" fill="#fff" />
              <circle cx="3.5" cy="3.5" r="1.5" fill={INK} />
            </pattern>
          </defs>

          {/* 外框與燈泡 */}
          <circle cx={C} cy={C} r={214} fill={INK} />
          {Array.from({ length: BULBS }, (_, i) => {
            const [x, y] = point((360 / BULBS) * i + 15, 203);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={6}
                fill={YELLOW}
                className={spinning ? "animate-bulb" : undefined}
                style={{ animationDelay: i % 2 ? "0.3s" : "0s" }}
              />
            );
          })}
          <circle cx={C} cy={C} r={192} fill="#fff" />

          {/* 旋轉的盤面 */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${C}px ${C}px`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 1)`
                : "none",
            }}
          >
            {names.length <= 1 ? (
              <circle cx={C} cy={C} r={SLICE_R} fill={YELLOW} stroke={INK} strokeWidth={5} />
            ) : (
              names.map((_, i) => (
                <path
                  key={i}
                  d={slicePath(i * seg, (i + 1) * seg)}
                  fill={sliceFill(i)}
                  stroke={INK}
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
              ))
            )}

            {/* 名字 */}
            {names.map((name, i) => {
              const mid = (i + 0.5) * seg;
              const label = name.length > 7 ? name.slice(0, 7) + "…" : name;
              // 左半邊的字翻轉 180 度，避免上下顛倒
              const flip = mid > 180;
              return (
                <text
                  key={i}
                  x={flip ? C - SLICE_R * 0.6 : C + SLICE_R * 0.6}
                  y={C}
                  transform={`rotate(${flip ? mid + 90 : mid - 90} ${C} ${C})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight={900}
                  fill={INK}
                  stroke="#fff"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {label}
                </text>
              );
            })}
          </g>

          {/* 中心按鈕（點了也能轉） */}
          <g onClick={spin} className={canSpin ? "cursor-pointer" : "cursor-not-allowed"}>
            <circle cx={C} cy={C} r={46} fill={INK} />
            <circle cx={C} cy={C} r={34} fill={YELLOW} />
            <path d={starPath(C, C + 1, 20, 9)} fill={INK} strokeLinejoin="round" />
          </g>

          {/* 指針：電車吊環 */}
          <g>
            <rect x={210} y={-44} width={20} height={34} rx={4} fill="#fff" stroke={INK} strokeWidth={5} />
            <path
              d="M 192 -12 L 248 -12 L 220 46 Z"
              fill="#fff"
              stroke={INK}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <path
              d="M 207 0 L 233 0 L 220 26 Z"
              fill="none"
              stroke={INK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          </g>
        </svg>

        <button onClick={spin} disabled={!canSpin} className={`${btnPrimaryBase} mt-6 px-14 text-2xl`}>
          {spinning ? "轉動中…" : "開始抽獎"}
        </button>
        {names.length < 2 && !spinning && (
          <p className="mt-3 font-bold">名單至少需要 2 個人才能抽獎</p>
        )}
      </Panel>

      {/* 中獎結果 */}
      {winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
          onClick={closeResult}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border-[6px] border-ink bg-metro p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-2xl font-black">恭喜中獎。</p>
            <p className="text-sm font-black">Congratulations!</p>
            <p className="my-6 rounded-2xl border-[4px] border-ink bg-white px-4 py-6 text-4xl font-black break-words">
              {winner}
            </p>
            <button onClick={closeResult} className={btnPrimary}>
              好的
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
