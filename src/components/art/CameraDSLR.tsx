/**
 * A refined DSLR body drawn in SVG, facing the viewer, with a large
 * lens opening (the hero scene shrinks INTO this lens). The Polaroid
 * print ejects from a slot below the body in the hero sequence.
 * Drawn in a 400×300 box; the lens circle is centred at (200,150) r=92.
 */
export const LENS = { cx: 200, cy: 150, r: 92 };

export default function CameraDSLR({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="cam-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#23262a" />
          <stop offset="50%" stopColor="#141619" />
          <stop offset="100%" stopColor="#0b0c0e" />
        </linearGradient>
        <linearGradient id="cam-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3034" />
          <stop offset="100%" stopColor="#191c1f" />
        </linearGradient>
        <radialGradient id="cam-lens-rim" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#050607" />
          <stop offset="86%" stopColor="#3a3f45" />
          <stop offset="92%" stopColor="#101215" />
          <stop offset="100%" stopColor="#2c3136" />
        </radialGradient>
        <linearGradient id="cam-grip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1b1e21" />
          <stop offset="100%" stopColor="#101214" />
        </linearGradient>
      </defs>

      {/* top plate with prism hump */}
      <path
        d="M120 70 L150 70 L162 52 L238 52 L250 70 L280 70 L280 92 L120 92 Z"
        fill="url(#cam-top)"
      />
      {/* shutter + dial */}
      <circle cx="138" cy="62" r="9" fill="#26292d" />
      <circle cx="138" cy="62" r="5" fill="#c8a765" opacity="0.85" />
      <rect x="252" y="58" width="22" height="8" rx="2" fill="#26292d" />

      {/* main body */}
      <rect x="92" y="86" width="216" height="150" rx="14" fill="url(#cam-body)" />
      {/* grip */}
      <path
        d="M92 100 Q80 100 78 116 L78 210 Q78 232 96 234 L108 236 L108 88 Q96 88 92 100 Z"
        fill="url(#cam-grip)"
      />
      {/* leatherette texture strip */}
      <rect x="282" y="98" width="20" height="126" rx="8" fill="#101214" />

      {/* red ring detail — the mark of a pro lens */}
      <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r + 8} fill="none" stroke="#7d2a24" strokeWidth="2.5" opacity="0.9" />

      {/* lens barrel */}
      <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r + 20} fill="#0d0f11" />
      <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r + 14} fill="url(#cam-lens-rim)" />
      {/* the glass opening — hero scene lives inside this circle */}
      <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r} fill="#020304" />

      {/* brand engraving */}
      <text
        x="200"
        y="82"
        textAnchor="middle"
        fill="#8b9089"
        fontSize="11"
        letterSpacing="4"
        fontFamily="Inter, sans-serif"
      >
        B·KORI
      </text>

      {/* print slot at the bottom — where the polaroid ejects */}
      <rect x="150" y="238" width="100" height="6" rx="3" fill="#050607" />
      <rect x="150" y="237" width="100" height="2" fill="#c8a765" opacity="0.25" />
    </svg>
  );
}
