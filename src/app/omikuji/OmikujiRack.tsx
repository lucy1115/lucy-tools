import { Panel, btnPrimary } from "@/components/metro";

const INK = "#141414";
const YELLOW = "#fcd92a";
const ROWS = [128, 190, 252];
const COLS = 12;
const SLOTS = ROWS.length * COLS;
// 已經綁在架上的別人的籤，讓籤架一開始不會空空的
const OTHERS = 12;

// 打散順序，讓籤平均分布在三排
function slotPosition(i: number) {
  const slot = (i * 7) % SLOTS;
  const row = slot % ROWS.length;
  const col = Math.floor(slot / ROWS.length);
  return { x: 92 + col * 38, y: ROWS[row] };
}

function Knot({ x, y, mine, fresh, label }: { x: number; y: number; mine: boolean; fresh: boolean; label: string }) {
  const fill = mine ? YELLOW : "#fff";
  return (
    <g
      className={fresh ? "animate-tie" : undefined}
      style={{ transformBox: "fill-box", transformOrigin: "center top" }}
    >
      <title>{label}</title>
      {/* 摺成長條的籤紙，繞過橫桿打結 */}
      <rect x={x - 8} y={y - 22} width={16} height={52} rx={3} fill={fill} stroke={INK} strokeWidth={3.5} />
      <path
        d={`M ${x - 16} ${y - 7} L ${x + 16} ${y - 7} L ${x + 11} ${y + 7} L ${x - 11} ${y + 7} Z`}
        fill={fill}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {mine && (
        <text x={x} y={y + 20} fontSize={11} fontWeight={900} textAnchor="middle" fill={INK}>
          凶
        </text>
      )}
    </g>
  );
}

/** 淺草寺的籤架：抽到凶籤可以綁上去 */
export default function OmikujiRack({
  tied,
  canTie,
  onTie,
}: {
  tied: number[];
  canTie: boolean;
  onTie: () => void;
}) {
  // 架子滿了就只顯示最近的籤
  const mine = tied.slice(-(SLOTS - OTHERS));

  return (
    <Panel number={3} className="mt-10 w-full pb-14">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black">籤架</h2>
          <p className="font-black text-ink/60">Omikuji rack</p>
        </div>
        <p className="font-bold">
          你已經綁上 <span className="text-2xl font-black">{tied.length}</span> 支凶籤
        </p>
      </div>

      <svg viewBox="0 0 600 320" className="w-full" role="img" aria-label="綁著籤紙的籤架">
        {/* 屋頂 */}
        <path d="M 8 66 Q 300 4 592 66 L 592 80 L 8 80 Z" fill={INK} />
        <rect x={250} y={28} width={100} height={30} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
        <text x={300} y={45} fontSize={18} fontWeight={900} textAnchor="middle" dominantBaseline="middle" fill={INK}>
          御神籤
        </text>

        {/* 柱子與底座 */}
        <rect x={40} y={80} width={22} height={210} fill={YELLOW} stroke={INK} strokeWidth={5} />
        <rect x={538} y={80} width={22} height={210} fill={YELLOW} stroke={INK} strokeWidth={5} />
        <rect x={20} y={288} width={560} height={18} rx={4} fill={INK} />

        {/* 橫桿 */}
        {ROWS.map((y) => (
          <g key={y}>
            <line x1={62} y1={y - 4} x2={538} y2={y - 4} stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <line x1={62} y1={y + 4} x2={538} y2={y + 4} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}

        {Array.from({ length: OTHERS }, (_, i) => {
          const { x, y } = slotPosition(i);
          return <Knot key={`o${i}`} x={x} y={y} mine={false} fresh={false} label="別人綁的籤" />;
        })}
        {mine.map((number, i) => {
          const { x, y } = slotPosition(OTHERS + i);
          return (
            <Knot
              key={`m${i}-${number}`}
              x={x}
              y={y}
              mine
              fresh={i === mine.length - 1}
              label={`你綁的第 ${number} 番凶籤`}
            />
          );
        })}
      </svg>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        {canTie ? (
          <button onClick={onTie} className={btnPrimary}>
            🪢 把凶籤綁上去
          </button>
        ) : (
          <p className="font-bold">
            {tied.length > 0
              ? "黃色的就是你綁的籤，厄運已經留在這裡了。"
              : "抽到凶籤的時候，可以把它綁在這裡，把厄運留下來。"}
          </p>
        )}
      </div>
    </Panel>
  );
}
