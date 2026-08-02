import CartPageClient from "@/components/cart/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Selection",
  description:
    "Review your selection and begin a concierge acquisition enquiry.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-32 pt-36 md:px-12 md:pt-44">
      <CartPageClient />
    </div>
  );
}
