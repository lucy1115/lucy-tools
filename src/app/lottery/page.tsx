import type { Metadata } from "next";
import { Note, PosterPage } from "@/components/metro";
import LuckyWheel from "./LuckyWheel";

export const metadata: Metadata = {
  title: "抽獎轉盤 | Lucy Tools",
  description: "輸入名單，轉動轉盤抽出幸運兒",
};

export default function LotteryPage() {
  return (
    <PosterPage title="轉轉看吧。" subtitle="Please spin the wheel.">
      <LuckyWheel />
      <Note
        zh={"抽獎的時候，\n請保持風度，\n誰中都要鼓掌。"}
        en="Please be a good sport and give the winner a big hand."
      />
    </PosterPage>
  );
}
