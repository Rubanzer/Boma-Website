import type { ReactElement } from "react";

/**
 * The finale backdrop of the scroll cinema — a dark, dusk-lit luxury
 * bedroom drawn entirely in inline SVG.
 *
 * The upper middle of the feature wall is deliberately left empty and
 * softly lit: the framed piece is hung there by the caller, centred on
 * BEDROOM_ART_ANCHOR. Everything else (headboard, bed, nightstands) sits
 * below that zone.
 *
 * Pure presentational — no hooks, no client boundary. Every gradient,
 * filter and clip id is namespaced with `id` so instances can coexist.
 */

/** Centre point (in % of the scene box) the framed piece should sit on. */
export const BEDROOM_ART_ANCHOR = { xPct: 50, yPct: 33 };

/** The furniture-free rectangle on the feature wall, in % of the scene box. */
export const BEDROOM_ART_SAFE_ZONE = {
  xPct: 50,
  yPct: 33,
  widthPct: 36,
  heightPct: 30,
};

/* ------------------------------------------------------------------ *
 * One-point perspective rig.
 * Everything is authored on the back-wall plane (depth scale s = 1)
 * and projected toward the camera by multiplying its offset from the
 * vanishing point by s. s = 1 is the feature wall, s ≈ 1.98 is the
 * bottom edge of the frame.
 * ------------------------------------------------------------------ */
const VP_X = 800; // vanishing point / centre of the lens
const VP_Y = 330; // eye level
const WALL_BASE = 618; // wall–floor junction on the back-wall plane
const CAM_H = WALL_BASE - VP_Y; // camera height, in back-plane units
const ROOM_L = 150; // back-wall corners
const ROOM_R = 1450;

const r1 = (v: number) => Math.round(v * 10) / 10;
const projX = (x: number, s: number) => r1(VP_X + (x - VP_X) * s);
const projY = (y: number, s: number) => r1(VP_Y + (y - VP_Y) * s);
const floorAt = (s: number) => r1(VP_Y + CAM_H * s);
const poly = (pts: Array<[number, number]>) =>
  pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ");

/** depth at which the back-wall corner reaches the edge of the frame */
const S_EDGE = VP_X / (VP_X - ROOM_L);
/** depth at which the floor reaches the bottom of the frame */
const S_END = (900 - VP_Y) / CAM_H;

const EDGE_FLOOR = floorAt(S_EDGE); // 684.5
const SKIRT_TOP = 586;
const EDGE_SKIRT = projY(SKIRT_TOP, S_EDGE); // 645.1

/* ---- floor ---- */
const FLOOR_POLY = poly([
  [0, EDGE_FLOOR],
  [ROOM_L, WALL_BASE],
  [ROOM_R, WALL_BASE],
  [1600, EDGE_FLOOR],
  [1600, 900],
  [0, 900],
]);
const BOARDS = Array.from({ length: 25 }, (_, i) => 158 + i * 53.5);
/** [depth, board index] — staggered end joints */
const BOARD_ENDS: Array<[number, number]> = [
  [1.12, 3],
  [1.12, 14],
  [1.3, 7],
  [1.3, 18],
  [1.52, 2],
  [1.52, 11],
  [1.52, 20],
  [1.78, 6],
  [1.78, 16],
];

/* ---- rug ---- */
const RUG_HW = 370;
const S_RUG_B = 1.18;
const S_RUG_F = 1.82;
const RUG_POLY = poly([
  [projX(VP_X - RUG_HW, S_RUG_B), floorAt(S_RUG_B)],
  [projX(VP_X + RUG_HW, S_RUG_B), floorAt(S_RUG_B)],
  [projX(VP_X + RUG_HW, S_RUG_F), floorAt(S_RUG_F)],
  [projX(VP_X - RUG_HW, S_RUG_F), floorAt(S_RUG_F)],
]);
/** [inset, back offset, front offset, stroke, width, opacity] */
const RUG_BORDERS: Array<[number, number, number, string, number, number]> = [
  [40, 0.05, 0.09, "#6a5d4d", 2.4, 0.42],
  [66, 0.09, 0.16, "#544a3d", 1.6, 0.3],
];

/* ---- bed ---- */
const BED_HW = 320;
const BED_TOP = 566; // duvet top surface, on the back-wall plane
const S_FOOT = 1.55;
const BED_L = VP_X - BED_HW; // 480
const BED_R = VP_X + BED_HW; // 1120
const FOOT_L = projX(BED_L, S_FOOT); // 304
const FOOT_R = projX(BED_R, S_FOOT); // 1296
const FOOT_TOP = projY(BED_TOP, S_FOOT); // 695.8

/* ---- nightstands ---- */
const NS_TOP = 528; // top surface, back-wall plane
const NS_BOT = 598; // underside of the carcass
const S_NS = 1.2; // front face depth
const NS_SETS: Array<{ x0: number; x1: number; mirrored: boolean }> = [
  { x0: 236, x1: 416, mirrored: false },
  { x0: 1184, x1: 1364, mirrored: true },
];

/* ---- lamps: [screen x, relative brightness] ---- */
const LAMPS: Array<[number, number]> = [
  [projX(306, 1.09), 1],
  [projX(1294, 1.09), 0.84],
];

/* ---- curtain: a slim panel breaking the left corner ---- */
const CURTAIN_W = 176;
const curtainTop = (x: number) => r1(-40 + (46 * x) / CURTAIN_W);
const curtainBottom = (x: number) => r1(700 - (64 * x) / CURTAIN_W);
const CURTAIN_FOLDS: Array<[number, number]> = [
  [0, 26],
  [26, 58],
  [58, 84],
  [84, 112],
  [112, 140],
  [140, 176],
];
const CURTAIN_FOLD_OPACITY = [0.95, 0.55, 0.8, 0.45, 0.9, 0.62];

export default function BedroomScene({
  id,
  className,
}: {
  /** unique prefix so gradient / filter ids never collide */
  id: string;
  className?: string;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* ---------------- walls ---------------- */}
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0b09" />
          <stop offset="20%" stopColor="#1a1611" />
          <stop offset="48%" stopColor="#262019" />
          <stop offset="76%" stopColor="#221c16" />
          <stop offset="100%" stopColor="#14100c" />
        </linearGradient>
        <linearGradient id={`${id}-wallFall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="26%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={`${id}-sideL`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#0b0907" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#040303" stopOpacity="0.97" />
        </linearGradient>
        <linearGradient id={`${id}-sideR`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0b0907" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#040303" stopOpacity="0.97" />
        </linearGradient>

        {/* ---------------- light ---------------- */}
        <radialGradient id={`${id}-artSpill`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e2c28c" stopOpacity="0.2" />
          <stop offset="42%" stopColor="#d5ac70" stopOpacity="0.09" />
          <stop offset="74%" stopColor="#c8a765" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2dcb0" stopOpacity="0.075" />
          <stop offset="50%" stopColor="#e6c68d" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-lampWall`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd79a" stopOpacity="0.34" />
          <stop offset="30%" stopColor="#f0be7e" stopOpacity="0.17" />
          <stop offset="64%" stopColor="#d6a163" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lampGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe7bd" stopOpacity="0.55" />
          <stop offset="34%" stopColor="#ffcf8e" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#e0a961" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-cool`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8fb2c4" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#5c7c8e" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#3d5361" stopOpacity="0" />
        </radialGradient>

        {/* ---------------- skirting + floor ---------------- */}
        <linearGradient id={`${id}-skirt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="18%" stopColor="#2b2319" />
          <stop offset="100%" stopColor="#130f0a" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#231a11" />
          <stop offset="34%" stopColor="#302317" />
          <stop offset="72%" stopColor="#291d14" />
          <stop offset="100%" stopColor="#150f0a" />
        </linearGradient>
        <radialGradient id={`${id}-floorPool`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5cf94" stopOpacity="0.26" />
          <stop offset="45%" stopColor="#d9a865" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c8a765" stopOpacity="0" />
        </radialGradient>

        {/* ---------------- rug ---------------- */}
        <linearGradient id={`${id}-rug`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39322a" />
          <stop offset="46%" stopColor="#463d33" />
          <stop offset="100%" stopColor="#2a241d" />
        </linearGradient>

        {/* ---------------- curtain ---------------- */}
        <linearGradient id={`${id}-curtain`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#070606" />
          <stop offset="60%" stopColor="#151109" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#191510" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.62" />
          <stop offset="44%" stopColor="#6d6154" stopOpacity="0.13" />
          <stop offset="64%" stopColor="#8d8071" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.68" />
        </linearGradient>

        {/* ---------------- headboard ---------------- */}
        <linearGradient id={`${id}-flute`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#171a15" />
          <stop offset="20%" stopColor="#2e3529" />
          <stop offset="46%" stopColor="#3d4536" />
          <stop offset="72%" stopColor="#2a3126" />
          <stop offset="100%" stopColor="#13160f" />
        </linearGradient>
        <linearGradient id={`${id}-hbFall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.16" />
          <stop offset="34%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}-hbWarm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0c88b" stopOpacity="0.26" />
          <stop offset="34%" stopColor="#e0b477" stopOpacity="0.04" />
          <stop offset="66%" stopColor="#e0b477" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#f0c88b" stopOpacity="0.22" />
        </linearGradient>

        {/* ---------------- wood + brass ---------------- */}
        <linearGradient id={`${id}-woodTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a1c" />
          <stop offset="100%" stopColor="#2a1e14" />
        </linearGradient>
        <linearGradient id={`${id}-woodFace`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c2016" />
          <stop offset="55%" stopColor="#221810" />
          <stop offset="100%" stopColor="#130d08" />
        </linearGradient>
        <linearGradient id={`${id}-woodSide`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a120c" />
          <stop offset="100%" stopColor="#0d0906" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0c48c" />
          <stop offset="42%" stopColor="#c8a765" />
          <stop offset="100%" stopColor="#6d5730" />
        </linearGradient>

        {/* ---------------- lamp shade ---------------- */}
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b08a55" />
          <stop offset="30%" stopColor="#e3bf83" />
          <stop offset="68%" stopColor="#f7e2b4" />
          <stop offset="100%" stopColor="#dcb377" />
        </linearGradient>
        <linearGradient id={`${id}-shadeEdge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2a14" stopOpacity="0.5" />
          <stop offset="34%" stopColor="#3a2a14" stopOpacity="0" />
          <stop offset="66%" stopColor="#3a2a14" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2a14" stopOpacity="0.55" />
        </linearGradient>

        {/* ---------------- linen ---------------- */}
        <linearGradient id={`${id}-duvetTop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a49a89" />
          <stop offset="30%" stopColor="#8d8474" />
          <stop offset="62%" stopColor="#736a5c" />
          <stop offset="100%" stopColor="#4e4941" />
        </linearGradient>
        <linearGradient id={`${id}-duvetFront`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5e5749" />
          <stop offset="60%" stopColor="#4a443a" />
          <stop offset="100%" stopColor="#33302a" />
        </linearGradient>
        <linearGradient id={`${id}-duvetSide`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b6355" />
          <stop offset="100%" stopColor="#3c382f" />
        </linearGradient>
        <linearGradient id={`${id}-pillow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b3a996" />
          <stop offset="46%" stopColor="#9c9382" />
          <stop offset="100%" stopColor="#6f6759" />
        </linearGradient>
        <linearGradient id={`${id}-sheet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfb5a1" />
          <stop offset="100%" stopColor="#8d8474" />
        </linearGradient>
        <linearGradient id={`${id}-throw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d6640" />
          <stop offset="46%" stopColor="#5f4d30" />
          <stop offset="100%" stopColor="#382d1c" />
        </linearGradient>
        <linearGradient id={`${id}-bolster`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94794a" />
          <stop offset="100%" stopColor="#4e3f27" />
        </linearGradient>
        <linearGradient id={`${id}-plinth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191309" />
          <stop offset="100%" stopColor="#0a0705" />
        </linearGradient>

        {/* ---------------- grade ---------------- */}
        <radialGradient id={`${id}-vig`} cx="50%" cy="44%" r="72%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="52%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="80%" stopColor="#000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.74" />
        </radialGradient>

        {/* ---------------- filters ---------------- */}
        <filter id={`${id}-blurS`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-blurM`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id={`${id}-blurL`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter
          id={`${id}-blurXL`}
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
        >
          <feGaussianBlur stdDeviation="64" />
        </filter>
        <filter id={`${id}-grainFine`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="1 1" />
          </feComponentTransfer>
        </filter>
        <filter
          id={`${id}-grainCoarse`}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045 0.16"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="1 1" />
          </feComponentTransfer>
        </filter>

        <clipPath id={`${id}-floorClip`}>
          <polygon points={FLOOR_POLY} />
        </clipPath>
        <clipPath id={`${id}-rugClip`}>
          <polygon points={RUG_POLY} />
        </clipPath>
      </defs>

      {/* base so no seam ever shows through */}
      <rect width="1600" height="900" fill="#0b0d0c" />

      {/* ================= FEATURE WALL ================= */}
      <rect x="0" y="-20" width="1600" height="720" fill={`url(#${id}-wall)`} />

      {/* warm spill exactly where the piece will hang */}
      <ellipse
        cx="800"
        cy="308"
        rx="560"
        ry="360"
        fill={`url(#${id}-artSpill)`}
      />
      {/* soft recessed downlight motivating that spill */}
      <polygon
        points="660,-80 940,-80 1070,470 530,470"
        fill={`url(#${id}-cone)`}
        filter={`url(#${id}-blurXL)`}
      />

      {/* lamp pools on the wall — left is the stronger source */}
      <ellipse
        cx="292"
        cy="440"
        rx="330"
        ry="330"
        fill={`url(#${id}-lampWall)`}
      />
      <ellipse
        cx="1310"
        cy="446"
        rx="310"
        ry="312"
        fill={`url(#${id}-lampWall)`}
        opacity="0.82"
      />

      {/* cool dusk fill leaking past the curtain, top-left */}
      <ellipse cx="130" cy="140" rx="420" ry="380" fill={`url(#${id}-cool)`} />

      {/* limewash plaster texture */}
      <rect
        x="0"
        y="-20"
        width="1600"
        height="720"
        fill="#7d7468"
        filter={`url(#${id}-grainFine)`}
        opacity="0.07"
        style={{ mixBlendMode: "overlay" }}
      />
      {/* vertical falloff — darkest at the cornice and behind the bed */}
      <rect
        x="0"
        y="-20"
        width="1600"
        height="720"
        fill={`url(#${id}-wallFall)`}
      />

      {/* returning side walls — darker, at a grazing angle */}
      <polygon
        points={poly([
          [0, projY(0, S_EDGE)],
          [ROOM_L, 0],
          [ROOM_L, WALL_BASE],
          [0, EDGE_FLOOR],
        ])}
        fill={`url(#${id}-sideL)`}
      />
      <polygon
        points={poly([
          [1600, projY(0, S_EDGE)],
          [ROOM_R, 0],
          [ROOM_R, WALL_BASE],
          [1600, EDGE_FLOOR],
        ])}
        fill={`url(#${id}-sideR)`}
      />
      {/* ambient occlusion in both vertical corners */}
      <rect
        x={ROOM_L - 26}
        y="-20"
        width="34"
        height="700"
        fill="#000"
        opacity="0.5"
        filter={`url(#${id}-blurM)`}
      />
      <rect
        x={ROOM_R - 8}
        y="-20"
        width="34"
        height="700"
        fill="#000"
        opacity="0.5"
        filter={`url(#${id}-blurM)`}
      />

      {/* ================= SKIRTING ================= */}
      <rect
        x={ROOM_L}
        y={SKIRT_TOP}
        width={ROOM_R - ROOM_L}
        height={WALL_BASE - SKIRT_TOP}
        fill={`url(#${id}-skirt)`}
      />
      <rect
        x={ROOM_L}
        y={SKIRT_TOP}
        width={ROOM_R - ROOM_L}
        height="2"
        fill="#5a4b39"
        opacity="0.4"
      />
      <polygon
        points={poly([
          [0, EDGE_SKIRT],
          [ROOM_L, SKIRT_TOP],
          [ROOM_L, WALL_BASE],
          [0, EDGE_FLOOR],
        ])}
        fill={`url(#${id}-skirt)`}
        opacity="0.72"
      />
      <polygon
        points={poly([
          [1600, EDGE_SKIRT],
          [ROOM_R, SKIRT_TOP],
          [ROOM_R, WALL_BASE],
          [1600, EDGE_FLOOR],
        ])}
        fill={`url(#${id}-skirt)`}
        opacity="0.72"
      />
      {/* contact shadow where wall meets floor */}
      <polygon
        points={poly([
          [0, EDGE_FLOOR - 16],
          [ROOM_L, WALL_BASE - 14],
          [ROOM_R, WALL_BASE - 14],
          [1600, EDGE_FLOOR - 16],
          [1600, EDGE_FLOOR + 26],
          [ROOM_R, WALL_BASE + 22],
          [ROOM_L, WALL_BASE + 22],
          [0, EDGE_FLOOR + 26],
        ])}
        fill="#000"
        opacity="0.6"
        filter={`url(#${id}-blurS)`}
      />

      {/* ================= FLOOR ================= */}
      <g clipPath={`url(#${id}-floorClip)`}>
        <polygon points={FLOOR_POLY} fill={`url(#${id}-floor)`} />

        {/* boards receding to the vanishing point */}
        <g stroke="#0a0604" strokeWidth="1.5" opacity="0.72">
          {BOARDS.map((bx, i) => (
            <line
              key={i}
              x1={bx}
              y1={WALL_BASE}
              x2={projX(bx, S_END)}
              y2={floorAt(S_END)}
            />
          ))}
        </g>
        <g stroke="#7d6039" strokeWidth="1" opacity="0.2">
          {BOARDS.map((bx, i) => (
            <line
              key={i}
              x1={bx + 2}
              y1={WALL_BASE}
              x2={projX(bx, S_END) + 4}
              y2={floorAt(S_END)}
            />
          ))}
        </g>
        {/* staggered board ends */}
        <g stroke="#080503" strokeWidth="1.2" opacity="0.4">
          {BOARD_ENDS.map(([s, i], k) => (
            <line
              key={k}
              x1={projX(BOARDS[i], s)}
              y1={floorAt(s)}
              x2={projX(BOARDS[i + 1], s)}
              y2={floorAt(s)}
            />
          ))}
        </g>

        {/* wood grain */}
        <polygon
          points={FLOOR_POLY}
          fill="#8a7358"
          filter={`url(#${id}-grainCoarse)`}
          opacity="0.1"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* lamplight reflected in the lacquer */}
        <ellipse
          cx="232"
          cy="742"
          rx="150"
          ry="86"
          fill={`url(#${id}-floorPool)`}
          filter={`url(#${id}-blurM)`}
        />
        <ellipse
          cx="1372"
          cy="748"
          rx="146"
          ry="84"
          fill={`url(#${id}-floorPool)`}
          filter={`url(#${id}-blurM)`}
          opacity="0.8"
        />
        {/* cool sheen from the window side */}
        <ellipse
          cx="150"
          cy="836"
          rx="260"
          ry="120"
          fill="#7f9fb2"
          opacity="0.06"
          filter={`url(#${id}-blurL)`}
        />
      </g>

      {/* ================= RUG ================= */}
      <g>
        <polygon points={RUG_POLY} fill={`url(#${id}-rug)`} />
        <g clipPath={`url(#${id}-rugClip)`}>
          {/* pile texture */}
          <polygon
            points={RUG_POLY}
            fill="#9b8f80"
            filter={`url(#${id}-grainCoarse)`}
            opacity="0.2"
            style={{ mixBlendMode: "overlay" }}
          />
          {/* woven borders, inset in perspective */}
          {RUG_BORDERS.map(([inset, db, df, stroke, sw, op], i) => (
            <polygon
              key={i}
              points={poly([
                [
                  projX(VP_X - RUG_HW + inset, S_RUG_B + db),
                  floorAt(S_RUG_B + db),
                ],
                [
                  projX(VP_X + RUG_HW - inset, S_RUG_B + db),
                  floorAt(S_RUG_B + db),
                ],
                [
                  projX(VP_X + RUG_HW - inset, S_RUG_F - df),
                  floorAt(S_RUG_F - df),
                ],
                [
                  projX(VP_X - RUG_HW + inset, S_RUG_F - df),
                  floorAt(S_RUG_F - df),
                ],
              ])}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              opacity={op}
            />
          ))}
          {/* lamp wash reaching the rug */}
          <ellipse
            cx="300"
            cy={floorAt(S_RUG_F) - 40}
            rx="230"
            ry="90"
            fill="#e8bd80"
            opacity="0.07"
            filter={`url(#${id}-blurL)`}
          />
          <ellipse
            cx="1300"
            cy={floorAt(S_RUG_F) - 40}
            rx="220"
            ry="88"
            fill="#e8bd80"
            opacity="0.055"
            filter={`url(#${id}-blurL)`}
          />
        </g>
        {/* the rug lifts a hair off the boards */}
        <line
          x1={projX(VP_X - RUG_HW, S_RUG_F)}
          y1={floorAt(S_RUG_F) + 3}
          x2={projX(VP_X + RUG_HW, S_RUG_F)}
          y2={floorAt(S_RUG_F) + 3}
          stroke="#000"
          strokeWidth="7"
          opacity="0.45"
          filter={`url(#${id}-blurS)`}
        />
      </g>

      {/* occlusion pooled under the bed, on the rug */}
      <ellipse
        cx="800"
        cy="784"
        rx="560"
        ry="42"
        fill="#000"
        opacity="0.62"
        filter={`url(#${id}-blurL)`}
      />

      {/* ================= CURTAIN (left, dusk light) ================= */}
      <g>
        <polygon
          points="0,-40 176,6 176,636 0,700"
          fill={`url(#${id}-curtain)`}
        />
        {CURTAIN_FOLDS.map(([xa, xb], i) => (
          <polygon
            key={i}
            points={poly([
              [xa, curtainTop(xa)],
              [xb, curtainTop(xb)],
              [xb, curtainBottom(xb)],
              [xa, curtainBottom(xa)],
            ])}
            fill={`url(#${id}-fold)`}
            opacity={CURTAIN_FOLD_OPACITY[i]}
          />
        ))}
        {/* cool rim on the leading edge + the light leaking behind it */}
        <rect
          x="168"
          y="0"
          width="9"
          height="632"
          fill="#9dbccd"
          opacity="0.22"
          filter={`url(#${id}-blurS)`}
        />
        <ellipse
          cx="196"
          cy="300"
          rx="30"
          ry="330"
          fill="#7ea3b8"
          opacity="0.1"
          filter={`url(#${id}-blurL)`}
        />
        {/* the hem pools on the floor */}
        <ellipse
          cx="88"
          cy="682"
          rx="120"
          ry="26"
          fill="#000"
          opacity="0.6"
          filter={`url(#${id}-blurM)`}
        />
      </g>

      {/* ================= HEADBOARD ================= */}
      <g>
        {/* cast shadow on the feature wall */}
        <rect
          x="424"
          y="452"
          width="752"
          height="180"
          rx="14"
          fill="#000"
          opacity="0.55"
          filter={`url(#${id}-blurM)`}
        />
        {/* warm cove glow escaping behind the panel */}
        <ellipse
          cx="800"
          cy="446"
          rx="380"
          ry="46"
          fill="#e6bd82"
          opacity="0.12"
          filter={`url(#${id}-blurL)`}
        />

        {/* backer frame */}
        <rect
          x="434"
          y="440"
          width="732"
          height={WALL_BASE - 440}
          rx="10"
          fill="#151810"
        />
        {/* fluted channels */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 440 + i * 60;
          const w = 60;
          const rr = 27;
          const top = 446;
          return (
            <path
              key={i}
              d={`M${x} ${WALL_BASE} L${x} ${top + rr} Q${x} ${top} ${x + rr} ${top} L${x + w - rr} ${top} Q${x + w} ${top} ${x + w} ${top + rr} L${x + w} ${WALL_BASE} Z`}
              fill={`url(#${id}-flute)`}
            />
          );
        })}
        {/* fabric weave */}
        <rect
          x="434"
          y="440"
          width="732"
          height={WALL_BASE - 440}
          rx="10"
          fill="#8d9483"
          filter={`url(#${id}-grainFine)`}
          opacity="0.1"
          style={{ mixBlendMode: "overlay" }}
        />
        {/* lamps rake the outer channels; the centre stays quiet */}
        <rect
          x="434"
          y="440"
          width="732"
          height={WALL_BASE - 440}
          rx="10"
          fill={`url(#${id}-hbWarm)`}
        />
        <rect
          x="434"
          y="440"
          width="732"
          height={WALL_BASE - 440}
          rx="10"
          fill={`url(#${id}-hbFall)`}
        />
        {/* top reveal catching light */}
        <rect
          x="440"
          y="440"
          width="720"
          height="2.5"
          rx="1"
          fill="#7e8471"
          opacity="0.4"
        />
      </g>

      {/* ================= NIGHTSTANDS ================= */}
      {NS_SETS.map(({ x0, x1, mirrored }) => {
        const fx0 = projX(x0, S_NS);
        const fx1 = projX(x1, S_NS);
        const fTop = projY(NS_TOP, S_NS);
        const fBot = projY(NS_BOT, S_NS);
        const fFloor = floorAt(S_NS);
        const innerBack = mirrored ? x0 : x1;
        const innerFront = mirrored ? fx0 : fx1;
        return (
          <g key={mirrored ? "r" : "l"}>
            {/* grounding shadow */}
            <ellipse
              cx={(fx0 + fx1) / 2}
              cy={fFloor + 2}
              rx={(fx1 - fx0) / 2 + 26}
              ry="18"
              fill="#000"
              opacity="0.66"
              filter={`url(#${id}-blurM)`}
            />
            {/* carcass */}
            <polygon
              points={poly([
                [x0, NS_TOP],
                [x1, NS_TOP],
                [fx1, fTop],
                [fx0, fTop],
              ])}
              fill={`url(#${id}-woodTop)`}
            />
            <polygon
              points={poly([
                [innerBack, NS_TOP],
                [innerFront, fTop],
                [innerFront, fBot],
                [innerBack, NS_BOT],
              ])}
              fill={`url(#${id}-woodSide)`}
            />
            <polygon
              points={poly([
                [fx0, fTop],
                [fx1, fTop],
                [fx1, fBot],
                [fx0, fBot],
              ])}
              fill={`url(#${id}-woodFace)`}
            />
            {/* drawer seam + brass pull */}
            <line
              x1={fx0 + 6}
              y1={fTop + 44}
              x2={fx1 - 6}
              y2={fTop + 44}
              stroke="#000"
              strokeWidth="1.4"
              opacity="0.6"
            />
            <rect
              x={(fx0 + fx1) / 2 - 48}
              y={fTop + 24}
              width="96"
              height="3.4"
              rx="1.7"
              fill={`url(#${id}-brass)`}
              opacity="0.9"
            />
            {/* top edge catching the lamp */}
            <polygon
              points={poly([
                [fx0, fTop],
                [fx1, fTop],
                [fx1, fTop + 2.5],
                [fx0, fTop + 2.5],
              ])}
              fill="#b08e5c"
              opacity="0.4"
            />
            {/* slim brass legs */}
            <rect
              x={fx0 + 12}
              y={fBot}
              width="9"
              height={fFloor - fBot}
              fill={`url(#${id}-brass)`}
              opacity="0.75"
            />
            <rect
              x={fx1 - 21}
              y={fBot}
              width="9"
              height={fFloor - fBot}
              fill={`url(#${id}-brass)`}
              opacity="0.75"
            />
          </g>
        );
      })}

      {/* ================= LAMPS ================= */}
      {LAMPS.map(([cx, dim], i) => (
        <g key={i}>
          {/* halo */}
          <ellipse
            cx={cx}
            cy="440"
            rx="256"
            ry="238"
            fill={`url(#${id}-lampGlow)`}
            opacity={dim}
          />
          {/* pool on the nightstand top */}
          <ellipse
            cx={cx - 6}
            cy="556"
            rx="132"
            ry="27"
            fill="#f6d49a"
            opacity={0.2 * dim}
            filter={`url(#${id}-blurM)`}
          />
          {/* shade — seen slightly from above, so the top rim reads */}
          <ellipse cx={cx} cy="398" rx="40" ry="9" fill="#2a1e10" />
          <ellipse
            cx={cx}
            cy="398"
            rx="34"
            ry="6.5"
            fill="#8a6a3c"
            opacity="0.7"
          />
          <path
            d={`M${cx - 40} 398 L${cx - 57} 468 Q${cx} 488 ${cx + 57} 468 L${cx + 40} 398 Q${cx} 407 ${cx - 40} 398 Z`}
            fill={`url(#${id}-shade)`}
            opacity={0.55 + 0.45 * dim}
          />
          <path
            d={`M${cx - 40} 398 L${cx - 57} 468 Q${cx} 488 ${cx + 57} 468 L${cx + 40} 398 Q${cx} 407 ${cx - 40} 398 Z`}
            fill={`url(#${id}-shadeEdge)`}
          />
          {/* light escaping the bottom of the shade */}
          <ellipse
            cx={cx}
            cy="478"
            rx="54"
            ry="16"
            fill="#ffe3b4"
            opacity={0.34 * dim}
            filter={`url(#${id}-blurS)`}
          />
          {/* stem + base */}
          <path
            d={`M${cx - 10} 468 C${cx - 13} 500 ${cx - 9} 520 ${cx - 8} 538 L${cx + 8} 538 C${cx + 9} 520 ${cx + 13} 500 ${cx + 10} 468 Z`}
            fill={`url(#${id}-brass)`}
          />
          <ellipse cx={cx} cy="546" rx="34" ry="8" fill="#000" opacity="0.5" />
          <ellipse cx={cx} cy="541" rx="31" ry="8" fill={`url(#${id}-brass)`} />
        </g>
      ))}

      {/* ---- books, left nightstand ---- */}
      <g>
        <ellipse
          cx="326"
          cy="557"
          rx="42"
          ry="8"
          fill="#000"
          opacity="0.55"
          filter={`url(#${id}-blurS)`}
        />
        <polygon points="298,545 366,545 360,552 292,552" fill="#2b3626" />
        <polygon points="292,552 360,552 360,558 292,558" fill="#1d2419" />
        <polygon points="306,534 364,534 358,541 300,541" fill="#8f8571" />
        <polygon points="300,541 358,541 358,546 300,546" fill="#6a6154" />
        <rect
          x="302"
          y="543"
          width="52"
          height="1.4"
          fill="#c8a765"
          opacity="0.7"
        />
      </g>

      {/* ---- vase + dry stems, right nightstand ---- */}
      <g>
        <ellipse
          cx="1263"
          cy="556"
          rx="30"
          ry="7"
          fill="#000"
          opacity="0.55"
          filter={`url(#${id}-blurS)`}
        />
        <path
          d="M1248 553 C1242 535 1249 520 1257 515 L1269 515 C1277 520 1284 535 1278 553 Z"
          fill="#3b3831"
        />
        <path
          d="M1252 552 C1247 536 1252 522 1258 517 L1262 517 C1256 523 1252 537 1256 552 Z"
          fill="#585349"
          opacity="0.65"
        />
        <ellipse cx="1263" cy="515" rx="6.5" ry="2.2" fill="#191713" />
        <g stroke="#4e4636" strokeWidth="1.6" fill="none" opacity="0.85">
          <path d="M1261 515 C1254 492 1250 468 1246 444" />
          <path d="M1265 515 C1270 494 1274 474 1277 456" />
        </g>
        <g fill="#5c5340" opacity="0.8">
          <ellipse cx="1247" cy="452" rx="3" ry="6" />
          <ellipse cx="1276" cy="463" rx="2.6" ry="5.4" />
        </g>
      </g>

      {/* ================= BED ================= */}
      <g>
        {/* dark mass under the linen */}
        <polygon
          points={poly([
            [BED_L, 596],
            [BED_R, 596],
            [FOOT_R, FOOT_TOP - 6],
            [FOOT_R, 782],
            [FOOT_L, 782],
            [FOOT_L, FOOT_TOP - 6],
          ])}
          fill="#070706"
        />
        {/* floating walnut plinth */}
        <polygon
          points={poly([
            [FOOT_L + 32, 738],
            [FOOT_R - 32, 738],
            [FOOT_R - 32, 778],
            [FOOT_L + 32, 778],
          ])}
          fill={`url(#${id}-plinth)`}
        />

        {/* duvet — left and right drops */}
        <path
          d={`M${BED_L} ${BED_TOP} Q385 626 ${FOOT_L} ${FOOT_TOP} L${FOOT_L} 750 Q392 674 ${BED_L} 602 Z`}
          fill={`url(#${id}-duvetSide)`}
        />
        <path
          d={`M${BED_R} ${BED_TOP} Q1215 626 ${FOOT_R} ${FOOT_TOP} L${FOOT_R} 746 Q1210 670 ${BED_R} 602 Z`}
          fill={`url(#${id}-duvetSide)`}
        />
        {/* duvet — the drop over the foot */}
        <path
          d={`M${FOOT_L} ${FOOT_TOP} C500 707 1100 707 ${FOOT_R} ${FOOT_TOP} L${FOOT_R} 746 C1120 760 640 756 ${FOOT_L} 750 Z`}
          fill={`url(#${id}-duvetFront)`}
        />
        {/* duvet — top surface */}
        <path
          d={`M${BED_L} ${BED_TOP} L${BED_R} ${BED_TOP} Q1215 626 ${FOOT_R} ${FOOT_TOP} C1100 707 500 707 ${FOOT_L} ${FOOT_TOP} Q385 626 ${BED_L} ${BED_TOP} Z`}
          fill={`url(#${id}-duvetTop)`}
        />
        {/* creases — soft shadow with a lifted highlight beside it */}
        <g fill="none" strokeLinecap="round">
          <g stroke="#38332b" strokeWidth="11" opacity="0.5">
            <path d="M566 596 C624 628 642 664 608 698" />
            <path d="M1036 596 C984 630 966 664 996 698" />
            <path d="M688 640 C766 660 862 658 926 638" />
            <path d="M452 672 C560 690 700 698 800 698" />
            <path d="M1148 672 C1040 690 900 698 800 698" />
          </g>
          <g stroke="#c2b8a4" strokeWidth="4.5" opacity="0.3">
            <path d="M578 594 C634 626 652 662 620 696" />
            <path d="M1024 594 C974 628 956 662 984 696" />
            <path d="M690 633 C768 653 864 651 928 631" />
          </g>
          {/* the duvet lifts along the centre of the mattress */}
          <path
            d="M800 570 C806 612 806 656 800 700"
            stroke="#cdc3ae"
            strokeWidth="26"
            opacity="0.07"
          />
        </g>
        {/* linen weave */}
        <path
          d={`M${BED_L} ${BED_TOP} L${BED_R} ${BED_TOP} Q1215 626 ${FOOT_R} ${FOOT_TOP} L${FOOT_R} 750 L${FOOT_L} 750 L${FOOT_L} ${FOOT_TOP} Q385 626 ${BED_L} ${BED_TOP} Z`}
          fill="#a89f8c"
          filter={`url(#${id}-grainFine)`}
          opacity="0.09"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* pillows sink into the duvet */}
        <ellipse
          cx="800"
          cy="592"
          rx="290"
          ry="34"
          fill="#000"
          opacity="0.42"
          filter={`url(#${id}-blurM)`}
        />
        {/* euro shams against the headboard */}
        {[642, 958].map((cx) => (
          <g key={cx}>
            <path
              d={`M${cx - 78} 578 C${cx - 86} 528 ${cx - 68} 502 ${cx} 500 C${cx + 68} 502 ${cx + 86} 528 ${cx + 78} 578 C${cx + 40} 588 ${cx - 40} 588 ${cx - 78} 578 Z`}
              fill={`url(#${id}-pillow)`}
            />
            <path
              d={`M${cx - 74} 526 C${cx - 40} 512 ${cx + 40} 512 ${cx + 74} 526`}
              fill="none"
              stroke="#cfc5b0"
              strokeWidth="5"
              opacity="0.22"
            />
            <path
              d={`M${cx - 78} 574 C${cx - 40} 584 ${cx + 40} 584 ${cx + 78} 574`}
              fill="none"
              stroke="#2e2b25"
              strokeWidth="7"
              opacity="0.35"
            />
          </g>
        ))}
        {/* the gap between the shams falls away */}
        <ellipse
          cx="800"
          cy="572"
          rx="24"
          ry="28"
          fill="#000"
          opacity="0.4"
          filter={`url(#${id}-blurM)`}
        />
        {/* sleeping pillows, lying flatter */}
        {[670, 930].map((cx) => (
          <g key={cx}>
            <ellipse
              cx={cx}
              cy="620"
              rx="112"
              ry="16"
              fill="#000"
              opacity="0.35"
              filter={`url(#${id}-blurS)`}
            />
            <path
              d={`M${cx - 118} 616 C${cx - 124} 578 ${cx - 84} 556 ${cx} 556 C${cx + 84} 556 ${cx + 124} 578 ${cx + 118} 616 C${cx + 60} 628 ${cx - 60} 628 ${cx - 118} 616 Z`}
              fill={`url(#${id}-pillow)`}
            />
            <path
              d={`M${cx - 92} 570 C${cx - 40} 560 ${cx + 40} 560 ${cx + 92} 570`}
              fill="none"
              stroke="#cdc3ae"
              strokeWidth="3"
              opacity="0.3"
            />
          </g>
        ))}

        {/* folded-back top sheet */}
        <path
          d="M384 636.8 L1216 636.8 C1240 646 1244 654 1248 660.4 C1000 672 600 672 352 660.4 C356 654 360 646 384 636.8 Z"
          fill={`url(#${id}-sheet)`}
        />
        <path
          d="M384 636.8 L1216 636.8"
          fill="none"
          stroke="#000"
          strokeWidth="6"
          opacity="0.28"
          filter={`url(#${id}-blurS)`}
        />

        {/* bronze bolster */}
        <ellipse
          cx="800"
          cy="640"
          rx="90"
          ry="12"
          fill="#000"
          opacity="0.4"
          filter={`url(#${id}-blurS)`}
        />
        <path
          d="M714 634 C712 612 740 602 800 602 C860 602 888 612 886 634 C852 642 748 642 714 634 Z"
          fill={`url(#${id}-bolster)`}
        />
        <ellipse
          cx="719"
          cy="620"
          rx="8"
          ry="15"
          fill="#3f3320"
          opacity="0.5"
        />
        <ellipse
          cx="881"
          cy="620"
          rx="8"
          ry="15"
          fill="#3f3320"
          opacity="0.5"
        />
        <path
          d="M726 612 C770 606 830 606 874 612"
          fill="none"
          stroke="#c8a765"
          strokeWidth="1.6"
          opacity="0.4"
        />

        {/* folded throw across the foot */}
        <path
          d="M454.4 669.8 L1145.6 669.8 L1172 695.8 C1120 706 900 710 800 710 C700 710 480 706 428 695.8 Z"
          fill={`url(#${id}-throw)`}
        />
        <path
          d="M466 682 C700 692 1000 692 1136 682"
          fill="none"
          stroke="#9c8154"
          strokeWidth="2.5"
          opacity="0.18"
        />
        {/* the drop over the foot rail sits in shadow */}
        <path
          d="M428 695.8 C480 706 700 710 800 710 C900 710 1120 706 1172 695.8 L1172 716 C1100 730 900 734 800 732 C700 730 490 728 428 720 Z"
          fill="#2b2317"
        />
        <path
          d="M428 695.8 C480 706 700 710 800 710 C900 710 1120 706 1172 695.8 L1172 716 C1100 730 900 734 800 732 C700 730 490 728 428 720 Z"
          fill={`url(#${id}-throw)`}
          opacity="0.4"
        />
        <path
          d="M454.4 669.8 L1145.6 669.8"
          fill="none"
          stroke="#0f0c07"
          strokeWidth="4"
          opacity="0.3"
        />
        {/* the hem casts onto the duvet drop below */}
        <path
          d="M428 720 C490 728 700 730 800 732 C900 734 1100 730 1172 716"
          fill="none"
          stroke="#000"
          strokeWidth="9"
          opacity="0.4"
          filter={`url(#${id}-blurS)`}
        />

        {/* the lamps rake both flanks of the bed */}
        <polygon
          points={poly([
            [BED_L, BED_TOP],
            [BED_R, BED_TOP],
            [FOOT_R, FOOT_TOP],
            [FOOT_R, 780],
            [FOOT_L, 780],
            [FOOT_L, FOOT_TOP],
          ])}
          fill={`url(#${id}-hbWarm)`}
          opacity="0.5"
        />
        {/* deep shadow beneath the plinth */}
        <ellipse
          cx="800"
          cy="781"
          rx="490"
          ry="20"
          fill="#000"
          opacity="0.75"
          filter={`url(#${id}-blurM)`}
        />
      </g>

      {/* ================= GRADE ================= */}
      <rect width="1600" height="900" fill={`url(#${id}-vig)`} />
      <ellipse
        cx="800"
        cy="300"
        rx="420"
        ry="270"
        fill="#e8c894"
        opacity="0.05"
        filter={`url(#${id}-blurXL)`}
      />
      <rect
        width="1600"
        height="900"
        fill="#8c8880"
        filter={`url(#${id}-grainFine)`}
        opacity="0.055"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}
