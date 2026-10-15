import type { Metadata } from "next";
import { Note, PosterPage } from "@/components/metro";
import Omikuji from "./Omikuji";

export const metadata: Metadata = {
  title: "淺草籤 | Lucy Tools",
  description: "搖動籤筒，抽一支淺草觀音籤看看今天的運勢",
};

export default function OmikujiPage() {
  return (
    <PosterPage title="抽支籤吧。" subtitle="Please draw your fortune." width="max-w-3xl">
      <Omikuji />
      <Note
        zh={"抽到凶籤的時候，\n請綁在籤架上，\n把厄運留下來。"}
        en="Fortunes are just for fun. Please make your own luck today!"
      />
    </PosterPage>
  );
}
