import type { Print as PrintModel } from "@/lib/types";
import Print from "./Print";

const ASPECT: Record<string, string> = {
  landscape: "3 / 2",
  portrait: "5 / 7",
  square: "1 / 1",
};

/**
 * A print composed with mat, wood frame and (optional) museum glass.
 * Reused by the hero's final state, the collection grid, the product
 * page and the room preview so the framed look never diverges.
 */
export default function FramedPrint({
  print,
  id,
  wood = "#4a3524",
  woodEdge = "#332417",
  matted = true,
  glass = true,
  className,
}: {
  print: Pick<PrintModel, "animal" | "palette" | "orientation" | "title">;
  id: string;
  wood?: string;
  woodEdge?: string;
  matted?: boolean;
  glass?: boolean;
  className?: string;
}) {
  const frameless = wood === "transparent";
  return (
    <div
      className={className}
      style={{ aspectRatio: ASPECT[print.orientation] ?? "3 / 2" }}
    >
      <div
        className="relative h-full w-full"
        style={
          frameless
            ? undefined
            : {
                padding: "3.2%",
                background: `linear-gradient(135deg, ${wood} 0%, ${woodEdge} 55%, ${wood} 100%)`,
                boxShadow:
                  "0 22px 60px -18px rgba(0,0,0,0.75), 0 6px 18px -8px rgba(0,0,0,0.6)",
              }
        }
      >
        <div
          className="relative h-full w-full"
          style={
            matted && !frameless
              ? { padding: "5.5%", background: "#e7e2d6" }
              : undefined
          }
        >
          <div className="relative h-full w-full overflow-hidden">
            <Print print={print} id={id} className="h-full w-full" />
            {glass && !frameless && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.05) 78%, rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
