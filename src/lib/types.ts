export type AnimalKind =
  | "elephant"
  | "lion"
  | "leopard"
  | "cheetah"
  | "giraffe"
  | "zebra"
  | "rhino"
  | "buffalo"
  | "wildebeest"
  | "gazelle"
  | "flamingo"
  | "eagle";

export type PaletteName =
  | "dawn"
  | "dusk"
  | "midnight"
  | "amber"
  | "storm"
  | "ember"
  | "mist"
  | "verdant";

export type Orientation = "landscape" | "portrait" | "square";

export interface SizeOption {
  id: string;
  label: string; // human label
  inches: string; // e.g. 24 × 16"
  priceMultiplier: number;
}

export interface PaperOption {
  id: string;
  label: string;
  description: string;
  priceAdd: number;
}

export interface FrameOption {
  id: string;
  label: string;
  description: string;
  /** CSS colour for the wood/frame rail */
  wood: string;
  woodEdge: string;
  priceAdd: number;
}

export interface GlassOption {
  id: string;
  label: string;
  description: string;
  priceAdd: number;
}

export interface Print {
  slug: string;
  title: string;
  animal: AnimalKind;
  location: string;
  year: number;
  orientation: Orientation;
  palette: PaletteName;
  editionOf: number;
  basePrice: number; // INR, for the base size / paper / frameless
  story: string;
  tags: string[];
  featured?: boolean;
}

export interface PrintConfig {
  sizeId: string;
  paperId: string;
  frameId: string;
  glassId: string;
}

export interface CartLine {
  id: string; // slug + config hash
  slug: string;
  title: string;
  animal: AnimalKind;
  palette: PaletteName;
  orientation: Orientation;
  config: PrintConfig;
  configLabel: string;
  unitPrice: number;
  qty: number;
}
