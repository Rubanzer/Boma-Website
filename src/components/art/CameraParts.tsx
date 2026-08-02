/**
 * DSLR parts for the hero fly-through.
 *
 * The sequence travels backwards from the subject, INTO the lens, down the
 * barrel and out through the eyepiece — emerging behind the camera, where the
 * rear LCD is showing the frame that was just taken.
 *
 * `LensThroat` is drawn head-on as concentric barrel rings with the aperture
 * near the middle and a transparent centre, so the scene shows through from a
 * layer beneath. Scaling it up is what sells "flying down the tube".
 */

/** Where the LCD sits inside CameraRear's 400×300 viewBox. */
export const REAR_SCREEN = {
  vb: { w: 400, h: 300 },
  x: 50,
  y: 88,
  w: 182,
  h: 138,
};

export function LensThroat({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  // barrel rings from the outside in
  const rings = [
    { r: 196, w: 26, c: "#0a0b0c" },
    { r: 172, w: 20, c: "#191c1f" },
    { r: 154, w: 14, c: "#0c0e10" },
    { r: 140, w: 12, c: "#23272b" },
    { r: 126, w: 10, c: "#0b0d0f" },
    { r: 114, w: 9, c: "#1c2024" },
    { r: 103, w: 8, c: "#0a0c0e" },
    { r: 94, w: 7, c: "#2a2f34" },
  ];
  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* metal that catches light from the top-left */}
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#6a7076" />
          <stop offset="22%" stopColor="#2c3136" />
          <stop offset="55%" stopColor="#0e1012" />
          <stop offset="100%" stopColor="#33383d" />
        </linearGradient>
        {/* the violet/green bloom of a coated front element */}
        <radialGradient id={`${id}-coat`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#7f6ad0" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#2e6f66" stopOpacity="0.34" />
          <stop offset="80%" stopColor="#123" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-throatshade`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
        {/* keeps the middle of the barrel open so the receding subject
            stays visible all the way down the tube */}
        <mask id={`${id}-bore`}>
          <rect width="480" height="480" fill="#fff" />
          <circle cx="240" cy="240" r="86" fill="#000" />
        </mask>
      </defs>

      {/* barrel walls */}
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="240"
          cy="240"
          r={ring.r}
          fill="none"
          stroke={i % 2 === 0 ? ring.c : `url(#${id}-metal)`}
          strokeWidth={ring.w}
        />
      ))}

      {/* knurled focus ring texture on the widest band */}
      <g opacity="0.5">
        {Array.from({ length: 72 }).map((_, i) => (
          <rect
            key={i}
            x="239"
            y="32"
            width="2"
            height="18"
            fill={i % 2 ? "#0a0b0c" : "#41474d"}
            transform={`rotate(${i * 5} 240 240)`}
          />
        ))}
      </g>

      {/* aperture blades, stopped short of the open bore */}
      <g mask={`url(#${id}-bore)`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d="M240 240 L240 152 Q286 158 306 196 Z"
            fill={i % 2 ? "#0f1113" : "#171a1d"}
            transform={`rotate(${i * 40} 240 240)`}
            opacity="0.96"
          />
        ))}
        {/* blade edge catching a sliver of light */}
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={`e${i}`}
            d="M240 152 Q286 158 306 196"
            fill="none"
            stroke="#5d666e"
            strokeWidth="1.4"
            opacity="0.55"
            transform={`rotate(${i * 40} 240 240)`}
          />
        ))}
      </g>

      {/* coating bloom over the glass */}
      <circle
        cx="240"
        cy="240"
        r="150"
        fill={`url(#${id}-coat)`}
        opacity="0.5"
        mask={`url(#${id}-bore)`}
      />
      {/* inner falloff */}
      <circle
        cx="240"
        cy="240"
        r="240"
        fill={`url(#${id}-throatshade)`}
        mask={`url(#${id}-bore)`}
      />
    </svg>
  );
}

/**
 * The back of the camera. The LCD area is left EMPTY — the caller overlays
 * the captured frame there using REAR_SCREEN.
 */
export function CameraRear({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3a3f44" />
          <stop offset="18%" stopColor="#23272b" />
          <stop offset="62%" stopColor="#131619" />
          <stop offset="100%" stopColor="#0a0b0d" />
        </linearGradient>
        <linearGradient id={`${id}-prism`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#41464c" />
          <stop offset="100%" stopColor="#1b1e21" />
        </linearGradient>
        <linearGradient id={`${id}-bezel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05060700" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3d4349" />
        </linearGradient>
        <linearGradient id={`${id}-btn`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43494f" />
          <stop offset="55%" stopColor="#212528" />
          <stop offset="100%" stopColor="#15181a" />
        </linearGradient>
        <linearGradient id={`${id}-dial`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#4e545a" />
          <stop offset="50%" stopColor="#22262a" />
          <stop offset="100%" stopColor="#101315" />
        </linearGradient>
        {/* rubberised grip */}
        <filter id={`${id}-rubber`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.4"
            numOctaves="3"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.08 0 0 0 0 0.09 0 0 0 0 0.1 0 0 0 0.7 0"
          />
        </filter>
        <filter id={`${id}-ao`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* drop shadow under the whole body */}
      <ellipse
        cx="200"
        cy="272"
        rx="168"
        ry="16"
        fill="#000"
        opacity="0.6"
        filter={`url(#${id}-ao)`}
      />

      {/* pentaprism hump + hot shoe */}
      <path d="M148 40 L162 12 L238 12 L252 40 Z" fill={`url(#${id}-prism)`} />
      <rect x="180" y="6" width="40" height="8" rx="2" fill="#2b3035" />
      <rect x="184" y="4" width="32" height="3" rx="1.5" fill="#4a5158" />

      {/* body */}
      <rect
        x="20"
        y="38"
        width="360"
        height="224"
        rx="18"
        fill={`url(#${id}-body)`}
      />
      {/* top edge specular */}
      <rect x="26" y="39" width="348" height="1.6" rx="0.8" fill="#6d757c" opacity="0.5" />

      {/* eyepiece — the opening we emerge from */}
      <rect x="164" y="42" width="72" height="42" rx="7" fill="#0c0e10" />
      <rect
        x="164"
        y="42"
        width="72"
        height="42"
        rx="7"
        fill="none"
        stroke="#3d4349"
        strokeWidth="2"
        opacity="0.85"
      />
      <rect x="174" y="50" width="52" height="27" rx="3" fill="#050607" />
      <rect
        x="176"
        y="52"
        width="48"
        height="23"
        rx="2"
        fill="#0b0f14"
        opacity="0.95"
      />
      {/* a faint glint in the finder glass */}
      <path d="M178 72 L196 53 L204 53 L182 74 Z" fill="#5a6470" opacity="0.16" />
      {/* diopter wheel */}
      <circle cx="246" cy="52" r="7" fill={`url(#${id}-dial)`} />

      {/* ---------- LCD well (kept empty; caller overlays the frame) ---------- */}
      <rect
        x={REAR_SCREEN.x - 8}
        y={REAR_SCREEN.y - 8}
        width={REAR_SCREEN.w + 16}
        height={REAR_SCREEN.h + 16}
        rx="5"
        fill="#0a0c0e"
      />
      {/* recess shading: dark at top-left, light catching the bottom lip */}
      <rect
        x={REAR_SCREEN.x - 8}
        y={REAR_SCREEN.y - 8}
        width={REAR_SCREEN.w + 16}
        height={REAR_SCREEN.h + 16}
        rx="5"
        fill={`url(#${id}-bezel)`}
        opacity="0.5"
      />
      <rect
        x={REAR_SCREEN.x - 3}
        y={REAR_SCREEN.y - 3}
        width={REAR_SCREEN.w + 6}
        height={REAR_SCREEN.h + 6}
        rx="2"
        fill="#000"
      />

      {/* ---------- left button column ---------- */}
      {[100, 124, 148, 172, 196].map((cy, i) => (
        <g key={i}>
          <circle cx="34" cy={cy} r="7" fill={`url(#${id}-btn)`} />
          <circle cx="34" cy={cy - 1} r="5.2" fill="#2a2f34" opacity="0.85" />
        </g>
      ))}

      {/* ---------- right control cluster ---------- */}
      {/* thumb grip, rubberised */}
      <rect x="344" y="120" width="30" height="86" rx="10" fill="#16191c" />
      <rect
        x="344"
        y="120"
        width="30"
        height="86"
        rx="10"
        filter={`url(#${id}-rubber)`}
        opacity="0.75"
      />

      {/* AF-ON */}
      <rect x="286" y="92" width="42" height="19" rx="9.5" fill={`url(#${id}-btn)`} />
      <text
        x="307"
        y="105"
        textAnchor="middle"
        fill="#8b9089"
        fontSize="8"
        letterSpacing="0.5"
        fontFamily="Inter, sans-serif"
      >
        AF-ON
      </text>
      {/* joystick */}
      <circle cx="352" cy="101" r="10" fill={`url(#${id}-dial)`} />
      <circle cx="352" cy="100" r="4.4" fill="#0d0f11" />
      {/* rear command dial + four-way */}
      <circle cx="300" cy="156" r="30" fill={`url(#${id}-dial)`} />
      <circle cx="300" cy="156" r="21" fill="#14171a" />
      <circle cx="300" cy="156" r="10" fill={`url(#${id}-btn)`} />
      {[0, 90, 180, 270].map((deg) => (
        <path
          key={deg}
          d="M300 132 l5 7 l-10 0 z"
          fill="#5c6369"
          opacity="0.8"
          transform={`rotate(${deg} 300 156)`}
        />
      ))}
      {/* playback + delete */}
      <circle cx="258" cy="99" r="7" fill={`url(#${id}-btn)`} />
      <circle cx="300" cy="212" r="7" fill={`url(#${id}-btn)`} />
      {/* record LED */}
      <circle cx="336" cy="60" r="3.2" fill="#7d2a24" />

      {/* engraving */}
      <text
        x="86"
        y="252"
        fill="#7d837c"
        fontSize="11"
        letterSpacing="3.5"
        fontFamily="Inter, sans-serif"
        opacity="0.9"
      >
        B·KORI
      </text>

      {/* card door seam + screws */}
      <path d="M28 238 L372 238" stroke="#000" strokeWidth="1" opacity="0.55" />
      <circle cx="40" cy="60" r="2.4" fill="#3d4349" opacity="0.8" />
      <circle cx="360" cy="248" r="2.4" fill="#3d4349" opacity="0.8" />

      {/* the print slot the polaroid feeds out of */}
      <rect x="140" y="258" width="120" height="7" rx="3.5" fill="#050607" />
      <rect x="140" y="257" width="120" height="2" fill="#c8a765" opacity="0.22" />
    </svg>
  );
}
