import type { PaletteName } from "./types";

export interface ScenePalette {
  /** sky gradient stops, top → bottom */
  sky: [string, string, string];
  /** the sun/moon disc colour */
  orb: string;
  orbGlow: string;
  /** haze band near the horizon */
  haze: string;
  /** far hills */
  hillsFar: string;
  /** mid hills */
  hillsMid: string;
  /** foreground ground */
  ground: string;
  /** silhouette colour (animals, trees) */
  silhouette: string;
}

/**
 * Restrained, dark-leaning palettes evoking different hours on the Mara.
 * Kept intentionally muted and cinematic — no garish saturation.
 */
export const PALETTES: Record<PaletteName, ScenePalette> = {
  dawn: {
    sky: ["#141c22", "#43423a", "#9c7a52"],
    orb: "#e9c48a",
    orbGlow: "#c8a765",
    haze: "#b99368",
    hillsFar: "#2c3129",
    hillsMid: "#1c231d",
    ground: "#10130f",
    silhouette: "#0a0c0a",
  },
  dusk: {
    sky: ["#0f1512", "#3a2f2a", "#8a5a41"],
    orb: "#d98b57",
    orbGlow: "#b7683b",
    haze: "#7c4f3a",
    hillsFar: "#2a2620",
    hillsMid: "#1a1815",
    ground: "#0e0d0b",
    silhouette: "#080706",
  },
  midnight: {
    sky: ["#070b10", "#0d1620", "#1c2c33"],
    orb: "#cdd7dc",
    orbGlow: "#5f7480",
    haze: "#243138",
    hillsFar: "#121a1e",
    hillsMid: "#0c1114",
    ground: "#080a0b",
    silhouette: "#040607",
  },
  amber: {
    sky: ["#161310", "#4a3620", "#b07d3a"],
    orb: "#f2c66a",
    orbGlow: "#d39b3f",
    haze: "#a9762f",
    hillsFar: "#2f2717",
    hillsMid: "#1e1810",
    ground: "#100c07",
    silhouette: "#0a0703",
  },
  storm: {
    sky: ["#0c0f11", "#20272a", "#454f4f"],
    orb: "#9aa7a6",
    orbGlow: "#5c6a68",
    haze: "#39433f",
    hillsFar: "#1a2020",
    hillsMid: "#111616",
    ground: "#0a0d0d",
    silhouette: "#050707",
  },
  ember: {
    sky: ["#120d0c", "#3a1f18", "#7c3a24"],
    orb: "#e08a4e",
    orbGlow: "#c25e30",
    haze: "#7a3c22",
    hillsFar: "#291913",
    hillsMid: "#19100c",
    ground: "#0d0806",
    silhouette: "#080403",
  },
  mist: {
    sky: ["#101413", "#28322f", "#5c6f64"],
    orb: "#dfe6dd",
    orbGlow: "#8fa093",
    haze: "#4a5850",
    hillsFar: "#1c2421",
    hillsMid: "#131917",
    ground: "#0b0f0d",
    silhouette: "#070a09",
  },
  verdant: {
    sky: ["#0b110d", "#1c2a1f", "#3f5a3f"],
    orb: "#e6d59a",
    orbGlow: "#a8b070",
    haze: "#37472f",
    hillsFar: "#182014",
    hillsMid: "#0f150e",
    ground: "#090c08",
    silhouette: "#050705",
  },
};
