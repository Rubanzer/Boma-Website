import { PALETTES } from "@/lib/palettes";
import type { AnimalKind, Orientation, PaletteName } from "@/lib/types";
import { AnimalSilhouette } from "./animals";

/**
 * The "photograph" engine — a layered savanna scene rendered as SVG.
 * Every print in the catalogue is drawn by this component, keyed by
 * animal + palette. Swapping to real photographs later means replacing
 * the render inside Print.tsx only.
 */
export default function SavannaScene({
  animal,
  palette,
  orientation = "landscape",
  id,
  className,
}: {
  animal: AnimalKind;
  palette: PaletteName;
  orientation?: Orientation;
  /** unique prefix so gradient ids never collide when many scenes render */
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
  const horizon = h * 0.68;
  const orbR = Math.min(w, h) * 0.16;
  const orbCx = w * 0.62;
  const orbCy = horizon - orbR * 0.55;
  // animal box is 100x70 with baseline y=70
  const animalScale = (w * 0.34) / 100;
  const animalX = w * 0.18;
  const animalY = horizon - 70 * animalScale + h * 0.06;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={`Fine-art scene: ${animal} on the savanna`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="55%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orbGlow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.orbGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.haze} stopOpacity="0" />
          <stop offset="100%" stopColor={p.haze} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.hillsMid} />
          <stop offset="100%" stopColor={p.ground} />
        </linearGradient>
        <linearGradient id={`${id}-vig`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
          <stop offset="25%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect width={w} height={h} fill={`url(#${id}-sky)`} />

      {/* sun / moon with glow */}
      <circle cx={orbCx} cy={orbCy} r={orbR * 2.6} fill={`url(#${id}-glow)`} />
      <circle cx={orbCx} cy={orbCy} r={orbR} fill={p.orb} opacity="0.92" />

      {/* horizon haze */}
      <rect
        x="0"
        y={horizon - h * 0.18}
        width={w}
        height={h * 0.18}
        fill={`url(#${id}-haze)`}
      />

      {/* far hills */}
      <path
        d={`M0 ${horizon} L0 ${horizon - h * 0.075} Q ${w * 0.2} ${horizon - h * 0.14} ${w * 0.42} ${horizon - h * 0.06} T ${w * 0.78} ${horizon - h * 0.1} T ${w} ${horizon - h * 0.045} L ${w} ${horizon} Z`}
        fill={p.hillsFar}
        opacity="0.9"
      />

      {/* ground */}
      <rect x="0" y={horizon} width={w} height={h - horizon} fill={`url(#${id}-ground)`} />

      {/* grass tufts */}
      <g fill={p.silhouette} opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => {
          const gx = (w / 9) * i + (i % 3) * 4 + 3;
          const gy = horizon + (h - horizon) * (0.25 + ((i * 37) % 50) / 100);
          return (
            <path
              key={i}
              d={`M${gx} ${gy} q1 -5 2 0 q1 -7 2 0 q1 -4 2 0 z`}
            />
          );
        })}
      </g>

      {/* the flat-top acacia — signature of the Mara */}
      <g fill={p.silhouette}>
        <path
          d={`M${w * 0.8} ${horizon + h * 0.02} l ${w * 0.008} ${-h * 0.1} q ${-w * 0.02} ${-h * 0.02} ${-w * 0.006} ${-h * 0.04} q ${-w * 0.05} ${0} ${-w * 0.056} ${-h * 0.018} q ${w * 0.03} ${-h * 0.05} ${w * 0.085} ${-h * 0.045} q ${w * 0.055} ${-h * 0.005} ${w * 0.08} ${h * 0.028} q ${w * 0.012} ${h * 0.02} ${-w * 0.02} ${h * 0.022} q ${-w * 0.03} ${h * 0.006} ${-w * 0.052} ${h * 0.002} q ${w * 0.006} ${h * 0.02} ${-w * 0.006} ${h * 0.05} l ${w * 0.008} ${h * 0.1} z`}
        />
      </g>

      {/* birds */}
      <g stroke={p.silhouette} strokeWidth={Math.max(w * 0.004, 1)} fill="none" opacity="0.65">
        <path d={`M${w * 0.3} ${h * 0.2} q ${w * 0.012} ${-h * 0.014} ${w * 0.024} 0 q ${w * 0.012} ${-h * 0.014} ${w * 0.024} 0`} />
        <path d={`M${w * 0.4} ${h * 0.15} q ${w * 0.01} ${-h * 0.012} ${w * 0.02} 0 q ${w * 0.01} ${-h * 0.012} ${w * 0.02} 0`} />
      </g>

      {/* the animal */}
      <g
        transform={`translate(${animalX} ${animalY}) scale(${animalScale})`}
      >
        <AnimalSilhouette animal={animal} fill={p.silhouette} />
      </g>

      {/* soft ground shadow beneath animal */}
      <ellipse
        cx={animalX + 50 * animalScale}
        cy={animalY + 70 * animalScale + 2}
        rx={44 * animalScale}
        ry={5 * animalScale}
        fill={p.silhouette}
        opacity="0.35"
      />

      {/* cinematic vignette */}
      <rect width={w} height={h} fill={`url(#${id}-vig)`} />
    </svg>
  );
}
