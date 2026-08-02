import type { Print as PrintModel } from "@/lib/types";
import Print from "./Print";
import { WoodFrameBorder, type WoodFinishId } from "./wood";

const ASPECT: Record<string, string> = {
  landscape: "3 / 2",
  portrait: "5 / 7",
  square: "1 / 1",
};

export type FrameFinish = WoodFinishId | "frameless";

/**
 * A print composed with mat, a real hardwood frame and (optional) museum
 * glass. Reused by the hero's final state, the collection grid, the product
 * page and the room preview so the framed look never diverges.
 */
export default function FramedPrint({
  print,
  id,
  finish = "dark-walnut",
  matted = true,
  glass = true,
  detail = "full",
  className,
}: {
  print: Pick<PrintModel, "animal" | "palette" | "orientation" | "title">;
  id: string;
  finish?: FrameFinish;
  matted?: boolean;
  glass?: boolean;
  detail?: "full" | "lite";
  className?: string;
}) {
  const frameless = finish === "frameless";
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
                padding: "3.4%",
                boxShadow:
                  "0 22px 60px -18px rgba(0,0,0,0.75), 0 6px 18px -8px rgba(0,0,0,0.6)",
              }
        }
      >
        {!frameless && (
          <WoodFrameBorder id={`${id}-frame`} finish={finish} thickness="3.4%" />
        )}
        <div
          className="relative h-full w-full"
          style={
            matted && !frameless
              ? { padding: "5.5%", background: "#e9e4d8" }
              : undefined
          }
        >
          <div className="relative h-full w-full overflow-hidden">
            <Print
              print={print}
              id={id}
              detail={detail}
              className="h-full w-full"
            />
            {glass && !frameless && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.05) 80%, rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
