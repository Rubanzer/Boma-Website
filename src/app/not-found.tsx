import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="eyebrow mb-6">Off the trail</p>
      <h1 className="font-display text-5xl md:text-6xl text-bone">
        This page has wandered.
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ash">
        Like a leopard in the riverine forest, what you&rsquo;re looking for
        isn&rsquo;t where it was. The collection, however, is exactly where
        we left it.
      </p>
      <Link
        href="/collection"
        className="mt-12 inline-block border border-gold/70 px-10 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
      >
        Explore the Collection
      </Link>
    </div>
  );
}
