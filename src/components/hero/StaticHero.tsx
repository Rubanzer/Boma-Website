import FramedPrint from "@/components/art/FramedPrint";
import {
  BRAND_FULL,
  COLLECTION_NAME,
  EXCLUSIVITY_PHRASES,
  getPrint,
} from "@/lib/catalogue";
import Link from "next/link";

/**
 * Reduced-motion / pre-mount fallback: the final composed state of the
 * scroll cinema — the framed print hung on the gallery wall, the
 * exclusivity copy, and the CTA. Same story, no motion.
 */
export default function StaticHero() {
  const print = getPrint("sovereign-of-musiara")!;
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #262019 0%, #211d18 45%, #16130f 100%)",
      }}
      aria-label="Introduction"
    >
      {/* spotlight */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 60% at 38% 42%, rgba(232,210,160,0.14) 0%, rgba(232,210,160,0.05) 45%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-6 py-32 md:grid-cols-2 md:px-12">
        <div>
          <FramedPrint
            print={print}
            id="static-hero"
            className="w-full max-w-xl"
          />
          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-ash">
            {print.title} · {print.location} · {print.year} · Edition of{" "}
            {print.editionOf}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-5">{BRAND_FULL}</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-bone">
            The Mara, witnessed.
          </h1>
          <div className="mt-8 space-y-5">
            {EXCLUSIVITY_PHRASES.map((phrase) => (
              <p key={phrase} className="font-display text-xl text-bone/80">
                {phrase}
              </p>
            ))}
          </div>
          <p className="mt-10 mb-2 eyebrow">The debut collection</p>
          <p className="font-display text-4xl uppercase tracking-[0.34em] text-bone">
            {COLLECTION_NAME}
          </p>
          <Link
            href="/collection"
            className="mt-10 inline-block border border-gold/70 px-10 py-4 text-[0.72rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
