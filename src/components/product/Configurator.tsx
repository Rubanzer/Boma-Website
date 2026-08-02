"use client";

import FramedPrint from "@/components/art/FramedPrint";
import { useCart } from "@/components/providers/CartProvider";
import {
  DEFAULT_CONFIG,
  FRAMES,
  GLASS,
  PAPERS,
  SIZES,
  computePrice,
  describeConfig,
  formatINR,
  getFrame,
} from "@/lib/pricing";
import type { Print, PrintConfig } from "@/lib/types";
import { useMemo, useState } from "react";

function OptionGroup<T extends { id: string; label: string; description?: string }>({
  legend,
  options,
  value,
  onChange,
  detail,
}: {
  legend: string;
  options: T[];
  value: string;
  onChange: (id: string) => void;
  detail?: (o: T) => string | undefined;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={`border px-5 py-4 text-left transition-colors duration-300 ${
                active
                  ? "border-gold/80 bg-gold/5"
                  : "border-bone/12 hover:border-bone/30"
              }`}
            >
              <span className={`block text-sm ${active ? "text-gold" : "text-bone"}`}>
                {o.label}
              </span>
              {detail?.(o) && (
                <span className="mt-1 block text-[0.68rem] leading-relaxed text-ash">
                  {detail(o)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Configurator({ print }: { print: Print }) {
  const { addLine } = useCart();
  const [config, setConfig] = useState<PrintConfig>({ ...DEFAULT_CONFIG });
  const [view, setView] = useState<"detail" | "room">("detail");

  const price = useMemo(() => computePrice(print, config), [print, config]);
  const frame = getFrame(config.frameId);
  const frameless = frame.id === "frameless";

  const set = (patch: Partial<PrintConfig>) =>
    setConfig((c) => {
      const next = { ...c, ...patch };
      // frameless prints can't carry glazing
      if (next.frameId === "frameless") next.glassId = "none";
      return next;
    });

  const add = () => {
    addLine({
      id: `${print.slug}::${config.sizeId}:${config.paperId}:${config.frameId}:${config.glassId}`,
      slug: print.slug,
      title: print.title,
      animal: print.animal,
      palette: print.palette,
      orientation: print.orientation,
      config,
      configLabel: describeConfig(config),
      unitPrice: price,
    });
  };

  return (
    <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
      {/* ------------ preview ------------ */}
      <div>
        <div className="mb-6 flex gap-2">
          {(["detail", "room"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.24em] transition-colors duration-300 ${
                view === v
                  ? "border border-gold/70 text-gold"
                  : "border border-bone/12 text-bone/60 hover:text-bone"
              }`}
            >
              {v === "detail" ? "The work" : "In a room"}
            </button>
          ))}
        </div>

        {view === "detail" ? (
          <div className="flex min-h-[440px] items-center justify-center bg-graphite/40 p-8 md:p-14">
            <FramedPrint
              print={print}
              id={`conf-${print.slug}`}
              wood={frame.wood}
              woodEdge={frame.woodEdge}
              glass={config.glassId === "museum"}
              className={
                print.orientation === "portrait"
                  ? "w-[58%] max-w-sm"
                  : print.orientation === "square"
                    ? "w-[72%] max-w-md"
                    : "w-full max-w-xl"
              }
            />
          </div>
        ) : (
          /* ------------ room preview ------------ */
          <div
            className="relative min-h-[440px] overflow-hidden"
            aria-label="Room preview"
          >
            {/* wall */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #2a251e 0%, #211d18 55%, #191510 100%)",
              }}
            />
            {/* spotlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 45% 55% at 50% 38%, rgba(232,210,160,0.13) 0%, transparent 65%)",
              }}
            />
            {/* floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[22%]"
              style={{
                background: "linear-gradient(180deg, #14100b 0%, #0c0a07 100%)",
              }}
            />
            <div className="absolute bottom-[22%] left-0 right-0 h-px bg-black/50" />
            {/* bench — scale cue */}
            <div className="absolute bottom-[13%] left-1/2 h-[9%] w-[34%] -translate-x-1/2">
              <div className="h-[38%] w-full rounded-sm bg-[#3d332a]" />
              <div className="mx-auto mt-0 flex h-[62%] w-[86%] justify-between">
                <span className="h-full w-[4%] bg-[#2c241d]" />
                <span className="h-full w-[4%] bg-[#2c241d]" />
              </div>
            </div>
            {/* the piece at wall scale */}
            <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2">
              <FramedPrint
                print={print}
                id={`room-${print.slug}`}
                wood={frame.wood}
                woodEdge={frame.woodEdge}
                glass={config.glassId === "museum"}
                className={
                  print.orientation === "portrait"
                    ? "w-[clamp(120px,16vw,190px)]"
                    : print.orientation === "square"
                      ? "w-[clamp(150px,19vw,230px)]"
                      : "w-[clamp(190px,26vw,320px)]"
                }
              />
            </div>
          </div>
        )}

        <p className="mt-5 text-[0.62rem] uppercase tracking-[0.22em] text-ash">
          {print.title} · {print.location} · {print.year} · Edition of {print.editionOf}
        </p>
      </div>

      {/* ------------ options ------------ */}
      <div className="space-y-10">
        <OptionGroup
          legend="Size"
          options={SIZES}
          value={config.sizeId}
          onChange={(sizeId) => set({ sizeId })}
          detail={(s) => s.inches}
        />
        <OptionGroup
          legend="Paper"
          options={PAPERS}
          value={config.paperId}
          onChange={(paperId) => set({ paperId })}
          detail={(p) => p.description}
        />
        <OptionGroup
          legend="Frame"
          options={FRAMES}
          value={config.frameId}
          onChange={(frameId) => set({ frameId })}
          detail={(f) => f.description}
        />
        {!frameless && (
          <OptionGroup
            legend="Glazing"
            options={GLASS}
            value={config.glassId}
            onChange={(glassId) => set({ glassId })}
            detail={(g) => g.description}
          />
        )}

        <div className="border-t border-bone/10 pt-8">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-ash">
              Your configuration
            </span>
            <span className="font-display text-3xl text-bone">
              {formatINR(price)}
            </span>
          </div>
          <p className="mt-2 text-[0.68rem] leading-relaxed text-ash">
            {describeConfig(config)}
          </p>
          <button
            onClick={add}
            className="mt-8 w-full border border-gold bg-gold px-10 py-5 text-[0.72rem] uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-transparent hover:text-gold"
          >
            Add to Selection
          </button>
          <p className="mt-4 text-center text-[0.62rem] leading-relaxed text-ash">
            Concierge acquisition — no payment taken online. We confirm each
            commission personally, including delivery and installation.
          </p>
        </div>
      </div>
    </div>
  );
}
