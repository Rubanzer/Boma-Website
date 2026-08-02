"use client";

import FramedPrint from "@/components/art/FramedPrint";
import Reveal from "@/components/ui/Reveal";
import type { Print } from "@/lib/types";
import { formatINR } from "@/lib/pricing";
import Link from "next/link";
import { useMemo, useState } from "react";

const ORIENTATIONS = ["all", "landscape", "portrait", "square"] as const;

export default function CollectionGrid({ prints }: { prints: Print[] }) {
  const [animal, setAnimal] = useState<string>("all");
  const [orientation, setOrientation] = useState<string>("all");

  const animals = useMemo(
    () => ["all", ...Array.from(new Set(prints.map((p) => p.animal)))],
    [prints],
  );

  const visible = prints.filter(
    (p) =>
      (animal === "all" || p.animal === animal) &&
      (orientation === "all" || p.orientation === orientation),
  );

  return (
    <div>
      {/* filters */}
      <div className="mb-16 flex flex-col gap-8 border-y border-bone/8 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-4 text-[0.62rem] uppercase tracking-[0.28em] text-ash">
            Subject
          </span>
          {animals.map((a) => (
            <button
              key={a}
              onClick={() => setAnimal(a)}
              className={`px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                animal === a
                  ? "border border-gold/70 text-gold"
                  : "border border-transparent text-bone/60 hover:text-bone"
              }`}
              aria-pressed={animal === a}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-4 text-[0.62rem] uppercase tracking-[0.28em] text-ash">
            Format
          </span>
          {ORIENTATIONS.map((o) => (
            <button
              key={o}
              onClick={() => setOrientation(o)}
              className={`px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                orientation === o
                  ? "border border-gold/70 text-gold"
                  : "border border-transparent text-bone/60 hover:text-bone"
              }`}
              aria-pressed={orientation === o}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-10 text-[0.62rem] uppercase tracking-[0.28em] text-ash">
        {visible.length} work{visible.length === 1 ? "" : "s"}
      </p>

      {/* grid */}
      <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((print, i) => (
          <Reveal key={print.slug} delay={(i % 3) * 0.07}>
            <Link href={`/print/${print.slug}`} className="group block">
              <div className="flex h-[380px] items-center justify-center bg-graphite/40 p-10">
                <div className="max-h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                  <FramedPrint
                    print={print}
                    id={`grid-${print.slug}`}
                    className={
                      print.orientation === "portrait"
                        ? "mx-auto w-[62%]"
                        : print.orientation === "square"
                          ? "mx-auto w-[78%]"
                          : "w-full"
                    }
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-bone transition-colors duration-500 group-hover:text-gold">
                    {print.title}
                  </h3>
                  <span className="shrink-0 text-sm text-bone/70">
                    from {formatINR(print.basePrice)}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.22em] text-ash">
                  {print.location} · {print.year} · Edition of {print.editionOf}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-24 text-center font-display text-2xl text-ash">
          No works match this selection.
        </p>
      )}
    </div>
  );
}
