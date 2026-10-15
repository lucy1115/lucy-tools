export type Tier = "good" | "mid" | "bad";

export type Level = {
  name: string;
  reading: string;
  weight: number; // 淺草寺一百支籤中的數量
  tier: Tier;
  summaries: string[];
};

// 淺草寺觀音籤的比例：一百支籤裡凶約佔三成
export const LEVELS: Level[] = [
  {
    name: "大吉",
    reading: "だいきち",
    weight: 17,
    tier: "good",
    summaries: [
      "雲開見月，萬事亨通。今天做什麼都順風順水，把握機會勇敢出手吧！",
      "貴人相助，好運滿滿。心裡想做的事今天就是最好的時機。",
    ],
  },
  {
    name: "吉",
    reading: "きち",
    weight: 35,
    tier: "good",
    summaries: [
      "運勢穩定向上，踏實做事就會有好結果。",
      "平順的一天，保持笑容，好事會慢慢靠近。",
    ],
  },
  {
    name: "半吉",
    reading: "はんきち",
    weight: 5,
    tier: "mid",
    summaries: [
      "好壞參半，凡事做好準備便能化險為夷。",
      "前半天稍有阻礙，後半天漸入佳境。",
    ],
  },
  {
    name: "小吉",
    reading: "しょうきち",
    weight: 4,
    tier: "mid",
    summaries: [
      "小小的幸運藏在日常裡，留心身邊的小確幸。",
      "不求大富大貴，穩穩前進就是福氣。",
    ],
  },
  {
    name: "末小吉",
    reading: "すえしょうきち",
    weight: 3,
    tier: "mid",
    summaries: [
      "好運來得慢一點，但終究會來，別急。",
      "先苦後甘，今天的努力會在之後開花。",
    ],
  },
  {
    name: "末吉",
    reading: "すえきち",
    weight: 6,
    tier: "mid",
    summaries: [
      "眼前平淡，未來可期。耐心等待屬於你的時機。",
      "現在是蓄力的時候，默默耕耘必有收穫。",
    ],
  },
  {
    name: "凶",
    reading: "きょう",
    weight: 30,
    tier: "bad",
    summaries: [
      "烏雲遮月，諸事宜謹慎。低調行事，靜待雲散。",
      "今天不宜冒進，謹言慎行就能平安度過。凶籤綁在架上，厄運就留在這裡。",
    ],
  },
];

export const CATEGORIES: { name: string; text: Record<Tier, string[]> }[] = [
  {
    name: "願望",
    text: {
      good: ["必能如願以償，放膽去做。", "心想事成，貴人會出手相助。"],
      mid: ["會實現，但需要耐心等待時機。", "一步一步來，終會達成。"],
      bad: ["暫時難以實現，先充實自己。", "強求反而不順，先放一放。"],
    },
  },
  {
    name: "疾病",
    text: {
      good: ["很快就會痊癒。", "身體狀況良好，精神飽滿。"],
      mid: ["會好轉，注意休養作息。", "小病無礙，多喝水早點睡。"],
      bad: ["不可輕忽，盡早就醫。", "容易疲累，今天別太勉強。"],
    },
  },
  {
    name: "失物",
    text: {
      good: ["很快就會找到。", "在意想不到的地方出現。"],
      mid: ["晚一些會出現，在身邊仔細找。", "問問身邊的人會有線索。"],
      bad: ["難以尋回，就當作破財消災。", "找不太到，下次多留意。"],
    },
  },
  {
    name: "待人",
    text: {
      good: ["會帶著好消息出現。", "等的人很快就到。"],
      mid: ["會來，但比預期晚。", "主動聯絡會有回音。"],
      bad: ["暫時不會出現。", "別空等，先做自己的事。"],
    },
  },
  {
    name: "搬家・新居",
    text: {
      good: ["一切順利，宜動土遷居。", "新環境帶來新氣象。"],
      mid: ["可以，但要選個好日子。", "多比較幾處再決定。"],
      bad: ["現在不宜，暫緩為佳。", "時機未到，再觀察看看。"],
    },
  },
  {
    name: "戀愛・婚姻",
    text: {
      good: ["良緣天成，順利圓滿。", "桃花正旺，大膽表達心意。"],
      mid: ["慢慢來就會順利。", "多一點體貼，感情會更穩。"],
      bad: ["時機未到，不要勉強。", "容易誤會，說話多想一下。"],
    },
  },
  {
    name: "旅行",
    text: {
      good: ["出門大吉，收穫滿滿。", "說走就走，會有美好的相遇。"],
      mid: ["可以出行，注意小細節。", "行程別排太滿，玩得更開心。"],
      bad: ["不宜遠行，多注意安全。", "出門記得檢查隨身物品。"],
    },
  },
];

export const LUCKY_COLORS = ["朱紅", "金黃", "抹茶綠", "櫻花粉", "藏青", "純白", "紫藤", "橘橙"];
export const LUCKY_ITEMS = ["御守", "手帕", "熱茶", "銅板", "筆記本", "雨傘", "髮夾", "耳機", "書籤", "小點心"];
export const LUCKY_DIRECTIONS = ["東", "南", "西", "北", "東南", "西南", "東北", "西北"];

// 一百支籤，用固定的打散方式讓每個號碼對應一種籤
const SLOTS: number[] = LEVELS.flatMap((l, i) => Array<number>(l.weight).fill(i));
export function levelOf(number: number) {
  return LEVELS[SLOTS[(number * 37) % 100]];
}

const DIGITS = "〇一二三四五六七八九";
export function toKanji(n: number) {
  if (n === 100) return "百";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (tens ? (tens > 1 ? DIGITS[tens] : "") + "十" : "") + (ones ? DIGITS[ones] : "");
}
