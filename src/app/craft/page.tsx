import FramedPrint from "@/components/art/FramedPrint";
import Reveal from "@/components/ui/Reveal";
import { FRAMES, GLASS, PAPERS } from "@/lib/pricing";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Materials & Craft",
  description:
    "Archival cotton and baryta papers, hand-mitred hardwood frames, museum glass. How every Zawadi print is made.",
};

const STEPS = [
  {
    n: "01",
    title: "The paper",
    body: "Each work is proofed and printed on one of two archival surfaces: 100% cotton rag matte, soft and painterly with deep quiet blacks; or baryta fibre gloss, with the tonal depth of a darkroom silver print. Both are rated for a century of colour.",
    options: PAPERS.map((p) => p.label),
  },
  {
    n: "02",
    title: "The frame",
    body: "Kiln-dried hardwood — natural oak, dark walnut or ebonised black — cut and mitred by hand, joined without visible fixings, finished in oil and wax. The moulding profile is our own: slim from the front, deep from the side, museum in intent.",
    options: FRAMES.filter((f) => f.id !== "frameless").map((f) => f.label),
  },
  {
    n: "03",
    title: "The glass",
    body: "Museum glazing with 99% UV protection and an anti-reflective coating that renders it near-invisible. In a lit room you see the print, not the room behind you.",
    options: GLASS.filter((g) => g.id !== "none").map((g) => g.label),
  },
  {
    n: "04",
    title: "The edition",
    body: "Every work is released once, in an edition of twelve to thirty. Each print is signed and numbered by hand, accompanied by a certificate of authenticity, and never reprinted — in any size, on any surface, ever.",
    options: ["Signed & numbered", "Certificate of authenticity", "Closed editions"],
  },
];

export default function CraftPage() {
  return (
    <div className="pb-32 pt-36 md:pt-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <header className="max-w-3xl">
          <p className="eyebrow mb-4">Materials &amp; craft</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-bone">
            Paper, wood,
            <br />
            glass, patience.
          </h1>
          <p className="mt-8 max-w-xl leading-relaxed text-ash">
            The film you scrolled through on our first page is not a
            metaphor — it is the order of operations. The print, then the
            frame, then the glass, then the wall. This page is how each
            layer earns its place.
          </p>
        </header>

        {/* demonstration piece */}
        <Reveal className="mt-20">
          <div className="grid gap-10 md:grid-cols-3">
            {(
              [
                ["Unframed", "transparent", "transparent", false],
                ["Natural Oak", "#8a6f4d", "#6e5638", true],
                ["Ebonised Black", "#1c1a17", "#0e0d0b", true],
              ] as const
            ).map(([label, wood, edge, glass], i) => (
              <div key={label} className="text-center">
                <div className="flex h-64 items-center justify-center bg-graphite/40 p-8">
                  <FramedPrint
                    print={{
                      animal: "lion",
                      palette: "amber",
                      orientation: "landscape",
                      title: "Sovereign of Musiara",
                    }}
                    id={`craft-demo-${i}`}
                    wood={wood}
                    woodEdge={edge}
                    glass={glass}
                    className="w-full max-w-[260px]"
                  />
                </div>
                <p className="mt-4 text-[0.62rem] uppercase tracking-[0.26em] text-ash">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* the four steps */}
        <section className="mx-auto mt-28 max-w-4xl space-y-20">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.04}>
              <article className="grid gap-8 border-b border-bone/8 pb-20 md:grid-cols-[120px_1fr]">
                <span className="font-display text-4xl text-gold/80">
                  {step.n}
                </span>
                <div>
                  <h2 className="font-display text-3xl text-bone">
                    {step.title}
                  </h2>
                  <p className="mt-5 leading-relaxed text-ash">{step.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {step.options.map((o) => (
                      <li
                        key={o}
                        className="border border-bone/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-bone/70"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        <Reveal className="mt-24 text-center">
          <p className="eyebrow mb-6">See it configured</p>
          <Link
            href="/collection"
            className="inline-block border border-gold/70 px-12 py-5 text-[0.72rem] uppercase tracking-[0.32em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            Choose your work
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
