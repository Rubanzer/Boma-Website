import Print from "@/components/art/Print";
import Reveal from "@/components/ui/Reveal";
import { BRAND_FULL } from "@/lib/catalogue";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Photographer",
  description:
    "Brahmanand Kori — a decade in the grasslands of Kenya and the Masai Mara, printed.",
};

const FIELD_NOTES: Array<{
  year: string;
  title: string;
  body: string;
}> = [
  {
    year: "2015",
    title: "The first crossing",
    body: "My first Mara River crossing was a failure — wrong bank, wrong light, ten thousand wildebeest as a grey smear. I stayed three more weeks. The river taught me its rhythm before it gave me a single frame.",
  },
  {
    year: "2018",
    title: "Learning to wait",
    body: "A leopard in the Talek riverine forest kept me waiting six days. On the seventh she crossed a fig branch at dusk. I made nine exposures. One survived. Patience is the only lens that matters.",
  },
  {
    year: "2021",
    title: "The marsh pride",
    body: "Three seasons with the Musiara marsh pride — I stopped counting lions and started recognising faces. When the old male turned into the amber haze that evening, it was a portrait of someone I knew.",
  },
  {
    year: "2024",
    title: "Zawadi",
    body: "Zawadi means gift. That is what these years were. The collection is twelve moments the Mara gave me — printed, framed, and released once, in closing editions, never to be repeated.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-32 pt-36 md:pt-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* intro */}
        <header className="grid gap-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">The photographer</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-bone">
              A decade in
              <br />
              the grass.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="leading-relaxed text-ash">
              {BRAND_FULL} is the work of one photographer, one ecosystem,
              and ten years of returning — to Kenya, to the Masai Mara, to
              the same rivers and prides and crossings, season after season.
            </p>
          </div>
        </header>

        {/* wide scene */}
        <Reveal className="mt-20">
          <div className="overflow-hidden">
            <Print
              print={{
                animal: "elephant",
                palette: "dawn",
                orientation: "landscape",
                title: "The Matriarch",
              }}
              id="about-wide"
              className="w-full"
            />
          </div>
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-ash">
            Sand River at first light · Masai Mara, Kenya
          </p>
        </Reveal>

        {/* pull quote */}
        <Reveal className="mx-auto mt-28 max-w-3xl text-center">
          <p className="font-display text-3xl md:text-4xl leading-relaxed text-bone/90">
            “I don&rsquo;t take pictures of animals. I wait until they take
            mine. The Mara decides the photograph; I only carry it home.”
          </p>
        </Reveal>

        {/* field notes timeline */}
        <section className="mx-auto mt-28 max-w-4xl">
          <p className="eyebrow mb-12">Field notes</p>
          <ol className="space-y-16">
            {FIELD_NOTES.map((note, i) => (
              <Reveal key={note.year} delay={i * 0.05}>
                <li className="grid gap-6 border-b border-bone/8 pb-16 md:grid-cols-[120px_1fr]">
                  <span className="font-display text-3xl text-gold/80">
                    {note.year}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl text-bone">
                      {note.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-ash">{note.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <Reveal className="mt-28 text-center">
          <Link
            href="/collection"
            className="inline-block border border-gold/70 px-12 py-5 text-[0.72rem] uppercase tracking-[0.32em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            See the work
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
