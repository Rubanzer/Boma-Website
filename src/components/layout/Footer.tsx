import { BRAND_FULL, COLLECTION_NAME } from "@/lib/catalogue";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-bone/8 bg-slate">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.14em] text-bone">
              {BRAND_FULL}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ash">
              Limited-edition fine-art wildlife prints from Kenya and the
              Masai Mara. Each work is printed on archival paper, framed by
              hand, and never reprinted.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-6">Explore</p>
            <ul className="space-y-3 text-sm text-bone/75">
              <li><Link className="link-underline" href="/collection">The {COLLECTION_NAME} Collection</Link></li>
              <li><Link className="link-underline" href="/craft">Materials &amp; Craft</Link></li>
              <li><Link className="link-underline" href="/about">The Photographer</Link></li>
              <li><Link className="link-underline" href="/cart">Cart &amp; Enquiry</Link></li>
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-6">Concierge</p>
            <ul className="space-y-3 text-sm text-bone/75">
              <li>studio@brahmanandkori.com</li>
              <li>By appointment · Nairobi &amp; Mumbai</li>
            </ul>
          </div>
        </div>
        <hr className="hairline my-12" />
        <div className="flex flex-col items-start justify-between gap-4 text-[0.65rem] uppercase tracking-[0.24em] text-ash md:flex-row">
          <span>© {new Date().getFullYear()} {BRAND_FULL}. All rights reserved.</span>
          <span>Zawadi · Swahili — “gift”</span>
        </div>
      </div>
    </footer>
  );
}
