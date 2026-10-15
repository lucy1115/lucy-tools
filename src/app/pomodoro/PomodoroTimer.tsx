"use client";

import { useEffect, useRef, useState } from "react";
import { Panel, btnPrimaryBase, btnSecondary } from "@/components/metro";

type Mode = "work" | "short" | "long";

const MODES: Record<Mode, { label: string; en: string }> = {
  work: { label: "專注", en: "Focus" },
  short: { label: "短休息", en: "Short break" },
  long: { label: "長休息", en: "Long break" },
};
const LONG_BREAK_EVERY = 4;
const RING_R = 130;
const RING_LEN = 2 * Math.PI * RING_R;

function format(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = i === 2 ? 1046 : 784;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch {
    // 瀏覽器不支援音效就略過
  }
}

function notify(body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("🍅 番茄鐘", { body });
  }
}

export default function PomodoroTimer() {
  const [durations, setDurations] = useState<Record<Mode, number>>({ work: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<Mode>("work");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [task, setTask] = useState("");
  const [log, setLog] = useState<{ task: string; time: string }[]>([]);
  const endAt = useRef(0);

  const total = durations[mode] * 60;
  const progress = total ? 1 - remaining / total : 0;
  const theme = MODES[mode];

  function switchMode(next: Mode) {
    setMode(next);
    setRemaining(durations[next] * 60);
    setRunning(false);
  }

  function start() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    endAt.current = Date.now() + remaining * 1000;
    setRunning(true);
  }

  function toggle() {
    if (running) setRunning(false);
    else start();
  }

  function reset() {
    setRunning(false);
    setRemaining(total);
  }

  function changeDuration(m: Mode, minutes: number) {
    const value = Math.min(120, Math.max(1, minutes || 1));
    setDurations((d) => ({ ...d, [m]: value }));
    if (m === mode && !running) setRemaining(value * 60);
  }

  // 計時：用結束時間戳計算剩餘秒數，分頁切到背景也不會跑慢
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left > 0) return;

      clearInterval(id);
      playChime();
      let next: Mode = "work";
      if (mode === "work") {
        const count = completed + 1;
        setCompleted(count);
        setLog((l) => [
          { task: task.trim() || "未命名任務", time: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }) },
          ...l,
        ]);
        next = count % LONG_BREAK_EVERY === 0 ? "long" : "short";
        notify(next === "long" ? "辛苦了！來個長休息吧" : "完成一個番茄！休息一下吧");
      } else {
        notify("休息結束，開始專注吧！");
      }
      const secs = durations[next] * 60;
      setMode(next);
      setRemaining(secs);
      endAt.current = Date.now() + secs * 1000;
      setRunning(autoStart);
    }, 250);
    return () => clearInterval(id);
  }, [running, mode, completed, task, durations, autoStart]);

  // 瀏覽器分頁標題顯示倒數
  useEffect(() => {
    const original = document.title;
    document.title = `${format(remaining)} ${theme.label} | 番茄鐘`;
    return () => {
      document.title = original;
    };
  }, [remaining, theme.label]);

  // 空白鍵開始／暫停（在輸入框打字時不觸發）
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code !== "Space" || tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (running) setRunning(false);
      else {
        endAt.current = Date.now() + remaining * 1000;
        setRunning(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, remaining]);

  function skip() {
    // 直接跳到下一段（不計入完成數）
    if (mode !== "work") return switchMode("work");
    switchMode((completed + 1) % LONG_BREAK_EVERY === 0 ? "long" : "short");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      {/* 計時器：專注時白底，休息時網點底 */}
      <Panel
        number={1}
        className={`flex flex-col items-center pb-14 transition-colors ${mode === "work" ? "" : "halftone"}`}
      >
        <div className="mb-8 flex gap-1 rounded-full border-[4px] border-ink bg-white p-1">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 font-black transition ${
                m === mode ? "bg-ink text-metro" : "hover:bg-metro"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-[320px]">
          <svg viewBox="0 0 300 300" className="w-full -rotate-90">
            <circle cx={150} cy={150} r={RING_R + 4} fill="#fff" />
            <circle cx={150} cy={150} r={RING_R} fill="none" stroke="var(--color-ink)" strokeWidth={24} />
            <circle
              cx={150}
              cy={150}
              r={RING_R}
              fill="none"
              stroke="var(--color-metro)"
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={RING_LEN}
              strokeDashoffset={RING_LEN * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-black tabular-nums">{format(remaining)}</span>
            <span className="mt-1 text-lg font-black">
              {mode === "work" ? `第 ${completed + 1} 個番茄` : theme.label}
            </span>
            <span className="text-sm font-black text-ink/60">{theme.en}</span>
          </div>
        </div>

        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="這輪要專注做什麼？"
          className="mt-8 w-full max-w-sm rounded-full border-[4px] border-ink bg-white px-5 py-2 text-center font-bold outline-none focus:ring-4 focus:ring-ink/20"
        />

        <div className="mt-6 flex items-center gap-3">
          <button onClick={reset} className={btnSecondary}>
            重設
          </button>
          <button onClick={toggle} className={`${btnPrimaryBase} w-36 text-xl`}>
            {running ? "暫停" : "開始"}
          </button>
          <button onClick={skip} className={btnSecondary}>
            跳過
          </button>
        </div>
      </Panel>

      {/* 設定與紀錄 */}
      <div className="flex flex-col gap-6">
        <Panel number={2} className="pb-12">
          <h2 className="mb-3 text-xl font-black">今天完成</h2>
          <div className="flex flex-wrap gap-1 text-2xl">
            {completed === 0 ? (
              <span className="text-base font-bold">還沒有番茄，開始第一個吧！</span>
            ) : (
              Array.from({ length: completed }, (_, i) => <span key={i}>🍅</span>)
            )}
          </div>
        </Panel>

        <Panel number={3} className="pb-12">
          <h2 className="mb-3 text-xl font-black">時間設定（分鐘）</h2>
          <div className="flex flex-col gap-2">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <label key={m} className="flex items-center justify-between font-bold">
                {MODES[m].label}
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={durations[m]}
                  onChange={(e) => changeDuration(m, Number(e.target.value))}
                  className="w-20 rounded-xl border-[3px] border-ink px-2 py-1 text-right font-black outline-none focus:bg-metro"
                />
              </label>
            ))}
            <label className="mt-2 flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="size-5 accent-ink"
              />
              時間到自動開始下一段
            </label>
          </div>
        </Panel>

        {log.length > 0 && (
          <Panel number={4} className="pb-12">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-black">專注紀錄</h2>
              <button
                onClick={() => {
                  setLog([]);
                  setCompleted(0);
                }}
                className="text-sm font-bold underline"
              >
                清除
              </button>
            </div>
            <ul className="space-y-1 font-bold">
              {log.map((item, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="truncate">🍅 {item.task}</span>
                  <span className="shrink-0">{item.time}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}

