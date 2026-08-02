import CollectionGrid from "@/components/collection/CollectionGrid";
import { CATALOGUE, COLLECTION_NAME } from "@/lib/catalogue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `The ${COLLECTION_NAME} Collection`,
  description:
    "Twelve limited-edition fine-art wildlife works from Kenya and the Masai Mara. Signed, numbered, never reprinted.",
};

export default function CollectionPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-32 pt-36 md:px-12 md:pt-44">
      <header className="mb-16 max-w-3xl">
        <p className="eyebrow mb-4">The debut collection</p>
        <h1 className="font-display text-5xl md:text-7xl text-bone">
          {COLLECTION_NAME}
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-ash">
          Zawadi — Swahili for <em className="font-display italic">gift</em>.
          Twelve works from a decade in the Mara, each printed on archival
          paper, framed by hand and released in a single, closing edition.
        </p>
      </header>
      <CollectionGrid prints={CATALOGUE} />
    </div>
  );
}
