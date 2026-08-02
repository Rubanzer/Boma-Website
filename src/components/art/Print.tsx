import type { Print as PrintModel } from "@/lib/types";
import SavannaScene from "./SavannaScene";

/**
 * THE PHOTO-SWAP SEAM.
 * Today this renders the SVG SavannaScene; when real scans arrive,
 * replace the render below with <Image …/> keeping the same props —
 * nothing else in the site changes.
 */
export default function Print({
  print,
  id,
  className,
}: {
  print: Pick<PrintModel, "animal" | "palette" | "orientation" | "title">;
  /** unique id prefix for SVG gradients */
  id: string;
  className?: string;
}) {
  return (
    <SavannaScene
      animal={print.animal}
      palette={print.palette}
      orientation={print.orientation}
      id={id}
      className={className ?? "h-full w-full"}
    />
  );
}
