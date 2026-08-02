import type { Print as PrintModel } from "@/lib/types";
import SavannaScene from "./SavannaScene";

/**
 * THE PHOTO-SWAP SEAM.
 * Today this renders the SVG SavannaScene; when Brahmanand's real scans
 * arrive, replace the render below with <Image …/> keeping the same props —
 * nothing else in the site changes.
 */
export default function Print({
  print,
  id,
  detail = "full",
  className,
}: {
  print: Pick<PrintModel, "animal" | "palette" | "orientation" | "title">;
  /** unique id prefix for SVG gradients/filters */
  id: string;
  /** "lite" skips the costliest filter passes — use for grid thumbnails */
  detail?: "full" | "lite";
  className?: string;
}) {
  return (
    <SavannaScene
      animal={print.animal}
      palette={print.palette}
      orientation={print.orientation}
      detail={detail}
      id={id}
      className={className ?? "h-full w-full"}
    />
  );
}
