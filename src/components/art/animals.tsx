import type { AnimalKind } from "@/lib/types";

/**
 * Animal silhouettes as SVG path data, each drawn in a 100×70 box,
 * standing on baseline y=70. Deliberately simple, elegant shapes —
 * they read as fine-art silhouettes at any size.
 */
export function AnimalSilhouette({
  animal,
  fill,
}: {
  animal: AnimalKind;
  fill: string;
}) {
  switch (animal) {
    case "elephant":
      return (
        <g fill={fill}>
          {/* barrel body */}
          <ellipse cx="46" cy="42" rx="26" ry="20" />
          {/* domed head */}
          <ellipse cx="75" cy="37" rx="15" ry="14" />
          {/* legs — columnar, staggered for a walking gait */}
          <path d="M27 55 L25 70 L34 70 L34 55 Z" />
          <path d="M42 58 L41 70 L49 70 L48 58 Z" />
          <path d="M57 56 L56 70 L64 70 L64 56 Z" />
          <path d="M68 53 L68 70 L75 70 L74 53 Z" />
          {/* trunk, curling forward */}
          <path d="M85 39 Q92 47 90 57 Q89 65 83 68 L80 65 Q86 62 86 55 Q86 47 80 42 Z" />
          {/* tusk */}
          <path d="M83 47 Q89 52 88 58 L86 57 Q87 52 81 49 Z" opacity="0.75" />
          {/* ear */}
          <ellipse cx="68" cy="40" rx="11" ry="13" opacity="0.6" />
          {/* tail */}
          <path d="M21 41 Q16 47 18 55 L20 54 Q19 47 23 43 Z" opacity="0.85" />
        </g>
      );
    case "lion":
      return (
        <g fill={fill}>
          {/* hindquarters */}
          <ellipse cx="34" cy="45" rx="15" ry="13" />
          {/* torso */}
          <path d="M28 34 L66 34 Q74 36 74 45 Q74 55 64 57 L34 57 Q26 55 26 45 Q26 37 28 34 Z" />
          {/* shoulder */}
          <ellipse cx="65" cy="45" rx="12" ry="12" />
          {/* legs */}
          <path d="M28 52 L25 70 L31 70 L33 52 Z" />
          <path d="M38 54 L36 70 L42 70 L43 54 Z" />
          <path d="M61 52 L59 70 L65 70 L66 52 Z" />
          <path d="M69 52 L68 70 L74 70 L74 52 Z" />
          {/* the mane — the whole silhouette of a male lion */}
          <circle cx="78" cy="36" r="16" />
          <ellipse cx="82" cy="36" rx="9" ry="8" />
          {/* muzzle */}
          <path d="M88 33 Q96 34 96 39 Q95 43 88 43 Q85 40 85 36 Z" />
          {/* ears */}
          <circle cx="70" cy="24" r="3.4" />
          <circle cx="86" cy="24" r="3.2" />
          {/* tail with tuft */}
          <path d="M26 38 Q12 36 8 48 Q6 56 10 60 L13 58 Q10 54 12 48 Q15 40 27 43 Z" />
          <ellipse cx="10" cy="61" rx="3.2" ry="4" />
        </g>
      );
    case "leopard":
      return (
        <g fill={fill}>
          {/* low slinking cat on branch-line */}
          <path d="M10 58 Q12 48 24 48 L58 48 Q70 44 78 46 Q88 46 90 52 Q91 57 86 58 L84 62 L80 61 L80 56 Q74 54 68 55 L70 66 L65 66 L62 55 L38 55 L40 66 L35 66 L32 55 Q20 56 16 60 L18 66 L13 66 Z" />
          {/* long tail curling */}
          <path d="M10 58 Q2 56 3 48 Q4 42 10 42 Q6 46 8 50 Q10 54 14 54 Z" opacity="0.85" />
          <circle cx="86" cy="50" r="1.4" opacity="0.9" />
        </g>
      );
    case "cheetah":
      return (
        <g fill={fill}>
          {/* full-stretch sprint */}
          <path d="M4 58 Q14 50 26 52 L52 50 Q64 44 74 46 Q84 44 92 40 Q96 39 96 43 Q94 48 86 50 L78 52 Q80 58 74 60 L60 56 L34 58 Q22 62 10 62 Q4 62 4 58 Z" />
          <path d="M4 58 Q-2 52 2 46 Q4 42 8 44 Q4 48 8 52 Z" opacity="0.85" />
          {/* legs extended */}
          <path d="M20 60 L10 70 L14 70 L24 61 Z M70 56 L82 66 L78 68 L66 58 Z" opacity="0.9" />
        </g>
      );
    case "giraffe":
      return (
        <g fill={fill}>
          <path d="M30 70 L32 50 Q30 44 36 42 L56 40 Q58 38 60 24 Q61 12 68 8 Q71 6 72 9 L78 12 Q80 14 77 15 L72 14 Q68 18 67 28 Q66 40 62 44 Q64 48 62 52 L60 70 L56 70 L57 52 L44 50 L44 70 L40 70 L40 50 L36 50 L35 70 Z" />
          {/* ossicones + ear */}
          <path d="M68 7 L67 3 L69 3 Z M72 8 L73 4 L74 8 Z" />
          <path d="M74 11 Q78 9 80 11 Q78 13 74 13 Z" opacity="0.8" />
        </g>
      );
    case "zebra":
      return (
        <g fill={fill}>
          <path d="M16 70 L18 54 Q14 44 24 40 L56 38 Q62 30 70 28 Q80 26 84 32 Q88 36 86 40 L80 42 Q76 44 74 48 L72 54 L74 70 L69 70 L66 56 L44 56 L44 70 L39 70 L38 55 L26 54 L24 70 Z" />
          {/* mane ridge */}
          <path d="M58 38 Q64 30 72 29 L72 33 Q64 34 60 40 Z" opacity="0.7" />
          {/* tail */}
          <path d="M16 54 Q10 56 10 62 L12 62 Q13 58 18 57 Z" opacity="0.8" />
        </g>
      );
    case "rhino":
      return (
        <g fill={fill}>
          <path d="M12 70 L13 56 Q10 42 26 38 Q42 34 58 38 Q70 38 78 44 L88 48 Q92 50 90 54 L84 54 Q86 58 82 60 L78 58 L76 70 L70 70 L69 60 Q52 62 40 59 L39 70 L32 70 L31 58 Q22 58 19 54 L19 70 Z" />
          {/* horns */}
          <path d="M88 48 Q94 40 92 34 Q90 40 85 45 Z M83 46 Q86 42 85 38 Q83 42 80 44 Z" />
          {/* ear */}
          <path d="M64 38 Q66 32 70 32 Q69 37 66 40 Z" opacity="0.8" />
        </g>
      );
    case "buffalo":
      return (
        <g fill={fill}>
          <path d="M14 70 L15 56 Q12 42 28 38 Q46 34 62 38 Q74 38 80 46 L82 52 L84 70 L78 70 L76 58 L58 58 L58 70 L52 70 L51 58 L30 57 L28 70 L21 70 L20 58 Z" />
          {/* the boss + curved horns */}
          <path d="M62 38 Q60 30 68 28 Q64 34 66 38 Z" opacity="0.9" />
          <path d="M66 36 Q56 28 58 20 Q60 16 64 18 Q62 24 68 30 Q72 34 70 38 Z" />
          <path d="M74 38 Q84 32 84 24 Q83 20 79 21 Q80 27 74 32 Q70 35 71 38 Z" />
        </g>
      );
    case "wildebeest":
      return (
        <g fill={fill}>
          <path d="M16 70 L18 54 Q14 44 26 41 L54 38 Q62 32 70 32 Q80 32 82 40 Q83 44 78 46 L72 48 L70 54 L72 70 L66 70 L64 56 L42 56 L42 70 L36 70 L35 55 L26 54 L24 70 Z" />
          {/* horns + beard */}
          <path d="M70 33 Q66 26 58 26 Q64 30 66 34 Z M76 34 Q80 28 88 28 Q81 32 79 36 Z" />
          <path d="M60 44 Q58 50 54 52 Q57 46 57 42 Z" opacity="0.7" />
        </g>
      );
    case "gazelle":
      return (
        <g fill={fill}>
          <path d="M24 70 L26 54 Q22 46 30 43 L52 41 Q56 34 62 32 Q68 30 70 34 Q71 38 66 40 L62 42 L60 48 L62 70 L57 70 L54 55 L40 55 L40 70 L35 70 L34 54 L30 54 L29 70 Z" />
          {/* lyre horns */}
          <path d="M62 32 Q60 22 64 14 Q66 12 67 14 Q64 22 66 30 Z M67 32 Q69 22 66 14 Q68 10 70 13 Q72 22 70 32 Z" />
        </g>
      );
    case "flamingo":
      return (
        <g fill={fill}>
          {/* body, S-neck, one leg */}
          <path d="M38 44 Q36 34 46 30 Q58 26 64 32 Q68 38 62 44 Q56 50 46 48 Q40 47 38 44 Z" />
          <path d="M46 31 Q42 20 50 14 Q58 10 62 14 Q66 18 62 20 Q58 16 54 18 Q48 22 50 30 Z" />
          <path d="M62 15 L70 17 L62 20 Z" opacity="0.9" />
          <path d="M48 48 L48 62 L46 62 L46 70 L50 70 L49 62 L50 48 Z" />
          <path d="M54 47 L56 58 L54 58 Z" opacity="0.7" />
        </g>
      );
    case "eagle":
      return (
        <g fill={fill}>
          {/* perched raptor, upright */}
          <path d="M44 70 L46 60 Q40 58 40 48 Q40 34 48 28 Q52 24 56 26 Q62 22 64 28 Q70 30 68 36 L66 38 Q68 48 62 56 Q58 60 54 61 L56 70 Z" />
          {/* beak + eye */}
          <path d="M64 30 L70 32 L64 35 Z" />
          {/* folded wing line */}
          <path d="M46 40 Q50 34 58 33 Q52 38 50 46 Q48 52 50 58 Q45 52 46 40 Z" opacity="0.55" />
        </g>
      );
  }
}
