"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import ScrollCinema from "./ScrollCinema";
import StaticHero from "./StaticHero";

const emptySubscribe = () => () => {};

/**
 * First paint (SSR + pre-mount) is always the static hero so server
 * and client markup agree; the cinema mounts only on capable,
 * motion-permitting clients.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  // true on the client after hydration, false during SSR — no effect needed
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted || reduce) return <StaticHero />;
  return <ScrollCinema />;
}
