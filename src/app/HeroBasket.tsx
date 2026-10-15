const INK = "#141414";
const YELLOW = "#fcd92a";
const TOMATO = "#ef4b36";

function polar(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];
}

function Wheel() {
  const R = 62;
  return (
    <g transform="translate(158 168) rotate(-8)">
      <circle r={86} fill={INK} />
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = polar(i * 36 + 18, 78);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={YELLOW} />;
      })}
      <circle r={70} fill="#fff" />
      <g className="animate-wheel-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        {Array.from({ length: 8 }, (_, i) => {
          const [x1, y1] = polar(i * 45, R);
          const [x2, y2] = polar((i + 1) * 45, R);
          return (
            <path
              key={i}
              d={`M 0 0 L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
              fill={i % 2 ? "#fff" : YELLOW}
              stroke={INK}
              strokeWidth={4}
              strokeLinejoin="round"
            />
          );
        })}
      </g>
      <circle r={15} fill={INK} />
      <circle r={8} fill={YELLOW} />
      {/* 吊環指針 */}
      <path d="M -13 -94 L 13 -94 L 0 -66 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
}

function Cylinder() {
  return (
    <g transform="translate(292 160) rotate(9)">
      {/* 露出來的籤 */}
      {[-16, -3, 10].map((x, i) => (
        <rect key={x} x={x} y={i === 1 ? -150 : -128} width={9} height={50} rx={2} fill="#fff" stroke={INK} strokeWidth={4} />
      ))}
      <rect x={-38} y={-95} width={76} height={200} rx={12} fill="url(#basketDots)" />
      <rect x={-19} y={-95} width={38} height={200} fill={YELLOW} />
      <line x1={-19} y1={-95} x2={-19} y2={105} stroke={INK} strokeWidth={5} />
      <line x1={19} y1={-95} x2={19} y2={105} stroke={INK} strokeWidth={5} />
      <rect x={-38} y={-95} width={76} height={200} rx={12} fill="none" stroke={INK} strokeWidth={7} />
      <ellipse cx={0} cy={-95} rx={38} ry={9} fill={INK} />
      <text
        x={0}
        y={-10}
        fontSize={22}
        fontWeight={900}
        fill={INK}
        textAnchor="middle"
        style={{ writingMode: "vertical-rl" }}
      >
        御神籤
      </text>
    </g>
  );
}

function TomatoTimer() {
  return (
    <g transform="translate(392 214) rotate(6)">
      <ellipse rx={64} ry={58} fill={TOMATO} stroke={INK} strokeWidth={7} />
      <ellipse cx={-34} cy={-24} rx={11} ry={6} fill="#fff" transform="rotate(-35 -34 -24)" />
      {/* 蒂頭 */}
      <path
        d="M 0 -50 L -26 -66 L -9 -58 L -14 -80 L 0 -62 L 14 -80 L 9 -58 L 26 -66 Z"
        fill={INK}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <rect x={-4} y={-84} width={8} height={18} rx={3} fill={INK} />
      {/* 計時刻度盤 */}
      <circle cx={0} cy={8} r={32} fill="#fff" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = polar(i * 30, 26);
        const [x2, y2] = polar(i * 30, i % 3 ? 22 : 18);
        return <line key={i} x1={x1} y1={y1 + 8} x2={x2} y2={y2 + 8} stroke={INK} strokeWidth={i % 3 ? 2 : 3.5} strokeLinecap="round" />;
      })}
      <line x1={0} y1={8} x2={12} y2={-6} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <circle cx={0} cy={8} r={4} fill={INK} />
    </g>
  );
}

function Sparkle({ x, y, size = 14, delay = "0s" }: { x: number; y: number; size?: number; delay?: string }) {
  const s = size;
  return (
    <path
      d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
      fill={INK}
      className="animate-bulb"
      style={{ animationDelay: delay, animationDuration: "1.6s" }}
    />
  );
}

/** 首頁主視覺：裝著三個小工具的籃子 */
export default function HeroBasket() {
  // 籃身由上往下收窄，編織的直線跟著斜
  const vertical = Array.from({ length: 11 }, (_, i) => {
    const top = 70 + i * 36;
    return { top, bottom: 250 + (top - 250) * 0.8 };
  });

  return (
    <svg viewBox="0 0 500 470" className="w-full" role="img" aria-label="籃子裡裝著轉盤、籤筒和番茄鐘">
      <defs>
        <pattern id="basketDots" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#fff" />
          <circle cx="3.5" cy="3.5" r="1.5" fill={INK} />
        </pattern>
        <clipPath id="basketBody">
          <path d="M 52 300 L 448 300 L 412 440 Q 409 452 396 452 L 104 452 Q 91 452 88 440 Z" />
        </clipPath>
      </defs>

      <Sparkle x={52} y={96} />
      <Sparkle x={470} y={86} size={11} delay="0.5s" />
      <Sparkle x={228} y={40} size={10} delay="1s" />

      {/* 提把（在物品後面） */}
      <path d="M 78 280 C 64 40, 436 40, 422 280" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d="M 78 280 C 64 40, 436 40, 422 280" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" />

      <Wheel />
      <Cylinder />
      <TomatoTimer />

      {/* 籃身 */}
      <path
        d="M 52 300 L 448 300 L 412 440 Q 409 452 396 452 L 104 452 Q 91 452 88 440 Z"
        fill={YELLOW}
      />
      <g clipPath="url(#basketBody)" stroke={INK} strokeWidth={4}>
        {[338, 376, 414].map((y) => (
          <line key={y} x1={40} y1={y} x2={460} y2={y} />
        ))}
        {vertical.map(({ top, bottom }) => (
          <line key={top} x1={top} y1={300} x2={bottom} y2={452} />
        ))}
      </g>
      <path
        d="M 52 300 L 448 300 L 412 440 Q 409 452 396 452 L 104 452 Q 91 452 88 440 Z"
        fill="none"
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />

      {/* 籃口 */}
      <rect x={30} y={266} width={440} height={40} rx={20} fill="#fff" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 17 }, (_, i) => (
        <line
          key={i}
          x1={58 + i * 24}
          y1={274}
          x2={46 + i * 24}
          y2={298}
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      ))}

      {/* 標籤：用繩子綁在籃口上 */}
      <path d="M 150 306 Q 128 344 148 384" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <g transform="rotate(-5 250 384)">
        <path
          d="M 150 356 L 360 356 Q 372 356 372 368 L 372 400 Q 372 412 360 412 L 150 412 L 126 384 Z"
          fill="#fff"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <circle cx={146} cy={384} r={6} fill={YELLOW} stroke={INK} strokeWidth={4} />
        <text x={264} y={386} fontSize={25} fontWeight={900} fill={INK} textAnchor="middle" dominantBaseline="middle">
          Lucy&apos;s 3 Tools
        </text>
      </g>
    </svg>
  );
}
