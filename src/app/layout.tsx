import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/components/providers/CartProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brahmanand Kori Photography — Fine-Art Wildlife Prints",
    template: "%s — Brahmanand Kori Photography",
  },
  description:
    "Limited-edition fine-art wildlife prints from Kenya and the Masai Mara. Archival papers, hand-finished frames, museum glass. The Zawadi collection — crafted for the select few.",
  keywords: [
    "fine art wildlife photography",
    "limited edition prints",
    "Masai Mara",
    "Kenya",
    "Brahmanand Kori",
    "Zawadi collection",
  ],
  openGraph: {
    title: "Brahmanand Kori Photography — Fine-Art Wildlife Prints",
    description:
      "The Mara, witnessed — and framed by hand. Limited editions from the Zawadi collection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <div className="grain" aria-hidden />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
