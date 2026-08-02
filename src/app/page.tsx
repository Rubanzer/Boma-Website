import FramedPrint from "@/components/art/FramedPrint";
import Hero from "@/components/hero/Hero";
import Reveal from "@/components/ui/Reveal";
import { COLLECTION_NAME, featuredPrints } from "@/lib/catalogue";
import { formatINR } from "@/lib/pricing";
import Link from "next/link";

export default function Home() {
  const featured = featuredPrints();

  return (
    <>
      <Hero />

      {/* ---------------- Featured works — asymmetric editorial grid ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 md:py-40">
        <Reveal>
          <div className="mb-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">The debut collection</p>
              <h2 className="font-display text-5xl md:text-6xl text-bone">
                {COLLECTION_NAME}
                <span className="ml-4 align-middle font-display italic text-lg text-ash normal-case">
                  Swahili — “gift”
                </span>
              </h2>
            </div>
            <Link
              href="/collection"
              className="link-underline self-start text-[0.7rem] uppercase tracking-[0.3em] text-gold md:self-auto"
            >
              View all works
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-x-10 gap-y-24 md:grid-cols-12">
          {featured.map((print, i) => {
            // asymmetric editorial placement
            const layouts = [
              "md:col-span-7",
              "md:col-span-5 md:mt-32",
              "md:col-span-5 md:col-start-2 md:-mt-10",
              "md:col-span-6 md:col-start-7 md:mt-20",
            ];
            return (
              <Reveal
                key={print.slug}
                delay={i * 0.08}
                className={`col-span-full ${layouts[i % layouts.length]}`}
              >
                <Link href={`/print/${print.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                      <FramedPrint
                        print={print}
                        id={`feat-${print.slug}`}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <div>
                      <span className="mr-4 font-display text-lg text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl text-bone group-hover:text-gold transition-colors duration-500">
                        {print.title}
                      </span>
                      <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-ash">
                        {print.location} · {print.year} · Edition of {print.editionOf}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-bone/70">
                      from {formatINR(print.basePrice)}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------- The craft ---------------- */}
      <section className="border-y border-bone/8 bg-slate">
        <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <Reveal>
              <p className="eyebrow mb-4">The craft</p>
              <h2 className="font-display text-4xl md:text-5xl text-bone leading-tight">
                Archival paper. Hand-cut wood.
                <br />
                Museum glass.
              </h2>
              <p className="mt-8 max-w-lg leading-relaxed text-ash">
                Every print is made the way the hero of this site is drawn:
                paper first, then the frame, then the glass. Cotton rag or
                baryta fibre, kiln-dried hardwood mitred by hand, and glazing
                that all but disappears — so nothing stands between you and
                the Mara.
              </p>
              <Link
                href="/craft"
                className="mt-10 inline-block border border-bone/30 px-9 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-bone/90 transition-colors duration-500 hover:border-gold hover:text-gold"
              >
                Materials &amp; process
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="space-y-10">
                {[
                  ["01", "The paper", "310 gsm cotton rag or baryta fibre — surfaces chosen for silence, not shine."],
                  ["02", "The frame", "Oak, walnut or ebonised hardwood; each moulding cut, joined and waxed by hand."],
                  ["03", "The glass", "99% UV museum glazing, near-invisible. Your print, protected for generations."],
                  ["04", "The edition", "Twelve to thirty per work. Signed, numbered, never reprinted."],
                ].map(([n, t, d]) => (
                  <li key={n} className="flex gap-8 border-b border-bone/8 pb-8">
                    <span className="font-display text-xl text-gold/80">{n}</span>
                    <div>
                      <p className="font-display text-xl text-bone">{t}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ash">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- About teaser ---------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 md:py-40">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-5">
            <FramedPrint
              print={{
                animal: "giraffe",
                palette: "mist",
                orientation: "portrait",
                title: "The Tall Silence",
              }}
              id="about-teaser"
              finish="natural-oak"
              className="mx-auto w-full max-w-sm"
            />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="eyebrow mb-4">The photographer</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-bone">
              “I don&rsquo;t take pictures of animals.
              <br />
              I wait until they take mine.”
            </h2>
            <p className="mt-8 max-w-lg leading-relaxed text-ash">
              Brahmanand Kori has spent a decade in the grasslands of Kenya
              and the Masai Mara, returning season after season to the same
              rivers, the same prides, the same crossings — until the
              photographs stopped being pictures and became patience, printed.
            </p>
            <Link
              href="/about"
              className="link-underline mt-10 inline-block text-[0.7rem] uppercase tracking-[0.3em] text-gold"
            >
              Read his story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="border-t border-bone/8 bg-gradient-to-b from-ink to-forest/40">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center md:py-44">
          <Reveal>
            <p className="eyebrow mb-6">A private acquisition</p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight text-bone">
              Own a moment the Mara
              <br />
              will never repeat.
            </h2>
            <Link
              href="/collection"
              className="mt-14 inline-block border border-gold bg-gold px-12 py-5 text-[0.72rem] uppercase tracking-[0.32em] text-ink transition-colors duration-500 hover:bg-transparent hover:text-gold"
            >
              Explore the Collection
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
