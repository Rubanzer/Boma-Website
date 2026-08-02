"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Root-mode Lenis over the native window scroll — this is what lets
 * Motion's useScroll read the same scroll position with zero glue.
 * Under prefers-reduced-motion we skip smoothing entirely.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        anchors: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
