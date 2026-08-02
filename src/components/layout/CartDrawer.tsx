"use client";

import Print from "@/components/art/Print";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/pricing";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, removeLine, updateQty } =
    useCart();

  // Escape closes the drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-graphite border-l border-bone/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-bone/10 px-7 py-6">
              <h2 className="font-display text-2xl text-bone">Your Selection</h2>
              <button
                onClick={closeDrawer}
                className="text-[0.65rem] uppercase tracking-[0.28em] text-ash hover:text-bone"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-xl text-bone/80">
                    Your selection is empty.
                  </p>
                  <Link
                    href="/collection"
                    onClick={closeDrawer}
                    className="mt-6 border border-gold/70 px-8 py-3 text-[0.68rem] uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-ink transition-colors duration-500"
                  >
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-8">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-5">
                      <div className="w-24 shrink-0">
                        <Print
                          print={line}
                          id={`drawer-${line.id}`}
                          className="w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-tight text-bone">
                          {line.title}
                        </p>
                        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-ash leading-relaxed">
                          {line.configLabel}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-bone/15">
                            <button
                              className="px-2.5 py-1 text-bone/70 hover:text-bone"
                              onClick={() => updateQty(line.id, line.qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-2 text-sm text-bone">{line.qty}</span>
                            <button
                              className="px-2.5 py-1 text-bone/70 hover:text-bone"
                              onClick={() => updateQty(line.id, line.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-gold">
                            {formatINR(line.unitPrice * line.qty)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeLine(line.id)}
                          className="mt-2 text-[0.6rem] uppercase tracking-[0.24em] text-ash hover:text-bone"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-bone/10 px-7 py-6">
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="text-[0.68rem] uppercase tracking-[0.28em] text-ash">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl text-bone">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block w-full border border-gold bg-gold px-8 py-4 text-center text-[0.7rem] uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-transparent hover:text-gold"
                >
                  Review &amp; Enquire
                </Link>
                <p className="mt-4 text-center text-[0.62rem] leading-relaxed text-ash">
                  Concierge service — we confirm each commission personally
                  before any payment.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
