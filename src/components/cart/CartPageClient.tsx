"use client";

import Print from "@/components/art/Print";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/pricing";
import Link from "next/link";
import { useState } from "react";

interface EnquiryState {
  name: string;
  email: string;
  city: string;
  message: string;
}

export default function CartPageClient() {
  const { lines, subtotal, removeLine, updateQty, clear } = useCart();
  const [enquiry, setEnquiry] = useState<EnquiryState>({
    name: "",
    email: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState<null | {
    ref: string;
    summary: string[];
    total: number;
    name: string;
    email: string;
  }>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `ZAW-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setSubmitted({
      ref,
      summary: lines.map(
        (l) =>
          `${l.qty} × ${l.title} — ${l.configLabel} — ${formatINR(l.unitPrice * l.qty)}`,
      ),
      total: subtotal,
      name: enquiry.name,
      email: enquiry.email,
    });
    clear();
  };

  /* ---------- confirmation ---------- */
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-6">Enquiry received</p>
        <h1 className="font-display text-4xl md:text-5xl text-bone">
          Thank you, {submitted.name.split(" ")[0] || "collector"}.
        </h1>
        <p className="mt-6 leading-relaxed text-ash">
          Your acquisition enquiry{" "}
          <span className="text-gold">{submitted.ref}</span> has been recorded.
          Our concierge will write to{" "}
          <span className="text-bone">{submitted.email}</span> within one
          working day to confirm availability, delivery and framing.
        </p>
        <div className="mt-10 border border-bone/10 bg-graphite/40 p-8 text-left">
          <p className="eyebrow mb-4">Your commission</p>
          <ul className="space-y-3 text-sm text-bone/85">
            {submitted.summary.map((s) => (
              <li key={s} className="border-b border-bone/8 pb-3">{s}</li>
            ))}
          </ul>
          <p className="mt-5 flex justify-between font-display text-xl text-bone">
            <span>Total</span>
            <span>{formatINR(submitted.total)}</span>
          </p>
        </div>
        <Link
          href="/collection"
          className="mt-12 inline-block border border-gold/70 px-10 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
        >
          Return to the Collection
        </Link>
      </div>
    );
  }

  /* ---------- empty ---------- */
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl md:text-5xl text-bone">
          Your selection is empty.
        </h1>
        <p className="mt-6 leading-relaxed text-ash">
          The Zawadi collection holds twelve limited works from the Masai
          Mara — each one waiting for a wall.
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

  /* ---------- cart + enquiry ---------- */
  return (
    <div className="grid gap-20 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h1 className="font-display text-4xl md:text-5xl text-bone">
          Your Selection
        </h1>
        <ul className="mt-12 space-y-10">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex gap-7 border-b border-bone/8 pb-10"
            >
              <div className="w-32 shrink-0 md:w-44">
                <Print print={line} id={`cart-${line.id}`} className="w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/print/${line.slug}`}
                    className="font-display text-2xl text-bone hover:text-gold transition-colors duration-500"
                  >
                    {line.title}
                  </Link>
                  <span className="shrink-0 text-gold">
                    {formatINR(line.unitPrice * line.qty)}
                  </span>
                </div>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] leading-relaxed text-ash">
                  {line.configLabel}
                </p>
                <div className="mt-5 flex items-center gap-6">
                  <div className="flex items-center border border-bone/15">
                    <button
                      className="px-3 py-1.5 text-bone/70 hover:text-bone"
                      onClick={() => updateQty(line.id, line.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm text-bone">{line.qty}</span>
                    <button
                      className="px-3 py-1.5 text-bone/70 hover:text-bone"
                      onClick={() => updateQty(line.id, line.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(line.id)}
                    className="text-[0.62rem] uppercase tracking-[0.24em] text-ash hover:text-bone"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-baseline justify-between">
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ash">
            Subtotal
          </span>
          <span className="font-display text-3xl text-bone">
            {formatINR(subtotal)}
          </span>
        </div>
      </div>

      {/* enquiry form */}
      <div className="h-fit border border-bone/10 bg-graphite/40 p-8 md:p-10">
        <p className="eyebrow mb-3">Concierge acquisition</p>
        <h2 className="font-display text-3xl text-bone">Begin the enquiry</h2>
        <p className="mt-4 text-sm leading-relaxed text-ash">
          No payment is taken online. Share your details and our concierge
          will confirm availability, framing, white-glove delivery and
          payment — personally.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          {(
            [
              ["name", "Full name", "text", true],
              ["email", "Email", "email", true],
              ["city", "Shipping city", "text", true],
            ] as const
          ).map(([key, label, type, required]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.26em] text-ash">
                {label} {required && <span className="text-gold">*</span>}
              </span>
              <input
                type={type}
                required={required}
                value={enquiry[key]}
                onChange={(e) =>
                  setEnquiry((s) => ({ ...s, [key]: e.target.value }))
                }
                className="w-full border border-bone/15 bg-transparent px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:border-gold focus:outline-none"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.26em] text-ash">
              Notes for the concierge
            </span>
            <textarea
              rows={4}
              value={enquiry.message}
              onChange={(e) =>
                setEnquiry((s) => ({ ...s, message: e.target.value }))
              }
              placeholder="Interior, wall dimensions, timeline…"
              className="w-full border border-bone/15 bg-transparent px-4 py-3 text-sm text-bone placeholder:text-bone/30 focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full border border-gold bg-gold px-10 py-5 text-[0.72rem] uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-transparent hover:text-gold"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}
