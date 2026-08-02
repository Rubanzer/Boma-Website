import type { ReactElement } from "react";

/**
 * Hand-finished hardwood picture-frame moulding, drawn entirely in SVG.
 *
 * A frame rail is not a gradient — it is a milled cross-section with a
 * crown, a chamfer, a cove and an inner lip, cut from a board whose grain
 * runs down its length. Everything here is built from that idea: a tonal
 * profile across the rail's short axis, anisotropic turbulence for the
 * grain, a coarser pass for the cathedral figure, a sparse pass for open
 * pores, then explicit bevel bands and a satin sheen on top.
 *
 * The whole frame is lit consistently from the TOP-LEFT: the top and left
 * rails catch the light on their outer chamfer, the bottom and right rails
 * are occluded there and brighten only on the inner slope.
 */

export type WoodFinishId = "natural-oak" | "dark-walnut" | "ebonised";

export interface WoodFinish {
  id: WoodFinishId;
  label: string;
  base: string; // mid tone hex
  dark: string; // shadow/pore tone hex
  light: string; // highlight tone hex
}

export const WOOD_FINISHES: Record<WoodFinishId, WoodFinish> = {
  "natural-oak": {
    id: "natural-oak",
    label: "Natural Oak",
    base: "#b5854f",
    dark: "#5f4126",
    light: "#ead0a1",
  },
  "dark-walnut": {
    id: "dark-walnut",
    label: "Dark Walnut",
    base: "#50301f",
    dark: "#1d1008",
    light: "#a5734a",
  },
  ebonised: {
    id: "ebonised",
    label: "Ebonised Black",
    base: "#1b1917",
    dark: "#080807",
    light: "#57504a",
  },
};

type RailSide = "top" | "bottom" | "left" | "right";

/**
 * Per-species texture recipe. `*K` / `*O` are the slope and offset used to
 * stretch a turbulence channel into a mask alpha — a high K with a deep
 * negative O keeps only the extremes, which is how sparse pores are cut.
 */
interface GrainRecipe {
  /** across-grain frequency multiplier: oak is open-pored, walnut is tight */
  grainScale: number;
  grainInk: string;
  grainAlpha: number;
  grainK: number;
  grainO: number;
  figureInk: string;
  figureAlpha: number;
  figureK: number;
  figureO: number;
  poreInk: string;
  poreAlpha: number;
  poreK: number;
  poreO: number;
  fleckAlpha: number;
  fleckK: number;
  fleckO: number;
  /** peak opacity of the satin sheen on the crown */
  sheen: number;
}

const GRAIN: Record<WoodFinishId, GrainRecipe> = {
  // Wide, open pore and a loud cathedral figure — oak announces itself.
  "natural-oak": {
    grainScale: 0.72,
    grainInk: "#5d3d1d",
    grainAlpha: 0.7,
    grainK: 1.75,
    grainO: -0.62,
    figureInk: "#7a5326",
    figureAlpha: 0.46,
    figureK: 1.5,
    figureO: -0.08,
    poreInk: "#33200d",
    poreAlpha: 0.72,
    poreK: 5.2,
    poreO: -3.2,
    fleckAlpha: 0.18,
    fleckK: 4.6,
    fleckO: -3.1,
    sheen: 0.13,
  },
  // Tighter, richer, reddish under the chocolate. Pores nearly closed.
  "dark-walnut": {
    grainScale: 1.25,
    grainInk: "#2b1810",
    grainAlpha: 0.78,
    grainK: 1.85,
    grainO: -0.66,
    figureInk: "#3b2413",
    figureAlpha: 0.52,
    figureK: 1.6,
    figureO: -0.1,
    poreInk: "#150a04",
    poreAlpha: 0.52,
    poreK: 5.8,
    poreO: -3.6,
    fleckAlpha: 0.15,
    fleckK: 5.0,
    fleckO: -3.4,
    sheen: 0.11,
  },
  // Grain is only just legible under the stain; the sheen does the work.
  ebonised: {
    grainScale: 1.0,
    grainInk: "#0d0c0b",
    grainAlpha: 0.58,
    grainK: 1.6,
    grainO: -0.58,
    figureInk: "#171512",
    figureAlpha: 0.34,
    figureK: 1.5,
    figureO: -0.06,
    poreInk: "#000000",
    poreAlpha: 0.34,
    poreK: 5.6,
    poreO: -3.5,
    fleckAlpha: 0.12,
    fleckK: 5.2,
    fleckO: -3.6,
    sheen: 0.16,
  },
};

/** Rail user-space box: long and thin, so turbulence stays near-isotropic
 *  once `preserveAspectRatio="none"` squashes it into a real frame rail. */
const RAIL_LEN = 1200;
const RAIL_DEP = 48;

/** Different seed per side so the four rails read as four boards. */
const SEED: Record<RailSide, number> = { top: 7, right: 23, bottom: 53, left: 89 };

/** Base turbulence frequencies, expressed as (along the rail, across it). */
const F_GRAIN_ALONG = 0.0026;
const F_GRAIN_ACROSS = 0.155;
const F_FIGURE_ALONG = 0.0009;
const F_FIGURE_ACROSS = 0.03;
const F_PORE_ALONG = 0.021;
const F_PORE_ACROSS = 0.52;

/** Tone stops across the moulding, outer edge (0) → inner lip (1).
 *  Values are positions on the finish's dark↔light ramp. */
const PROFILE_LIT: ReadonlyArray<readonly [number, number]> = [
  [0, -0.55], // the outer arris rolls over and away from the light
  [0.03, 0.62],
  [0.14, 0.85], // chamfer square-on to the light — the brightest line
  [0.3, 0.3],
  [0.48, 0.02], // the crown, sitting at the finish's true colour
  [0.66, -0.16],
  [0.82, -0.42], // cove falling into shade
  [0.93, -0.72],
  [1, -0.92], // inner lip, buried against the mat
];

const PROFILE_SHADE: ReadonlyArray<readonly [number, number]> = [
  [0, -0.95], // outer edge fully occluded on the unlit sides
  [0.04, -0.72],
  [0.16, -0.5],
  [0.36, -0.28],
  [0.58, -0.05],
  [0.76, 0.22], // inner slope tips back towards the light
  [0.88, 0.45],
  [0.96, -0.1],
  [1, -0.6],
];

/** Additive chamfer specular, band-local. */
const CHAMFER_LIT: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.13, 0.24],
  [0.42, 0.08],
  [1, 0],
];
const CHAMFER_SHADE: ReadonlyArray<readonly [number, number]> = [
  [0, 0.34],
  [0.35, 0.12],
  [1, 0],
];

/** Satin wax sheen along the crown — wide and weak, never a gloss stripe. */
const SHEEN: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.4, 1],
  [0.72, 0.4],
  [1, 0],
];

/** Occlusion gathering in the cove and under the inner lip. */
const OCCLUSION: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.55, 0.2],
  [0.86, 0.42],
  [1, 0.3],
];

/** The rail loses light as it runs away from the top-left. */
const FALLOFF: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.55, 0.06],
  [1, 0.17],
];

/** Linear blend of two #rrggbb strings. */
function mixHex(a: string, b: string, t: number): string {
  const ai = Number.parseInt(a.slice(1), 16);
  const bi = Number.parseInt(b.slice(1), 16);
  const channel = (shift: number): number => {
    const ca = (ai >> shift) & 0xff;
    const cb = (bi >> shift) & 0xff;
    return Math.round(ca + (cb - ca) * t);
  };
  return `#${((channel(16) << 16) | (channel(8) << 8) | channel(0)).toString(16).padStart(6, "0")}`;
}

/** Position on a finish's ramp: -1 is its deepest shadow, +1 its highlight. */
function tone(f: WoodFinish, v: number): string {
  if (v > 0) return mixHex(f.base, f.light, Math.min(v, 1));
  if (v < 0) return mixHex(f.base, f.dark, Math.min(-v, 1));
  return f.base;
}

/**
 * ONE frame rail. Renders an <svg> that FILLS its parent box
 * (width/height 100%, preserveAspectRatio="none"), so the parent controls
 * size and position and may CSS-scale it for animation.
 */
export function WoodRail({
  side,
  finish = "dark-walnut",
  id,
  className,
  mitre,
}: {
  side: RailSide;
  finish?: WoodFinishId;
  /** unique prefix so gradient/filter ids never collide across instances */
  id: string;
  className?: string;
  /**
   * How far the 45° mitre cuts back, as a fraction of the rail's LENGTH.
   * Defaults to a sensible standalone value; `WoodFrameBorder` passes 0
   * because it cuts the joint itself in CSS, where it can stay pixel-exact
   * at any frame aspect ratio.
   */
  mitre?: number;
}): ReactElement {
  const f = WOOD_FINISHES[finish];
  const g = GRAIN[finish];

  const horizontal = side === "top" || side === "bottom";
  const lit = side === "top" || side === "left";
  const w = horizontal ? RAIL_LEN : RAIL_DEP;
  const h = horizontal ? RAIL_DEP : RAIL_LEN;
  const seed = SEED[side];

  // Grain streaks must run ALONG the rail, so the frequency pair is swapped
  // for the stiles. Everything downstream is written once, side-agnostic.
  const freq = (along: number, across: number): string =>
    horizontal
      ? `${along.toFixed(5)} ${across.toFixed(4)}`
      : `${across.toFixed(4)} ${along.toFixed(5)}`;

  // Gradient vectors in objectBoundingBox units: `acr` always runs from the
  // rail's OUTER edge to its inner lip, `lng` from the lit end to the far one.
  const acr =
    side === "top"
      ? { x1: 0, y1: 0, x2: 0, y2: 1 }
      : side === "bottom"
        ? { x1: 0, y1: 1, x2: 0, y2: 0 }
        : side === "left"
          ? { x1: 0, y1: 0, x2: 1, y2: 0 }
          : { x1: 1, y1: 0, x2: 0, y2: 0 };
  const lng = horizontal
    ? { x1: 0, y1: 0, x2: 1, y2: 0 }
    : { x1: 0, y1: 0, x2: 0, y2: 1 };

  /** A strip spanning the full length, between two depth fractions. */
  const band = (d0: number, d1: number) => {
    const a = d0 * RAIL_DEP;
    const b = d1 * RAIL_DEP;
    if (side === "top") return { x: 0, y: a, width: RAIL_LEN, height: b - a };
    if (side === "bottom")
      return { x: 0, y: RAIL_DEP - b, width: RAIL_LEN, height: b - a };
    if (side === "left") return { x: a, y: 0, width: b - a, height: RAIL_LEN };
    return { x: RAIL_DEP - b, y: 0, width: b - a, height: RAIL_LEN };
  };

  // 45° mitre: the outer edge keeps the full length, the inner edge is cut
  // back at both ends so four rails tessellate into closed corners.
  const cut = (mitre ?? (horizontal ? 0.036 : 0.05)) * RAIL_LEN;
  const mitrePath =
    side === "top"
      ? `M0 0 H${RAIL_LEN} L${RAIL_LEN - cut} ${RAIL_DEP} H${cut} Z`
      : side === "bottom"
        ? `M0 ${RAIL_DEP} H${RAIL_LEN} L${RAIL_LEN - cut} 0 H${cut} Z`
        : side === "left"
          ? `M0 0 L${RAIL_DEP} ${cut} L${RAIL_DEP} ${RAIL_LEN - cut} L0 ${RAIL_LEN} Z`
          : `M${RAIL_DEP} 0 L${RAIL_DEP} ${RAIL_LEN} L0 ${RAIL_LEN - cut} L0 ${cut} Z`;

  const profile = lit ? PROFILE_LIT : PROFILE_SHADE;
  const chamfer = lit ? CHAMFER_LIT : CHAMFER_SHADE;
  const chamferInk = lit ? "#ffffff" : "#000000";
  const occlusionScale = lit ? 1 : 0.6;

  // Masks are cut from a single turbulence channel: R for the dark grain,
  // G for the light flecks, so the two decorrelate without a second pass.
  const maskR = (k: number, o: number): string =>
    `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 ${o}`;
  const maskG = (k: number, o: number): string =>
    `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 ${k} 0 0 ${o}`;
  // feTurbulence emits a noisy alpha too; forcing it opaque first stops the
  // un-premultiply step from tearing the channels we are about to read.
  const OPAQUE = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${id}-mitre`}>
          <path d={mitrePath} />
        </clipPath>

        {/* the milled cross-section, read as tone */}
        <linearGradient id={`${id}-profile`} {...acr}>
          {profile.map(([o, v]) => (
            <stop key={o} offset={o} stopColor={tone(f, v)} />
          ))}
        </linearGradient>

        {/* timber: grain, figure, pores and chatoyance, all multiplied /
            screened onto the profile inside one filter so no CSS blend
            mode is needed and nothing can leak onto the page behind it */}
        <filter
          id={`${id}-timber`}
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={w}
          height={h}
          colorInterpolationFilters="sRGB"
        >
          {/* 1 — primary grain: long, tight streaks running down the rail */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq(F_GRAIN_ALONG, F_GRAIN_ACROSS * g.grainScale)}
            numOctaves={4}
            seed={seed}
            result="grainRaw"
          />
          <feColorMatrix in="grainRaw" type="matrix" values={OPAQUE} result="grainNoise" />
          <feColorMatrix
            in="grainNoise"
            type="matrix"
            values={maskR(g.grainK, g.grainO)}
            result="grainMask"
          />
          <feFlood floodColor={g.grainInk} floodOpacity={g.grainAlpha} result="grainInk" />
          <feComposite in="grainInk" in2="grainMask" operator="in" result="grainLayer" />
          <feBlend in="grainLayer" in2="SourceGraphic" mode="multiply" result="stage1" />

          {/* 2 — cathedral figure: slow arcs of darker heartwood */}
          <feTurbulence
            type="turbulence"
            baseFrequency={freq(F_FIGURE_ALONG, F_FIGURE_ACROSS)}
            numOctaves={2}
            seed={seed + 13}
            result="figRaw"
          />
          <feColorMatrix in="figRaw" type="matrix" values={OPAQUE} result="figNoise" />
          <feColorMatrix
            in="figNoise"
            type="matrix"
            values={maskR(g.figureK, g.figureO)}
            result="figMask"
          />
          <feFlood floodColor={g.figureInk} floodOpacity={g.figureAlpha} result="figInk" />
          <feComposite in="figInk" in2="figMask" operator="in" result="figLayer" />
          <feBlend in="figLayer" in2="stage1" mode="multiply" result="stage2" />

          {/* 3 — open pores: short dark dashes, only the extremes survive */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency={freq(F_PORE_ALONG, F_PORE_ACROSS)}
            numOctaves={2}
            seed={seed + 31}
            result="poreRaw"
          />
          <feColorMatrix in="poreRaw" type="matrix" values={OPAQUE} result="poreNoise" />
          <feColorMatrix
            in="poreNoise"
            type="matrix"
            values={maskR(g.poreK, g.poreO)}
            result="poreMask"
          />
          <feFlood floodColor={g.poreInk} floodOpacity={g.poreAlpha} result="poreInk" />
          <feComposite in="poreInk" in2="poreMask" operator="in" result="poreLayer" />
          <feBlend in="poreLayer" in2="stage2" mode="multiply" result="stage3" />

          {/* 4 — chatoyance: the same fibres catching the wax */}
          <feColorMatrix
            in="grainNoise"
            type="matrix"
            values={maskG(g.fleckK, g.fleckO)}
            result="fleckMask"
          />
          <feFlood floodColor={f.light} floodOpacity={g.fleckAlpha} result="fleckInk" />
          <feComposite in="fleckInk" in2="fleckMask" operator="in" result="fleckLayer" />
          <feBlend in="fleckLayer" in2="stage3" mode="screen" />
        </filter>

        <linearGradient id={`${id}-chamfer`} {...acr}>
          {chamfer.map(([o, a]) => (
            <stop key={o} offset={o} stopColor={chamferInk} stopOpacity={a} />
          ))}
        </linearGradient>

        <linearGradient id={`${id}-sheen`} {...acr}>
          {SHEEN.map(([o, a]) => (
            <stop key={o} offset={o} stopColor="#ffffff" stopOpacity={a * g.sheen} />
          ))}
        </linearGradient>

        <linearGradient id={`${id}-occlusion`} {...acr}>
          {OCCLUSION.map(([o, a]) => (
            <stop key={o} offset={o} stopColor="#000000" stopOpacity={a * occlusionScale} />
          ))}
        </linearGradient>

        <linearGradient id={`${id}-falloff`} {...lng}>
          {FALLOFF.map(([o, a]) => (
            <stop key={o} offset={o} stopColor="#000000" stopOpacity={a} />
          ))}
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id}-mitre)`}>
        {/* the board itself: profile tone, textured by the timber filter */}
        <rect
          x="0"
          y="0"
          width={w}
          height={h}
          fill={`url(#${id}-profile)`}
          filter={`url(#${id}-timber)`}
        />

        {/* specular chamfer on the light-facing edge (or its occlusion) */}
        <rect {...band(0, 0.34)} fill={`url(#${id}-chamfer)`} />

        {/* satin sheen along the crown */}
        <rect {...band(0.18, 0.74)} fill={`url(#${id}-sheen)`} />

        {/* cove shadow gathering into the inner lip — this reads as depth */}
        <rect {...band(0.72, 1)} fill={`url(#${id}-occlusion)`} />

        {/* crisp outer arris */}
        <rect
          {...band(0, 0.022)}
          fill={lit ? "#ffffff" : "#000000"}
          opacity={lit ? 0.3 : 0.42}
        />

        {/* the hard line the moulding casts onto the mat */}
        <rect {...band(0.978, 1)} fill="#000000" opacity="0.55" />

        {/* light falls off along the rail, away from the top-left */}
        <rect x="0" y="0" width={w} height={h} fill={`url(#${id}-falloff)`} />
      </g>
    </svg>
  );
}

/** Hairline mitre joint: a whisker of highlight, then the dark seam. */
function seam(diagonal: "main" | "anti"): string {
  const angle = diagonal === "main" ? "45deg" : "135deg";
  return [
    `linear-gradient(${angle},`,
    "rgba(255,255,255,0) calc(50% - 1.1px),",
    "rgba(255,255,255,0.09) calc(50% - 1.1px),",
    "rgba(255,255,255,0.09) calc(50% - 0.35px),",
    "rgba(0,0,0,0.5) calc(50% - 0.35px),",
    "rgba(0,0,0,0.5) calc(50% + 0.4px),",
    "rgba(255,255,255,0) calc(50% + 0.4px))",
  ].join(" ");
}

/**
 * All four rails absolutely positioned around a box, with mitred corners.
 * The parent must be `position: relative`.
 *
 * `thickness` is a CSS length for the rail depth. Percentages resolve
 * against the parent's WIDTH on every side — the same rule CSS padding
 * uses — so a percentage gives a frame of even depth all the way round,
 * whatever the artwork's aspect ratio.
 */
export function WoodFrameBorder({
  finish = "dark-walnut",
  id,
  thickness = "3.6%",
  className,
}: {
  finish?: WoodFinishId;
  /** unique prefix so gradient/filter ids never collide across instances */
  id: string;
  thickness?: string;
  className?: string;
}): ReactElement {
  // The stiles run the full height as plain rectangles; the rails are cut
  // into trapezoids on top of them. What shows through in each corner is
  // the stile's own wood, with its own vertical grain — which is exactly
  // what a real mitre looks like, and stays exact at any aspect ratio.
  const railClip = `polygon(0 0, 100% 0, calc(100% - ${thickness}) 100%, ${thickness} 100%)`;
  const sillClip = `polygon(${thickness} 0, calc(100% - ${thickness}) 0, 100% 100%, 0 100%)`;

  const svg = "absolute inset-0 block h-full w-full";
  // Zero-height boxes whose padding sets the depth, so percentages track
  // the parent's width exactly as the stiles' `width` does.
  const capBox = { paddingTop: thickness } as const;
  const cornerBox = { width: thickness, paddingTop: thickness } as const;

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <div
        data-wood-rail="left"
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: thickness }}
      >
        <WoodRail side="left" finish={finish} id={`${id}-l`} mitre={0} className={svg} />
      </div>
      <div
        data-wood-rail="right"
        style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: thickness }}
      >
        <WoodRail side="right" finish={finish} id={`${id}-r`} mitre={0} className={svg} />
      </div>

      <div
        data-wood-rail="top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          ...capBox,
          clipPath: railClip,
          WebkitClipPath: railClip,
        }}
      >
        <WoodRail side="top" finish={finish} id={`${id}-t`} mitre={0} className={svg} />
      </div>
      <div
        data-wood-rail="bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          ...capBox,
          clipPath: sillClip,
          WebkitClipPath: sillClip,
        }}
      >
        <WoodRail side="bottom" finish={finish} id={`${id}-b`} mitre={0} className={svg} />
      </div>

      {/* the four joints, drawn last so the seam sits on top of both rails */}
      <span
        style={{ position: "absolute", top: 0, left: 0, ...cornerBox, background: seam("main") }}
      />
      <span
        style={{ position: "absolute", top: 0, right: 0, ...cornerBox, background: seam("anti") }}
      />
      <span
        style={{ position: "absolute", bottom: 0, left: 0, ...cornerBox, background: seam("anti") }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          ...cornerBox,
          background: seam("main"),
        }}
      />
    </div>
  );
}
