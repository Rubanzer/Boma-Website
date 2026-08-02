import { PALETTES } from "@/lib/palettes";
import type { AnimalKind, Orientation, PaletteName } from "@/lib/types";
import { AnimalSilhouette } from "./animals";

/**
 * The "photograph" engine — a layered, atmospherically-lit savanna scene.
 *
 * Realism comes from stacking the things a real lens and a real evening do:
 * a wide tonal sky, bloom around the sun, god rays, haze that washes out
 * distance, depth-of-field on the near grass, rim light where the sun wraps
 * the subject, and a final pass of film grain and vignette.
 *
 * `detail="lite"` drops the most expensive filter passes for grid thumbnails.
 */
export default function SavannaScene({
  animal,
  palette,
  orientation = "landscape",
  detail = "full",
  id,
  className,
}: {
  animal: AnimalKind;
  palette: PaletteName;
  orientation?: Orientation;
  detail?: "full" | "lite";
  /** unique prefix so gradient/filter ids never collide */
  id: string;
  className?: string;
}) {
  const p = PALETTES[palette];
  const dims =
    orientation === "portrait"
      ? { w: 200, h: 280 }
      : orientation === "square"
        ? { w: 240, h: 240 }
        : { w: 320, h: 213 };
  const { w, h } = dims;

  const horizon = h * 0.665;
  const orbR = Math.min(w, h) * 0.115;
  const orbCx = w * 0.63;
  const orbCy = horizon - orbR * 0.35;

  // animal art box is 100×70 with baseline y=70
  const animalScale = (w * 0.33) / 100;
  const animalX = w * 0.17;
  const animalY = horizon - 70 * animalScale + h * 0.055;
  const animalW = 100 * animalScale;

  const rich = detail === "full";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={`Fine-art wildlife scene: ${animal} on the savanna`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* ---- sky: many stops so it reads as real atmosphere ---- */}
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="28%" stopColor={p.sky[0]} stopOpacity="0.92" />
          <stop offset="52%" stopColor={p.sky[1]} />
          <stop offset="74%" stopColor={p.sky[1]} stopOpacity="0.96" />
          <stop offset="90%" stopColor={p.sky[2]} />
          <stop offset="100%" stopColor={p.haze} />
        </linearGradient>

        {/* ---- sun: wide bloom, tight glow, hot core ---- */}
        <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orbGlow} stopOpacity="0.5" />
          <stop offset="38%" stopColor={p.orbGlow} stopOpacity="0.17" />
          <stop offset="100%" stopColor={p.orbGlow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orb} stopOpacity="0.95" />
          <stop offset="55%" stopColor={p.orb} stopOpacity="0.45" />
          <stop offset="100%" stopColor={p.orb} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="45%" stopColor={p.orb} />
          <stop offset="100%" stopColor={p.orb} stopOpacity="0.85" />
        </radialGradient>

        {/* ---- horizon haze: distance washes out ---- */}
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.haze} stopOpacity="0" />
          <stop offset="70%" stopColor={p.haze} stopOpacity="0.38" />
          <stop offset="100%" stopColor={p.haze} stopOpacity="0.62" />
        </linearGradient>

        {/* ---- ground ---- */}
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.haze} stopOpacity="0.5" />
          <stop offset="14%" stopColor={p.hillsMid} />
          <stop offset="60%" stopColor={p.ground} />
          <stop offset="100%" stopColor={p.ground} />
        </linearGradient>

        {/* warm light pooling on the ground beneath the sun */}
        <radialGradient id={`${id}-groundlight`} cx="50%" cy="0%" r="72%">
          <stop offset="0%" stopColor={p.orbGlow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={p.orbGlow} stopOpacity="0" />
        </radialGradient>

        {/* ---- vignette + film curve ---- */}
        <radialGradient id={`${id}-vig`} cx="50%" cy="48%" r="72%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>

        {/* ---- filters ---- */}
        <filter
          id={`${id}-soft`}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <feGaussianBlur stdDeviation={w * 0.012} />
        </filter>
        <filter id={`${id}-dof`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={w * 0.005} />
        </filter>
        <filter id={`${id}-far`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={w * 0.0022} />
        </filter>
        {rich && (
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.5 0"
            />
          </filter>
        )}

        {/* rim light that wraps the subject from the sun side */}
        <linearGradient id={`${id}-rim`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={p.orb} stopOpacity="0.85" />
          <stop offset="45%" stopColor={p.orbGlow} stopOpacity="0.25" />
          <stop offset="100%" stopColor={p.orbGlow} stopOpacity="0" />
        </linearGradient>

        <clipPath id={`${id}-skyclip`}>
          <rect x="0" y="0" width={w} height={horizon} />
        </clipPath>
        <clipPath id={`${id}-frameclip`}>
          <rect x="0" y="0" width={w} height={h} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-frameclip)`}>
        {/* ================= SKY ================= */}
        <rect width={w} height={h} fill={`url(#${id}-sky)`} />

        <g clipPath={`url(#${id}-skyclip)`}>
          {/* high cloud banding — soft, horizontal, barely there */}
          {rich && (
            <g filter={`url(#${id}-soft)`} opacity="0.5">
              <ellipse
                cx={w * 0.3}
                cy={h * 0.17}
                rx={w * 0.34}
                ry={h * 0.018}
                fill={p.haze}
                opacity="0.5"
              />
              <ellipse
                cx={w * 0.72}
                cy={h * 0.26}
                rx={w * 0.3}
                ry={h * 0.014}
                fill={p.haze}
                opacity="0.42"
              />
              <ellipse
                cx={w * 0.48}
                cy={h * 0.37}
                rx={w * 0.42}
                ry={h * 0.016}
                fill={p.orbGlow}
                opacity="0.22"
              />
            </g>
          )}

          {/* god rays fanning from the sun */}
          {rich && (
            <g
              filter={`url(#${id}-soft)`}
              opacity="0.16"
              style={{ mixBlendMode: "screen" }}
            >
              {[-26, -12, 4, 17, 30].map((deg, i) => (
                <polygon
                  key={i}
                  points={`${orbCx},${orbCy} ${orbCx - w * 0.5},${orbCy - h * 0.9} ${orbCx - w * 0.34},${orbCy - h * 0.9}`}
                  fill={p.orb}
                  opacity={0.5 + (i % 2) * 0.3}
                  transform={`rotate(${deg} ${orbCx} ${orbCy})`}
                />
              ))}
            </g>
          )}

          {/* sun: bloom → glow → core */}
          <circle
            cx={orbCx}
            cy={orbCy}
            r={orbR * 5.4}
            fill={`url(#${id}-bloom)`}
          />
          <circle
            cx={orbCx}
            cy={orbCy}
            r={orbR * 2.1}
            fill={`url(#${id}-glow)`}
          />
          <circle cx={orbCx} cy={orbCy} r={orbR} fill={`url(#${id}-core)`} />
        </g>

        {/* ================= DISTANCE ================= */}
        {/* far escarpment — hazed and low contrast */}
        <g filter={`url(#${id}-far)`} opacity="0.62">
          <path
            d={`M0 ${horizon} L0 ${horizon - h * 0.105}
                Q ${w * 0.14} ${horizon - h * 0.165} ${w * 0.29} ${horizon - h * 0.112}
                Q ${w * 0.43} ${horizon - h * 0.062} ${w * 0.57} ${horizon - h * 0.1}
                Q ${w * 0.74} ${horizon - h * 0.15} ${w * 0.88} ${horizon - h * 0.088}
                L ${w} ${horizon - h * 0.105} L ${w} ${horizon} Z`}
            fill={p.hillsFar}
          />
        </g>

        {/* mid ridge */}
        <path
          d={`M0 ${horizon} L0 ${horizon - h * 0.048}
              Q ${w * 0.22} ${horizon - h * 0.095} ${w * 0.46} ${horizon - h * 0.04}
              Q ${w * 0.68} ${horizon - h * 0.008} ${w} ${horizon - h * 0.055}
              L ${w} ${horizon} Z`}
          fill={p.hillsMid}
          opacity="0.95"
        />

        {/* distant tree line on the ridge */}
        <g fill={p.silhouette} opacity="0.42" filter={`url(#${id}-far)`}>
          {Array.from({ length: 14 }).map((_, i) => {
            const tx = (w / 14) * i + ((i * 13) % 9);
            const th = h * (0.012 + ((i * 7) % 5) / 420);
            return (
              <ellipse key={i} cx={tx} cy={horizon - h * 0.038} rx={th * 1.5} ry={th} />
            );
          })}
        </g>

        {/* horizon haze band — the great distance-flattener */}
        <rect
          x="0"
          y={horizon - h * 0.2}
          width={w}
          height={h * 0.2}
          fill={`url(#${id}-haze)`}
        />

        {/* ================= GROUND ================= */}
        <rect
          x="0"
          y={horizon}
          width={w}
          height={h - horizon}
          fill={`url(#${id}-ground)`}
        />
        <rect
          x="0"
          y={horizon}
          width={w}
          height={h - horizon}
          fill={`url(#${id}-groundlight)`}
        />

        {/* the flat-top acacia — signature of the Mara */}
        <g fill={p.silhouette}>
          <path
            d={`M${w * 0.845} ${horizon + h * 0.035}
                l ${w * 0.007} ${-h * 0.098}
                q ${-w * 0.018} ${-h * 0.016} ${-w * 0.005} ${-h * 0.038}
                q ${-w * 0.046} ${0.5} ${-w * 0.055} ${-h * 0.02}
                q ${w * 0.028} ${-h * 0.052} ${w * 0.086} ${-h * 0.046}
                q ${w * 0.056} ${-h * 0.006} ${w * 0.079} ${h * 0.03}
                q ${w * 0.012} ${h * 0.02} ${-w * 0.021} ${h * 0.023}
                q ${-w * 0.03} ${h * 0.006} ${-w * 0.05} ${h * 0.002}
                q ${w * 0.007} ${h * 0.021} ${-w * 0.006} ${h * 0.049}
                l ${w * 0.007} ${h * 0.098} z`}
          />
          {/* the sun catching the crown */}
          <path
            d={`M${w * 0.79} ${horizon - h * 0.083}
                q ${w * 0.028} ${-h * 0.05} ${w * 0.086} ${-h * 0.044}
                q ${w * 0.05} ${-h * 0.005} ${w * 0.074} ${h * 0.026}
                q ${-w * 0.06} ${-h * 0.012} ${-w * 0.16} ${h * 0.018} z`}
            fill={p.orb}
            opacity="0.16"
          />
        </g>

        {/* birds */}
        <g
          stroke={p.silhouette}
          strokeWidth={Math.max(w * 0.0032, 0.6)}
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        >
          <path
            d={`M${w * 0.3} ${h * 0.19} q ${w * 0.011} ${-h * 0.013} ${w * 0.022} 0 q ${w * 0.011} ${-h * 0.013} ${w * 0.022} 0`}
          />
          <path
            d={`M${w * 0.39} ${h * 0.14} q ${w * 0.009} ${-h * 0.011} ${w * 0.018} 0 q ${w * 0.009} ${-h * 0.011} ${w * 0.018} 0`}
          />
          <path
            d={`M${w * 0.35} ${h * 0.25} q ${w * 0.007} ${-h * 0.009} ${w * 0.014} 0 q ${w * 0.007} ${-h * 0.009} ${w * 0.014} 0`}
          />
        </g>

        {/* ================= SUBJECT ================= */}
        {/* contact shadow */}
        <ellipse
          cx={animalX + animalW * 0.5}
          cy={animalY + 70 * animalScale + h * 0.004}
          rx={animalW * 0.46}
          ry={h * 0.016}
          fill={p.ground}
          opacity="0.65"
          filter={`url(#${id}-far)`}
        />

        {/* rim light: a warm, offset copy bleeding out from the sun side */}
        {rich && (
          <g
            transform={`translate(${animalX + w * 0.004} ${animalY - h * 0.003}) scale(${animalScale})`}
            filter={`url(#${id}-far)`}
            opacity="0.85"
          >
            <AnimalSilhouette animal={animal} fill={p.orb} />
          </g>
        )}

        {/* the subject itself */}
        <g transform={`translate(${animalX} ${animalY}) scale(${animalScale})`}>
          <AnimalSilhouette animal={animal} fill={p.silhouette} />
        </g>

        {/* ================= FOREGROUND (out of focus) ================= */}
        <g filter={`url(#${id}-dof)`} opacity="0.9">
          <g fill={p.silhouette} opacity="0.75">
            {Array.from({ length: 16 }).map((_, i) => {
              const gx = (w / 15) * i + ((i * 29) % 11);
              const gy = h - (h - horizon) * (((i * 17) % 32) / 130);
              const s = 1 + ((i * 11) % 7) / 6;
              return (
                <path
                  key={i}
                  d={`M${gx} ${gy} q${s} ${-6 * s} ${2 * s} 0 q${s} ${-9 * s} ${2 * s} 0 q${s} ${-5 * s} ${2 * s} 0 z`}
                />
              );
            })}
          </g>
          {/* a dark blurred sill along the very bottom = shallow depth of field */}
          <rect
            x="0"
            y={h - h * 0.045}
            width={w}
            height={h * 0.045}
            fill={p.ground}
            opacity="0.75"
          />
        </g>

        {/* dust motes catching the light */}
        {rich && (
          <g fill={p.orb} opacity="0.22">
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={w * (0.4 + ((i * 37) % 55) / 100)}
                cy={horizon - h * (((i * 23) % 30) / 130)}
                r={Math.max(w * 0.0016, 0.35)}
              />
            ))}
          </g>
        )}

        {/* ================= GRADE ================= */}
        {/* lifted, slightly warm blacks — a film response, not digital clipping */}
        <rect
          width={w}
          height={h}
          fill={p.haze}
          opacity="0.05"
          style={{ mixBlendMode: "screen" }}
        />
        <rect width={w} height={h} fill={`url(#${id}-vig)`} />
        {rich && (
          <rect
            width={w}
            height={h}
            filter={`url(#${id}-grain)`}
            opacity="0.11"
            style={{ mixBlendMode: "overlay" }}
          />
        )}
      </g>
    </svg>
  );
}
