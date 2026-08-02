"use client";

import { useCart } from "@/components/providers/CartProvider";
import { BRAND } from "@/lib/catalogue";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/collection", label: "Collection" },
  { href: "/craft", label: "The Craft" },
  { href: "/about", label: "The Photographer" },
];

export default function Header() {
  const { count, openDrawer } = useCart();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        solid || menuOpen
          ? "bg-ink/92 backdrop-blur-md border-b border-bone/8"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-lg md:text-xl tracking-[0.14em] uppercase text-bone"
        >
          {BRAND}
          <span className="ml-2 align-middle text-[0.55rem] tracking-[0.4em] text-gold">
            Photography
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`link-underline text-[0.7rem] uppercase tracking-[0.28em] ${
                pathname === item.href ? "text-gold" : "text-bone/80 hover:text-bone"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={openDrawer}
            className="link-underline text-[0.7rem] uppercase tracking-[0.28em] text-bone/80 hover:text-bone"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            Cart{count > 0 && <span className="ml-1.5 text-gold">({count})</span>}
          </button>
        </nav>

        {/* mobile */}
        <div className="flex items-center gap-6 md:hidden">
          <button
            onClick={openDrawer}
            className="text-[0.7rem] uppercase tracking-[0.28em] text-bone/80"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            Cart{count > 0 && <span className="ml-1 text-gold">({count})</span>}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-bone/8 px-6 py-8 md:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
