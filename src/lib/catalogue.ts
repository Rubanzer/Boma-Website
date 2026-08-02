import type { Print } from "./types";

export const BRAND = "Brahmanand Kori";
export const BRAND_FULL = "Brahmanand Kori Photography";
export const COLLECTION_NAME = "Zawadi";
export const COLLECTION_MEANING = "Swahili — “gift”";

/**
 * The Zawadi collection.
 * Every image is currently rendered as original SVG art (SavannaScene);
 * swapping in real scans later only touches the Print component.
 */
export const CATALOGUE: Print[] = [
  {
    slug: "the-matriarch",
    title: "The Matriarch",
    animal: "elephant",
    location: "Masai Mara, Kenya",
    year: 2024,
    orientation: "landscape",
    palette: "dawn",
    editionOf: 25,
    basePrice: 38000,
    story:
      "She crossed the Sand River at first light, forty years of memory in each unhurried step. The herd waited for her decision, as they always have. I waited too — three mornings — for the light to fall exactly along her back.",
    tags: ["elephant", "dawn", "river crossing"],
    featured: true,
  },
  {
    slug: "sovereign-of-musiara",
    title: "Sovereign of Musiara",
    animal: "lion",
    location: "Musiara Marsh, Masai Mara",
    year: 2024,
    orientation: "landscape",
    palette: "amber",
    editionOf: 20,
    basePrice: 45000,
    story:
      "The marsh pride's male surveyed his ground in the last hour of sun. He did not once look at me. Kings rarely do. The amber haze that evening lasted eleven minutes; this frame was the ninth.",
    tags: ["lion", "golden hour", "portrait"],
    featured: true,
  },
  {
    slug: "silent-fig-tree",
    title: "Silent, in the Fig Tree",
    animal: "leopard",
    location: "Talek River, Masai Mara",
    year: 2023,
    orientation: "portrait",
    palette: "dusk",
    editionOf: 15,
    basePrice: 52000,
    story:
      "Leopards give you nothing. For six days she was a rumour in the riverine forest. On the seventh she poured herself along a fig branch at dusk and let the whole valley hold its breath.",
    tags: ["leopard", "dusk", "rare"],
    featured: true,
  },
  {
    slug: "one-hundred-and-four",
    title: "One Hundred and Four",
    animal: "cheetah",
    location: "Mara Triangle, Kenya",
    year: 2024,
    orientation: "landscape",
    palette: "storm",
    editionOf: 25,
    basePrice: 42000,
    story:
      "A storm was building over the escarpment when she began her run — a grey wall behind the fastest thing on earth. One hundred and four kilometres an hour, and the rain arrived one heartbeat after she did.",
    tags: ["cheetah", "storm", "motion"],
  },
  {
    slug: "the-tall-silence",
    title: "The Tall Silence",
    animal: "giraffe",
    location: "Mara North Conservancy",
    year: 2023,
    orientation: "portrait",
    palette: "mist",
    editionOf: 30,
    basePrice: 34000,
    story:
      "Dawn mist on the Mara flattens the world into paper layers — and then a giraffe walks through it like a signature. Nothing else moved. Nothing else needed to.",
    tags: ["giraffe", "mist", "minimal"],
    featured: true,
  },
  {
    slug: "ten-thousand-crossings",
    title: "Ten Thousand Crossings",
    animal: "wildebeest",
    location: "Mara River, Kenya",
    year: 2024,
    orientation: "landscape",
    palette: "ember",
    editionOf: 25,
    basePrice: 40000,
    story:
      "The great migration does not begin or end; it circles. At the Mara River the herd hesitated for an hour, then the first one leapt — and ten thousand followed, as they have for a million years.",
    tags: ["wildebeest", "migration", "river"],
  },
  {
    slug: "written-in-charcoal",
    title: "Written in Charcoal",
    animal: "zebra",
    location: "Ol Kinyei Conservancy",
    year: 2023,
    orientation: "square",
    palette: "midnight",
    editionOf: 30,
    basePrice: 32000,
    story:
      "Under a nearly full moon the stallion stood apart from the harem, stripes dissolving into the dark like wet charcoal. This is the Mara few people wait long enough to see.",
    tags: ["zebra", "night", "abstract"],
  },
  {
    slug: "the-last-armour",
    title: "The Last Armour",
    animal: "rhino",
    location: "Mara Conservancy, Kenya",
    year: 2024,
    orientation: "landscape",
    palette: "storm",
    editionOf: 12,
    basePrice: 58000,
    story:
      "Fewer black rhinos remain in the Mara than prints in this edition. He emerged from the whistling thorn at dusk, ancient and improbable — armour built for a war he never asked for.",
    tags: ["rhino", "endangered", "dusk"],
  },
  {
    slug: "the-old-testament",
    title: "The Old Testament",
    animal: "buffalo",
    location: "Sand River, Masai Mara",
    year: 2023,
    orientation: "landscape",
    palette: "dusk",
    editionOf: 25,
    basePrice: 36000,
    story:
      "An old bull, cast out of the herd, wears every one of his seasons. The Maasai call them 'the black death'; I photographed instead a patriarch at the end of a long argument with time.",
    tags: ["buffalo", "portrait", "character"],
  },
  {
    slug: "grace-notes",
    title: "Grace Notes",
    animal: "gazelle",
    location: "Paradise Plain, Masai Mara",
    year: 2024,
    orientation: "landscape",
    palette: "verdant",
    editionOf: 30,
    basePrice: 30000,
    story:
      "After the long rains the plains turn briefly, impossibly green, and the Thomson's gazelles move across them like grace notes on a stave. A gentler Mara — and a rarer photograph than any hunt.",
    tags: ["gazelle", "green season", "plains"],
  },
  {
    slug: "a-thousand-flames",
    title: "A Thousand Flames",
    animal: "flamingo",
    location: "Lake Nakuru, Kenya",
    year: 2023,
    orientation: "landscape",
    palette: "dawn",
    editionOf: 20,
    basePrice: 44000,
    story:
      "Before the sun cleared the crater rim, the shallows of Nakuru burned rose and gold — a thousand flamingos feeding in water so still it doubled the world.",
    tags: ["flamingo", "dawn", "reflection"],
  },
  {
    slug: "the-verdict",
    title: "The Verdict",
    animal: "eagle",
    location: "Oloololo Escarpment, Kenya",
    year: 2024,
    orientation: "portrait",
    palette: "ember",
    editionOf: 15,
    basePrice: 48000,
    story:
      "A martial eagle on a dead acacia, delivering the long stare that empties a plain. The light that evening was the colour of embers, and every guinea fowl in the valley knew the verdict.",
    tags: ["eagle", "raptor", "ember"],
  },
];

export function getPrint(slug: string): Print | undefined {
  return CATALOGUE.find((p) => p.slug === slug);
}

export function featuredPrints(): Print[] {
  return CATALOGUE.filter((p) => p.featured);
}

export const EXCLUSIVITY_PHRASES = [
  "Fine-art prints crafted for the select few who value exclusivity.",
  "Editions of twelve to thirty. Never reprinted, never repeated.",
  "The Mara, witnessed — and framed by hand for your wall.",
];
