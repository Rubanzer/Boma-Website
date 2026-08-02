"use client";

import type { CartLine } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addLine: (line: Omit<CartLine, "qty">) => void;
  removeLine: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bkori-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialise empty on server AND first client render → no hydration mismatch.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // load in a frame callback (external system) — keeps hydration clean
    // and avoids synchronous setState inside the effect body
    const id = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
      } catch {
        /* corrupted storage — start fresh */
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full / private mode — cart stays in memory */
    }
  }, [lines, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (existing) {
        return prev.map((l) =>
          l.id === line.id ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { ...line, qty: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
    return {
      lines,
      count,
      subtotal,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addLine,
      removeLine,
      updateQty,
      clear,
    };
  }, [lines, drawerOpen, openDrawer, closeDrawer, addLine, removeLine, updateQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
