"use client";

import BedroomScene from "@/components/art/BedroomScene";
import { CameraRear, LensThroat, REAR_SCREEN } from "@/components/art/CameraParts";
import Print from "@/components/art/Print";
import { WoodRail } from "@/components/art/wood";
import { COLLECTION_NAME, EXCLUSIVITY_PHRASES, getPrint } from "@/lib/catalogue";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

/**
 * The signature scroll-cinema.
 *
 * Every visual is a PURE function of scroll progress p ∈ [0,1], so scrolling
 * back up rewinds the film exactly.
 *
 *  1  0.00–0.06  the subject, full bleed
 *  2  0.06–0.20  we travel BACKWARDS into the lens; barrel rings rush past
 *  3  0.20–0.24  darkness inside the body
 *  4  0.24–0.32  we emerge from the eyepiece behind the camera; the rear LCD
 *                is showing the frame that was just taken
 *  5  0.32–0.45  the print ejects from the slot and develops as it travels
 *  6  0.45–0.55  the paper roll enters from the left edge of the screen
 *  7  0.55–0.65  it unfurls; the print settles at the centre of the sheet
 *  8  0.65–0.75  wood appears as small nubs on all four sides and grows
 *                asymmetrically until the frame closes
 *  9  0.75–0.81  museum glass, with a specular sweep
 * 10  0.81–0.87  a bedroom resolves; the piece is hung on the wall
 * 11  0.87–0.95  the exclusivity lines cycle
 * 12  0.95–1.00  the collection wordmark and the invitation
 */

const HERO_PRINT_SLUG = "sovereign-of-musiara";

// LCD geometry as percentages of the camera-rear box
const SCREEN = {
  left: (REAR_SCREEN.x / REAR_SCREEN.vb.w) * 100,
  top: (REAR_SCREEN.y / REAR_SCREEN.vb.h) * 100,
  width: (REAR_SCREEN.w / REAR_SCREEN.vb.w) * 100,
  height: (REAR_SCREEN.h / REAR_SCREEN.vb.h) * 100,
};

export default function ScrollCinema() {
  const trackRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Measure the pinned track ourselves so progress is exact and stable.
  const rangeRef = useRef({ start: 0, span: 1 });
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      rangeRef.current = {
        start: rect.top + window.scrollY,
        span: Math.max(1, el.offsetHeight - window.innerHeight),
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const p = useTransform(scrollY, (y) => {
    const { start, span } = rangeRef.current;
    return Math.min(1, Math.max(0, (y - start) / span));
  });

  const print = getPrint(HERO_PRINT_SLUG)!;

  /* ============ 1 · the subject ============ */
  const titleOpacity = useTransform(p, [0, 0.04], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.025], [1, 0]);

  /* ============ 2 · backwards into the lens ============ */
  // the world shrinks to a distant bright opening
  const sceneScale = useTransform(p, [0.02, 0.19], [1, 0.045]);
  const sceneRadius = useTransform(p, [0.03, 0.1], ["0%", "50%"]);
  const sceneOpacity = useTransform(p, [0.185, 0.215], [1, 0]);
  const sceneGlow = useTransform(p, [0.06, 0.14, 0.2], [0, 0.5, 0]);

  // two barrel sections rushing past us, staggered, = continuous travel
  const throatAScale = useTransform(p, [0.05, 0.2], [0.35, 6]);
  const throatAOpacity = useTransform(p, [0.05, 0.09, 0.17, 0.2], [0, 1, 1, 0]);
  const throatBScale = useTransform(p, [0.115, 0.235], [0.3, 5.4]);
  const throatBOpacity = useTransform(p, [0.115, 0.15, 0.21, 0.235], [0, 1, 1, 0]);

  /* ============ 4 · emerge behind the camera ============ */
  // grows out of the eyepiece as we back away from it
  const camScale = useTransform(p, [0.235, 0.325], [4.2, 1]);
  const camOpacity = useTransform(p, [0.235, 0.275, 0.44, 0.48], [0, 1, 1, 0]);
  const camY = useTransform(p, [0.235, 0.325, 0.44, 0.48], ["6%", "0%", "0%", "-14%"]);
  // the review image appearing on the LCD, with a brief flash
  const lcdOpacity = useTransform(p, [0.275, 0.31], [0, 1]);
  const lcdFlash = useTransform(p, [0.27, 0.285, 0.32], [0, 0.75, 0]);

  /* ============ 5 · the print ejects and develops ============ */
  // slides down out of the slot, then travels to the middle of the stage
  const polaroidOpacity = useTransform(p, [0.325, 0.35, 0.645, 0.665], [0, 1, 1, 0]);
  // starts tucked behind the body at the slot, feeds down, then travels to centre
  const polaroidY = useTransform(
    p,
    [0.325, 0.43, 0.55, 0.645],
    ["82%", "116%", "120%", "0%"],
  );
  const polaroidScale = useTransform(p, [0.325, 0.43, 0.55, 0.645], [0.42, 0.46, 0.5, 1.62]);
  const polaroidRotate = useTransform(p, [0.35, 0.46, 0.58, 0.645], [-5, 3, 1, 0]);
  // the emulsion coming up — wiped in top-to-bottom as it feeds out, then
  // deepening as it "develops"
  const developWipe = useTransform(p, [0.345, 0.45], ["100%", "0%"]);
  const developClip = useMotionTemplate`inset(0% 0% ${developWipe} 0%)`;
  const developOpacity = useTransform(p, [0.36, 0.5], [0.15, 1]);

  /* ============ 6–7 · the roll enters, then unfurls ============ */
  // the rolled sheet slides in from off-screen left …
  const rollEnterX = useTransform(p, [0.45, 0.55], ["-125%", "0%"]);
  const rollOpacity = useTransform(p, [0.45, 0.48], [0, 1]);
  // … then the paper unfurls to the right
  const unfurl = useTransform(p, [0.555, 0.655], [0, 1]);
  const paperClipRight = useTransform(unfurl, [0, 1], ["100%", "0%"]);
  const paperClip = useMotionTemplate`inset(0% ${paperClipRight} 0% 0%)`;
  const cylinderX = useTransform(unfurl, [0, 1], ["0%", "100%"]);
  const cylinderOpacity = useTransform(p, [0.47, 0.5, 0.645, 0.675], [0, 1, 1, 0]);
  const printOnPaperOpacity = useTransform(p, [0.645, 0.668], [0, 1]);
  const captionOpacity = useTransform(p, [0.66, 0.69], [0, 1]);

  /* ============ 8 · asymmetric wood growth ============ */
  // each side starts as a small nub at its own off-centre origin and grows
  // at its own pace until the four spreads meet
  const railTop = useTransform(p, [0.655, 0.685, 0.725, 0.755], [0, 0.16, 0.58, 1]);
  const railBottom = useTransform(p, [0.665, 0.695, 0.74, 0.762], [0, 0.11, 0.72, 1]);
  const railLeft = useTransform(p, [0.678, 0.705, 0.735, 0.758], [0, 0.2, 0.52, 1]);
  const railRight = useTransform(p, [0.688, 0.712, 0.745, 0.765], [0, 0.13, 0.66, 1]);
  const railTopO = useTransform(p, [0.655, 0.668], [0, 1]);
  const railBottomO = useTransform(p, [0.665, 0.678], [0, 1]);
  const railLeftO = useTransform(p, [0.678, 0.69], [0, 1]);
  const railRightO = useTransform(p, [0.688, 0.7], [0, 1]);
  const frameShadow = useTransform(p, [0.7, 0.78], [0, 1]);

  /* ============ 9 · glass ============ */
  const glassOpacity = useTransform(p, [0.755, 0.795], [0, 1]);
  const shineX = useTransform(p, [0.765, 0.85], ["-140%", "180%"]);
  const shineOpacity = useTransform(p, [0.765, 0.79, 0.83, 0.855], [0, 1, 1, 0]);

  /* ============ 10 · the bedroom ============ */
  const bedroomOpacity = useTransform(p, [0.79, 0.865], [0, 1]);
  // the piece settles onto the wall above the bed
  const pieceY = useTransform(p, [0.8, 0.875], ["0%", "-17%"]);
  const pieceScale = useTransform(p, [0.8, 0.875], [1, 0.42]);
  const wallShadow = useTransform(p, [0.83, 0.885], [0, 1]);

  /* ============ 11 · the lines ============ */
  const phrase1 = useTransform(p, [0.872, 0.886, 0.9, 0.912], [0, 1, 1, 0]);
  const phrase2 = useTransform(p, [0.9, 0.914, 0.928, 0.94], [0, 1, 1, 0]);
  const phrase3 = useTransform(p, [0.928, 0.942, 0.952, 0.962], [0, 1, 1, 0]);
  const scrimOpacity = useTransform(p, [0.86, 0.9], [0, 1]);

  /* ============ 12 · the invitation ============ */
  const outroOpacity = useTransform(p, [0.962, 0.99], [0, 1]);
  const outroY = useTransform(p, [0.962, 0.99], [26, 0]);
  const wordmarkSpacing = useTransform(p, [0.962, 1], ["0.62em", "0.34em"]);

  return (
    <section
      ref={trackRef}
      className="relative h-[540vh] md:h-[700vh]"
      aria-label="Cinematic introduction"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {/* ================= the bedroom, behind everything ================= */}
        <motion.div className="absolute inset-0" style={{ opacity: bedroomOpacity }}>
          <BedroomScene id="hero-bedroom" className="h-full w-full" />
        </motion.div>

        {/* ================= 1–2 · the subject, retreating ================= */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: sceneOpacity }}
        >
          {/* warm spill from the distant opening */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              opacity: sceneGlow,
              background:
                "radial-gradient(circle at 50% 50%, rgba(226,178,104,0.22) 0%, rgba(226,178,104,0.05) 30%, transparent 62%)",
            }}
          />
          <motion.div
            className="relative h-full w-full overflow-hidden"
            style={{ scale: sceneScale, borderRadius: sceneRadius }}
          >
            <Print print={print} id="hero-opening" className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* barrel sections rushing past */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: throatAOpacity }}
        >
          <motion.div
            className="aspect-square w-[min(150vw,150vh)]"
            style={{ scale: throatAScale }}
          >
            <LensThroat id="hero-throat-a" className="h-full w-full" />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: throatBOpacity }}
        >
          <motion.div
            className="aspect-square w-[min(150vw,150vh)]"
            style={{ scale: throatBScale }}
          >
            <LensThroat id="hero-throat-b" className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* ================= 4 · behind the camera ================= */}
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ opacity: camOpacity, y: camY }}
        >
          <motion.div
            className="relative aspect-[4/3] w-[min(88vw,620px)]"
            style={{
              scale: camScale,
              // grow out of the eyepiece, which sits here on the body
              transformOrigin: "50% 21%",
            }}
          >
            <CameraRear id="hero-cam" className="h-full w-full" />
            {/* the frame just taken, playing back on the LCD */}
            <motion.div
              className="absolute overflow-hidden"
              style={{
                left: `${SCREEN.left}%`,
                top: `${SCREEN.top}%`,
                width: `${SCREEN.width}%`,
                height: `${SCREEN.height}%`,
                opacity: lcdOpacity,
              }}
            >
              <Print print={print} id="hero-lcd" className="h-full w-full" />
              {/* review overlay — the little truth of a real camera */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-[4%] pb-[3%] text-[0.5rem] text-bone/85">
                <span className="tracking-[0.14em]">1/640 · f/4 · ISO 400</span>
                <span className="tracking-[0.14em]">RAW</span>
              </div>
              {/* glass over the panel */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.05) 85%, rgba(255,255,255,0) 100%)",
                }}
              />
            </motion.div>
            {/* capture flash */}
            <motion.div
              aria-hidden
              className="absolute bg-bone"
              style={{
                left: `${SCREEN.left}%`,
                top: `${SCREEN.top}%`,
                width: `${SCREEN.width}%`,
                height: `${SCREEN.height}%`,
                opacity: lcdFlash,
              }}
            />
          </motion.div>
        </motion.div>

        {/* ================= 5 · the print, ejecting and developing ================= */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-[35] w-[min(52vw,300px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: polaroidOpacity,
            y: polaroidY,
            scale: polaroidScale,
            rotate: polaroidRotate,
          }}
        >
          <div
            className="bg-[#f4f0e6] p-[5%] pb-[17%]"
            style={{ boxShadow: "0 20px 50px -14px rgba(0,0,0,0.75)" }}
          >
            <div className="relative">
              {/* unexposed emulsion */}
              <div className="absolute inset-0 bg-[#c9c6bb]" />
              <motion.div style={{ clipPath: developClip, opacity: developOpacity }}>
                <Print print={print} id="hero-polaroid" className="w-full" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ================= 6–9 · paper, frame, glass ================= */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ y: pieceY, scale: pieceScale }}
        >
          <motion.div
            className="relative w-[min(84vw,720px)]"
            style={{ x: rollEnterX, opacity: rollOpacity }}
          >
            {/* shadow once it is a physical object on a wall */}
            <motion.div
              aria-hidden
              className="absolute -inset-x-8 -bottom-10 top-1/3"
              style={{
                opacity: wallShadow,
                background:
                  "radial-gradient(ellipse 58% 50% at 50% 98%, rgba(0,0,0,0.6) 0%, transparent 72%)",
              }}
            />
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={{
                opacity: frameShadow,
                boxShadow:
                  "0 30px 80px -22px rgba(0,0,0,0.85), 0 8px 22px -10px rgba(0,0,0,0.7)",
              }}
            />

            {/* the sheet — in flow, so it defines the box the frame aligns to */}
            <motion.div className="relative" style={{ clipPath: paperClip }}>
              <div className="relative bg-[#f0eade] p-[4.5%]">
                <motion.div style={{ opacity: printOnPaperOpacity }}>
                  <Print print={print} id="hero-paper" className="w-full" />
                </motion.div>
                <motion.div
                  className="mt-[3%] flex items-baseline justify-between text-[#3d382e]"
                  style={{ opacity: captionOpacity }}
                >
                  <span className="font-display italic text-[clamp(0.6rem,1.5vw,1rem)]">
                    {print.title}
                  </span>
                  <span className="text-[clamp(0.4rem,0.95vw,0.62rem)] uppercase tracking-[0.2em]">
                    {print.location} · {print.year} · Edition of {print.editionOf}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* ---- the wood, growing asymmetrically from four nubs ----
                 kept OUTSIDE the clipped sheet so the rails, which sit just
                 beyond its edges, are never sheared off by the unfurl clip ---- */}
            <motion.div
                aria-hidden
                className="absolute -top-[5%] -left-[3.4%] -right-[3.4%] h-[5%]"
                style={{ opacity: railTopO, scaleX: railTop, transformOrigin: "28% 50%" }}
              >
                <WoodRail side="top" finish="dark-walnut" mitre={0} id="hero-rail-t" className="h-full w-full" />
              </motion.div>
              <motion.div
                aria-hidden
                className="absolute -bottom-[5%] -left-[3.4%] -right-[3.4%] h-[5%]"
                style={{ opacity: railBottomO, scaleX: railBottom, transformOrigin: "74% 50%" }}
              >
                <WoodRail side="bottom" finish="dark-walnut" mitre={0} id="hero-rail-b" className="h-full w-full" />
              </motion.div>
              <motion.div
                aria-hidden
                className="absolute -left-[3.4%] top-0 bottom-0 w-[3.4%]"
                style={{ opacity: railLeftO, scaleY: railLeft, transformOrigin: "50% 18%" }}
              >
                <WoodRail side="left" finish="dark-walnut" mitre={0} id="hero-rail-l" className="h-full w-full" />
              </motion.div>
              <motion.div
                aria-hidden
                className="absolute -right-[3.4%] top-0 bottom-0 w-[3.4%]"
                style={{ opacity: railRightO, scaleY: railRight, transformOrigin: "50% 68%" }}
              >
                <WoodRail side="right" finish="dark-walnut" mitre={0} id="hero-rail-r" className="h-full w-full" />
              </motion.div>

              {/* ---- glazing ---- */}
              <motion.div
                aria-hidden
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: glassOpacity }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(118deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0) 52%, rgba(255,255,255,0.045) 82%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <motion.div
                  className="absolute -inset-y-[25%] w-[34%]"
                  style={{
                    x: shineX,
                    opacity: shineOpacity,
                    rotate: 17,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0.18) 55%, transparent 100%)",
                    filter: "blur(7px)",
                  }}
                />
            </motion.div>

            {/* the roll itself, tracking the unfurling edge */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-[-2%] left-0 right-0"
              style={{ opacity: cylinderOpacity }}
            >
              <motion.div
                className="absolute bottom-0 top-0 -ml-[3.6%] w-[7.2%]"
                style={{
                  left: cylinderX,
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, #cdc5b1 16%, #f6f1e4 38%, #ded6c2 58%, #a89f8a 82%, #6d6656 100%)",
                  borderRadius: "42% / 5%",
                  boxShadow:
                    "-16px 0 30px -10px rgba(0,0,0,0.65), inset 0 0 12px rgba(0,0,0,0.18)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= 11–12 · the words ================= */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-40 h-[52%]"
          style={{
            opacity: scrimOpacity,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(8,9,8,0.72) 55%, rgba(8,9,8,0.94) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-[16%] z-50 px-6 text-center">
          <div className="relative mx-auto h-24 max-w-3xl">
            {[phrase1, phrase2, phrase3].map((op, i) => (
              <motion.p
                key={i}
                className="absolute inset-x-0 top-0 font-display text-2xl leading-snug text-bone/90 md:text-4xl"
                style={{ opacity: op }}
              >
                {EXCLUSIVITY_PHRASES[i]}
              </motion.p>
            ))}
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ opacity: outroOpacity, y: outroY }}
            >
              <p className="eyebrow mb-3">The debut collection</p>
              <motion.p
                className="font-display text-4xl uppercase text-bone md:text-6xl"
                style={{ letterSpacing: wordmarkSpacing }}
              >
                {COLLECTION_NAME}
              </motion.p>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-[7%] z-50 flex justify-center"
          style={{ opacity: outroOpacity, y: outroY }}
        >
          <Link
            href="/collection"
            className="border border-gold/70 px-10 py-4 text-[0.72rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            Explore the Collection
          </Link>
        </motion.div>

        {/* ================= 1 · opening title ================= */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: titleOpacity }}
        >
          <p className="eyebrow mb-6">Brahmanand Kori Photography</p>
          <h1 className="max-w-4xl font-display text-5xl font-medium text-bone md:text-7xl lg:text-8xl">
            The Mara, witnessed.
          </h1>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3"
          style={{ opacity: hintOpacity }}
        >
          <span className="eyebrow !text-ash">Scroll</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
