import type {
  FrameOption,
  GlassOption,
  PaperOption,
  Print,
  PrintConfig,
  SizeOption,
} from "./types";

export const SIZES: SizeOption[] = [
  {
    id: "gallery",
    label: "Gallery",
    inches: "24 × 16 in",
    priceMultiplier: 1,
  },
  {
    id: "collector",
    label: "Collector",
    inches: "36 × 24 in",
    priceMultiplier: 1.6,
  },
  {
    id: "exhibition",
    label: "Exhibition",
    inches: "48 × 32 in",
    priceMultiplier: 2.4,
  },
  {
    id: "monumental",
    label: "Monumental",
    inches: "72 × 48 in",
    priceMultiplier: 3.8,
  },
];

export const PAPERS: PaperOption[] = [
  {
    id: "archival-matte",
    label: "Archival Cotton Matte",
    description:
      "100% cotton rag, 310 gsm. A soft, painterly surface with deep, quiet blacks.",
    priceAdd: 0,
  },
  {
    id: "baryta-gloss",
    label: "Baryta Fibre Gloss",
    description:
      "Barium-sulphate coated fibre, 315 gsm. The tonal depth of a darkroom silver print.",
    priceAdd: 4500,
  },
];

export const FRAMES: FrameOption[] = [
  {
    id: "frameless",
    label: "Unframed",
    description: "The print alone, rolled in an archival tube. For your own framer.",
    wood: "transparent",
    woodEdge: "transparent",
    priceAdd: 0,
  },
  {
    id: "natural-oak",
    label: "Natural Oak",
    description: "Kiln-dried oak, hand-finished with natural oil. Light, warm grain.",
    wood: "#8a6f4d",
    woodEdge: "#6e5638",
    priceAdd: 12000,
  },
  {
    id: "dark-walnut",
    label: "Dark Walnut",
    description: "Deep chocolate walnut with a satin wax finish. Quietly opulent.",
    wood: "#4a3524",
    woodEdge: "#332417",
    priceAdd: 15000,
  },
  {
    id: "ebonised",
    label: "Ebonised Black",
    description: "Ebonised hardwood, near-black, museum profile. Disappears into the work.",
    wood: "#1c1a17",
    woodEdge: "#0e0d0b",
    priceAdd: 15000,
  },
];

export const GLASS: GlassOption[] = [
  {
    id: "none",
    label: "No Glazing",
    description: "For unframed prints, or framing later.",
    priceAdd: 0,
  },
  {
    id: "museum",
    label: "Museum Glass",
    description:
      "99% UV protection, near-invisible anti-reflective coating. The gallery standard.",
    priceAdd: 9000,
  },
];

export function getSize(id: string): SizeOption {
  return SIZES.find((s) => s.id === id) ?? SIZES[0];
}
export function getPaper(id: string): PaperOption {
  return PAPERS.find((p) => p.id === id) ?? PAPERS[0];
}
export function getFrame(id: string): FrameOption {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
export function getGlass(id: string): GlassOption {
  return GLASS.find((g) => g.id === id) ?? GLASS[0];
}

export function computePrice(print: Print, config: PrintConfig): number {
  const size = getSize(config.sizeId);
  const paper = getPaper(config.paperId);
  const frame = getFrame(config.frameId);
  const glass = getGlass(config.glassId);
  const base = Math.round(print.basePrice * size.priceMultiplier);
  return base + paper.priceAdd + frame.priceAdd + glass.priceAdd;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function describeConfig(config: PrintConfig): string {
  const size = getSize(config.sizeId);
  const paper = getPaper(config.paperId);
  const frame = getFrame(config.frameId);
  const glass = getGlass(config.glassId);
  const parts = [
    `${size.label} (${size.inches})`,
    paper.label,
    frame.label,
  ];
  if (glass.id !== "none") parts.push(glass.label);
  return parts.join(" · ");
}

export const DEFAULT_CONFIG: PrintConfig = {
  sizeId: "gallery",
  paperId: "archival-matte",
  frameId: "dark-walnut",
  glassId: "museum",
};
