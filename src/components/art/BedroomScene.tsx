/**
 * The finale backdrop of the scroll cinema — a dark, dusk-lit bedroom,
 * drawn entirely in inline SVG.
 *
 * The upper middle of the feature wall is deliberately left empty and
 * softly lit: the framed piece is hung there by the caller, centred on
 * BEDROOM_ART_ANCHOR. Everything else (headboard, bed, nightstands) sits
 * below that zone.
 *
 * Pure presentational — no hooks, no client boundary. Every gradient and
 * filter id is namespaced with `id` so instances can coexist.
 */

/** Centre point (in % of the scene box) the framed piece should sit on. */
export const BEDROOM_ART_ANCHOR = { xPct: 50, yPct: 33 };

export default function BedroomScene({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* ---- walls ---- */}
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241e18" />
          <stop offset="45%" stopColor="#2e2720" />
          <stop offset="100%" stopColor="#1b1611" />
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3126" />
          <stop offset="60%" stopColor="#332b21" />
          <stop offset="100%" stopColor="#282118" />
        </linearGradient>
        {/* warm pool of light on the wall where the art hangs */}
        <radialGradient id={`${id}-artlight`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c78a" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#d9b678" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </radialGradient>
        {/* the two lamp pools */}
        <radialGradient id={`${id}-lamp`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd79a" stopOpacity="0.6" />
          <stop offset="35%" stopColor="#f0bf7d" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#e0a95f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e3bb" />
          <stop offset="100%" stopColor="#d8b479" />
        </linearGradient>

        {/* ---- textiles ---- */}
        <linearGradient id={`${id}-headboard`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#544737" />
          <stop offset="55%" stopColor="#463a2c" />
          <stop offset="100%" stopColor="#332a20" />
        </linearGradient>
        <linearGradient id={`${id}-duvet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ddd3bf" />
          <stop offset="42%" stopColor="#cabfa9" />
          <stop offset="100%" stopColor="#9d9280" />
        </linearGradient>
        <linearGradient id={`${id}-pillow`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#eee6d5" />
          <stop offset="100%" stopColor="#c3b9a6" />
        </linearGradient>
        <linearGradient id={`${id}-throw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a6549" />
          <stop offset="100%" stopColor="#54452f" />
        </linearGradient>

        {/* ---- floor + wood ---- */}
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2c1e" />
          <stop offset="45%" stopColor="#2b2015" />
          <stop offset="100%" stopColor="#1d150e" />
        </linearGradient>
        <linearGradient id={`${id}-stand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#54412d" />
          <stop offset="100%" stopColor="#372a1c" />
        </linearGradient>
        <linearGradient id={`${id}-rug`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e4437" />
          <stop offset="100%" stopColor="#37301a" stopOpacity="0.85" />
        </linearGradient>

        {/* ---- helpers ---- */}
        <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={`${id}-softer`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${id}-plaster`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="4"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.55 0 0 0 0 0.5 0 0 0 0 0.42 0 0 0 0.45 0"
          />
        </filter>
        <radialGradient id={`${id}-vig`} cx="50%" cy="45%" r="72%">
          <stop offset="50%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* ================= WALL ================= */}
      <rect width="1600" height="900" fill={`url(#${id}-wall)`} />

      {/* feature panel behind the bed */}
      <rect x="300" y="0" width="1000" height="648" fill={`url(#${id}-panel)`} />
      <rect x="300" y="0" width="3" height="648" fill="#171310" opacity="0.8" />
      <rect x="1297" y="0" width="3" height="648" fill="#171310" opacity="0.8" />
      <rect x="303" y="0" width="1.5" height="648" fill="#4b4132" opacity="0.5" />

      {/* plaster tooth */}
      <rect
        width="1600"
        height="648"
        filter={`url(#${id}-plaster)`}
        opacity="0.055"
        style={{ mixBlendMode: "overlay" }}
      />

      {/* the warm pool the artwork hangs in (art anchor: 50%, 33%) */}
      <ellipse cx="800" cy="300" rx="470" ry="330" fill={`url(#${id}-artlight)`} />

      {/* ================= FLOOR ================= */}
      <rect x="0" y="648" width="1600" height="252" fill={`url(#${id}-floor)`} />
      {/* boards converging toward the vanishing point */}
      <g stroke="#12100b" strokeWidth="2" opacity="0.5">
        {[-900, -560, -280, -60, 140, 380, 700, 1100, 1600, 2200].map((x, i) => (
          <line key={i} x1={800 + (x - 800) * 0.34} y1="648" x2={x} y2="900" />
        ))}
      </g>
      <g stroke="#5a462f" strokeWidth="1" opacity="0.16">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" y1={676 + i * 58} x2="1600" y2={676 + i * 58} />
        ))}
      </g>
      {/* skirting */}
      <rect x="0" y="626" width="1600" height="24" fill="#2a2119" />
      <rect x="0" y="626" width="1600" height="3" fill="#5d5040" opacity="0.55" />
      {/* wall-to-floor occlusion */}
      <rect
        x="0"
        y="646"
        width="1600"
        height="26"
        fill="#000"
        opacity="0.5"
        filter={`url(#${id}-softer)`}
      />

      {/* rug */}
      <path d="M250 900 L400 742 L1200 742 L1350 900 Z" fill={`url(#${id}-rug)`} opacity="0.9" />
      <path
        d="M250 900 L400 742 L1200 742 L1350 900 Z"
        fill="none"
        stroke="#6b5f4c"
        strokeWidth="2"
        opacity="0.22"
      />

      {/* ================= HEADBOARD ================= */}
      <rect
        x="486"
        y="432"
        width="628"
        height="200"
        fill="#000"
        opacity="0.5"
        filter={`url(#${id}-soft)`}
      />
      <rect x="500" y="438" width="600" height="196" rx="8" fill={`url(#${id}-headboard)`} />
      {/* fluting */}
      <g>
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <rect x={512 + i * 53} y="446" width="42" height="182" rx="18" fill="#4d4132" />
            <rect x={512 + i * 53} y="446" width="9" height="182" rx="4" fill="#5b4d3b" opacity="0.75" />
            <rect x={546 + i * 53} y="446" width="8" height="182" rx="4" fill="#2e261d" opacity="0.7" />
          </g>
        ))}
      </g>
      <rect x="500" y="438" width="600" height="3" rx="1.5" fill="#6d5e48" opacity="0.6" />

      {/* ================= BED ================= */}
      {/* pillows */}
      <g>
        <ellipse cx="640" cy="612" rx="118" ry="46" fill={`url(#${id}-pillow)`} />
        <ellipse cx="960" cy="612" rx="118" ry="46" fill={`url(#${id}-pillow)`} />
        <ellipse cx="800" cy="628" rx="96" ry="34" fill={`url(#${id}-pillow)`} />
      </g>

      {/* mattress + duvet, widening toward the viewer */}
      <path d="M470 640 L1130 640 L1210 792 L390 792 Z" fill={`url(#${id}-duvet)`} />
      {/* duvet folds */}
      <g stroke="#a99e8a" strokeWidth="2.5" fill="none" opacity="0.5">
        <path d="M540 648 Q560 706 528 786" />
        <path d="M700 646 Q712 708 694 790" />
        <path d="M900 646 Q894 706 910 790" />
        <path d="M1060 648 Q1044 704 1076 786" />
      </g>
      {/* turn-down sheet */}
      <path d="M470 640 L1130 640 L1142 672 L462 672 Z" fill="#e6ddca" opacity="0.9" />
      {/* folded throw at the foot */}
      <path d="M410 742 L1190 742 L1206 786 L396 786 Z" fill={`url(#${id}-throw)`} />
      <path d="M410 742 L1190 742 L1192 750 L408 750 Z" fill="#8b7454" opacity="0.6" />
      {/* shadow under the bed */}
      <ellipse
        cx="800"
        cy="800"
        rx="430"
        ry="34"
        fill="#000"
        opacity="0.62"
        filter={`url(#${id}-soft)`}
      />

      {/* ================= NIGHTSTANDS + LAMPS ================= */}
      {[
        { x: 300, lampX: 372 },
        { x: 1160, lampX: 1232 },
      ].map((s) => (
        <g key={s.x}>
          {/* lamp glow on the wall */}
          <circle cx={s.lampX} cy="520" r="230" fill={`url(#${id}-lamp)`} />
          {/* stand */}
          <rect x={s.x} y="620" width="144" height="18" rx="4" fill="#5c4830" />
          <rect x={s.x + 6} y="638" width="132" height="104" fill={`url(#${id}-stand)`} />
          <rect x={s.x + 18} y="662" width="108" height="34" rx="3" fill="#2c2115" opacity="0.75" />
          <circle cx={s.x + 72} cy="712" r="5" fill="#c8a765" opacity="0.8" />
          <rect x={s.x + 14} y="742" width="10" height="26" fill="#2b2016" />
          <rect x={s.x + 120} y="742" width="10" height="26" fill="#2b2016" />
          {/* lamp */}
          <rect x={s.lampX - 4} y="556" width="8" height="64" fill="#3d3223" />
          <path
            d={`M${s.lampX - 48} 556 L${s.lampX - 34} 500 L${s.lampX + 34} 500 L${s.lampX + 48} 556 Z`}
            fill={`url(#${id}-shade)`}
          />
          {/* light spilling from under the shade */}
          <ellipse
            cx={s.lampX}
            cy="566"
            rx="62"
            ry="16"
            fill="#ffe0ab"
            opacity="0.5"
            filter={`url(#${id}-softer)`}
          />
          <ellipse
            cx={s.lampX}
            cy="626"
            rx="86"
            ry="14"
            fill="#ffd79a"
            opacity="0.22"
            filter={`url(#${id}-softer)`}
          />
        </g>
      ))}

      {/* ================= GRADE ================= */}
      <rect width="1600" height="900" fill={`url(#${id}-vig)`} />
    </svg>
  );
}
