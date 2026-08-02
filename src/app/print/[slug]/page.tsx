import Configurator from "@/components/product/Configurator";
import Reveal from "@/components/ui/Reveal";
import { CATALOGUE, getPrint } from "@/lib/catalogue";
import { formatINR } from "@/lib/pricing";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CATALOGUE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const print = getPrint(slug);
  if (!print) return {};
  return {
    title: `${print.title} — Limited Edition of ${print.editionOf}`,
    description: `${print.title}. ${print.location}, ${print.year}. Fine-art wildlife print, edition of ${print.editionOf}, from ${formatINR(print.basePrice)}.`,
  };
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const print = getPrint(slug);
  if (!print) notFound();

  const index = CATALOGUE.findIndex((p) => p.slug === slug);
  const next = CATALOGUE[(index + 1) % CATALOGUE.length];

  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-32 pt-36 md:px-12 md:pt-44">
      {/* breadcrumb */}
      <nav className="mb-12 text-[0.62rem] uppercase tracking-[0.26em] text-ash" aria-label="Breadcrumb">
        <Link href="/collection" className="link-underline hover:text-bone">
          Zawadi
        </Link>
        <span className="mx-3">/</span>
        <span className="text-bone/80">{print.title}</span>
      </nav>

      {/* title block */}
      <header className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-3">
            {String(index + 1).padStart(2, "0")} · The Zawadi Collection
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-bone">
            {print.title}
          </h1>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.24em] text-ash">
            {print.location} · {print.year} · Signed &amp; numbered · Edition of{" "}
            {print.editionOf}
          </p>
        </div>
        <p className="shrink-0 border border-gold/40 px-5 py-3 text-[0.62rem] uppercase tracking-[0.26em] text-gold">
          Limited edition — never reprinted
        </p>
      </header>

      <Configurator print={print} />

      {/* the story */}
      <Reveal className="mx-auto mt-32 max-w-2xl text-center">
        <p className="eyebrow mb-6">Field notes</p>
        <p className="font-display text-2xl md:text-3xl leading-relaxed text-bone/90">
          “{print.story}”
        </p>
        <p className="mt-8 text-[0.65rem] uppercase tracking-[0.28em] text-ash">
          — Brahmanand Kori, {print.location}
        </p>
      </Reveal>

      {/* next work */}
      <div className="mt-28 border-t border-bone/8 pt-10 text-center">
        <p className="eyebrow mb-3">Continue viewing</p>
        <Link
          href={`/print/${next.slug}`}
          className="font-display text-3xl text-bone transition-colors duration-500 hover:text-gold"
        >
          {next.title} →
        </Link>
      </div>
    </div>
  );
}
