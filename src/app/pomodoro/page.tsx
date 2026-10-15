import type { Metadata } from "next";
import { Note, PosterPage } from "@/components/metro";
import PomodoroTimer from "./PomodoroTimer";

export const metadata: Metadata = {
  title: "番茄鐘 | Lucy Tools",
  description: "專注 25 分鐘、休息 5 分鐘，讓工作更有效率",
};

export default function PomodoroPage() {
  return (
    <PosterPage title="專心一下。" subtitle="Please focus, then take a break.">
      <PomodoroTimer />
      <Note
        zh={"休息的時候，\n請離開座位，\n喝口水、動一動。\n（空白鍵可以開始／暫停）"}
        en="Every 4 tomatoes, please enjoy a long break. Press Space to start or pause."
      />
    </PosterPage>
  );
}
