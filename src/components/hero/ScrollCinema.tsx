"use client";

import CameraDSLR from "@/components/art/CameraDSLR";
import Print from "@/components/art/Print";
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
 * The signature scroll-cinema. A ~620vh track with a sticky stage;
 * every visual is a PURE function of scroll progress p ∈ [0,1], so
 * scrolling up rewinds the whole film perfectly.
 *
 * Stages
 *  1  0.00–0.13  animal scene zooms out into the DSLR lens
 *  1b 0.13–0.20  the DSLR ejects a polaroid print from its slot
 *  2  0.20–0.36  chart paper unrolls from the left; polaroid settles centre
 *  3  0.36–0.52  wood appears as small nubs on all four sides, then
 *                flows & grows asymmetrically until the frame completes
 *  4  0.52–0.62  museum glass fades in; specular shine sweeps diagonally
 *  5  0.62–0.86  gallery wall; piece slides aside; 3 phrases cross-fade
 *  6  0.86–1.00  piece recentres; CTA + collection wordmark resolve
 */

const HERO_PRINT_SLUG = "sovereign-of-musiara";

export default function ScrollCinema() {
  const trackRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Measure the track ourselves — deterministic progress p ∈ [0,1]
  // over the pinned section, immune to useScroll target quirks.
  const rangeRef = useRef({ start: 0, span: 1 });
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      rangeRef.current = { start, span };
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

  /* ---------- STAGE 1 · animal → DSLR lens (0–0.13) ---------- */
  // The full-bleed scene shrinks into the lens circle.
  const sceneScale = useTransform(p, [0, 0.115], [1, 0.16]);
  const sceneRadius = useTransform(p, [0.04, 0.115], ["0%", "50%"]);
  const sceneOpacity = useTransform(p, [0.115, 0.135], [1, 0]);
  const camOpacity = useTransform(p, [0.055, 0.11], [0, 1]);
  const camScale = useTransform(p, [0.055, 0.11], [1.18, 1]);
  const camExit = useTransform(p, [0.24, 0.32], [1, 0]);
  const camY = useTransform(p, [0.24, 0.32], ["0%", "-16%"]);
  const openerOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.03], [1, 0]);

  /* ---------- STAGE 1b · polaroid ejects (0.13–0.22) ---------- */
  // Slides down out of the camera slot, "develops", then travels to centre.
  const polaroidOpacity = useTransform(p, [0.125, 0.15, 0.34, 0.36], [0, 1, 1, 0]);
  const polaroidY = useTransform(
    p,
    [0.125, 0.2, 0.26, 0.34],
    ["-46%", "16%", "30%", "2%"],
  );
  const polaroidScale = useTransform(p, [0.2, 0.34], [0.6, 1.65]);
  const polaroidRotate = useTransform(p, [0.16, 0.26, 0.34], [-6, 4, 0]);
  const developOpacity = useTransform(p, [0.15, 0.24], [0, 1]);

  /* ---------- STAGE 2 · the unroll (0.20–0.36) ---------- */
  const unroll = useTransform(p, [0.2, 0.36], [0, 1]);
  const paperClipRight = useTransform(unroll, [0, 1], ["100%", "0%"]);
  const paperClip = useMotionTemplate`inset(0% ${paperClipRight} 0% 0%)`;
  const paperOpacity = useTransform(p, [0.2, 0.23], [0, 1]);
  const cylinderX = useTransform(unroll, [0, 1], ["0%", "100%"]);
  const cylinderOpacity = useTransform(p, [0.2, 0.23, 0.35, 0.375], [0, 1, 1, 0]);
  // The centred print on the paper takes over from the travelling polaroid.
  const printOnPaperOpacity = useTransform(p, [0.34, 0.36], [0, 1]);

  /* ---------- STAGE 3 · asymmetric frame growth (0.36–0.52) ---------- */
  // Each side: a small nub appears near an off-centre origin, then grows
  // outward at its own pace (asymmetric), finally covering the full edge.
  // Implemented as scaleX/scaleY from staggered transform-origins.
  const nubTop = useTransform(p, [0.36, 0.385, 0.44, 0.5], [0, 0.14, 0.55, 1]);
  const nubBottom = useTransform(p, [0.37, 0.4, 0.47, 0.515], [0, 0.1, 0.7, 1]);
  const nubLeft = useTransform(p, [0.385, 0.41, 0.46, 0.51], [0, 0.18, 0.5, 1]);
  const nubRight = useTransform(p, [0.395, 0.42, 0.48, 0.52], [0, 0.12, 0.65, 1]);
  const nubTopOpacity = useTransform(p, [0.36, 0.375], [0, 1]);
  const nubBottomOpacity = useTransform(p, [0.37, 0.385], [0, 1]);
  const nubLeftOpacity = useTransform(p, [0.385, 0.4], [0, 1]);
  const nubRightOpacity = useTransform(p, [0.395, 0.41], [0, 1]);
  const cornersOpacity = useTransform(p, [0.505, 0.525], [0, 1]);

  /* ---------- STAGE 4 · glass + shine (0.52–0.62) ---------- */
  const glassOpacity = useTransform(p, [0.52, 0.57], [0, 1]);
  const shineX = useTransform(p, [0.53, 0.63], ["-130%", "170%"]);
  const shineOpacity = useTransform(p, [0.53, 0.555, 0.61, 0.635], [0, 1, 1, 0]);

  /* ---------- STAGE 5 · gallery wall + phrases (0.62–0.86) ---------- */
  const wallOpacity = useTransform(p, [0.6, 0.68], [0, 1]);
  const spotOpacity = useTransform(p, [0.64, 0.72], [0, 1]);
  // one continuous X for the piece: centre → left → centre (no discontinuity)
  const pieceX = useTransform(
    p,
    [0.62, 0.7, 0.84, 0.93],
    ["0%", "-24%", "-24%", "0%"],
  );
  const pieceScale = useTransform(
    p,
    [0.36, 0.52, 0.62, 0.7, 0.84, 0.94],
    [1, 1, 1, 0.82, 0.82, 0.9],
  );
  const pieceShadow = useTransform(p, [0.62, 0.7], [0, 1]);
  const phrase1 = useTransform(p, [0.66, 0.69, 0.725, 0.75], [0, 1, 1, 0]);
  const phrase2 = useTransform(p, [0.735, 0.76, 0.795, 0.82], [0, 1, 1, 0]);
  const phrase3 = useTransform(p, [0.805, 0.83, 0.865, 0.885], [0, 1, 1, 0]);
  const phrasesVisible = useTransform(p, [0.64, 0.66, 0.87, 0.9], [0, 1, 1, 0]);

  /* ---------- STAGE 6 · recentre + CTA (0.86–1.0) ---------- */
  const ctaOpacity = useTransform(p, [0.93, 0.985], [0, 1]);
  const ctaY = useTransform(p, [0.93, 0.985], [28, 0]);
  const wordmarkOpacity = useTransform(p, [0.9, 0.96], [0, 1]);
  const wordmarkSpacing = useTransform(p, [0.9, 1], ["0.6em", "0.34em"]);

  const phrases = EXCLUSIVITY_PHRASES;

  return (
    <section
      ref={trackRef}
      className="relative h-[460vh] md:h-[620vh]"
      aria-label="Cinematic introduction"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {/* ---------------- gallery wall (behind everything) ---------------- */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: wallOpacity,
            background:
              "linear-gradient(180deg, #262019 0%, #211d18 45%, #16130f 100%)",
          }}
        >
          {/* wall texture lines */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 118px, #000 118px 120px)",
            }}
          />
          {/* skirting */}
          <div className="absolute bottom-0 left-0 right-0 h-[7%] bg-[#0e0c09] border-t border-[#3a3128]/40" />
        </motion.div>

        {/* spotlight cone on the hung piece */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: spotOpacity,
            background:
              "radial-gradient(ellipse 46% 60% at 38% 42%, rgba(232,210,160,0.14) 0%, rgba(232,210,160,0.05) 45%, transparent 70%)",
          }}
        />

        {/* ---------------- STAGE 1 · full-bleed scene → lens ---------------- */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: sceneOpacity }}
        >
          <motion.div
            className="h-full w-full overflow-hidden"
            style={{ scale: sceneScale, borderRadius: sceneRadius }}
          >
            <Print print={print} id="hero-opening" className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* opening title over the scene */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ opacity: openerOpacity }}
        >
          <p className="eyebrow mb-6">Brahmanand Kori Photography</p>
          <h1 className="font-display text-bone text-5xl md:text-7xl lg:text-8xl font-medium max-w-4xl">
            The Mara, witnessed.
          </h1>
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none"
          style={{ opacity: hintOpacity }}
        >
          <span className="eyebrow !text-ash">Scroll</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </motion.div>

        {/* ---------------- DSLR ---------------- */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: camExit, y: camY }}
        >
          <motion.div
            className="w-[min(78vw,560px)]"
            style={{ opacity: camOpacity, scale: camScale }}
          >
            <CameraDSLR className="w-full" />
          </motion.div>
        </motion.div>

        {/* ---------------- polaroid ejecting & travelling ---------------- */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-30 w-[min(46vw,260px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: polaroidOpacity,
            y: polaroidY,
            scale: polaroidScale,
            rotate: polaroidRotate,
          }}
        >
          <div
            className="bg-[#f2eee4] p-[6%] pb-[16%]"
            style={{ boxShadow: "0 18px 44px -14px rgba(0,0,0,0.7)" }}
          >
            <motion.div style={{ opacity: developOpacity }}>
              <Print print={print} id="hero-polaroid" className="w-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* ---------------- the unrolled paper + frame + glass piece ---------------- */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ x: pieceX, scale: pieceScale }}
        >
          <div className="relative w-[min(86vw,760px)]">
            {/* cast shadow once hung on the wall */}
            <motion.div
              aria-hidden
              className="absolute -inset-x-6 -bottom-8 top-1/2"
              style={{
                opacity: pieceShadow,
                background:
                  "radial-gradient(ellipse 60% 45% at 50% 96%, rgba(0,0,0,0.55) 0%, transparent 70%)",
              }}
            />

            {/* chart paper sheet */}
            <motion.div
              className="relative"
              style={{ opacity: paperOpacity, clipPath: paperClip }}
            >
              <div
                className="relative bg-[#efe9db] p-[4.5%]"
                style={{
                  boxShadow: "0 26px 70px -20px rgba(0,0,0,0.8)",
                }}
              >
                {/* the print centred on the paper */}
                <motion.div style={{ opacity: printOnPaperOpacity }}>
                  <Print
                    print={print}
                    id="hero-paper-print"
                    className="w-full"
                  />
                </motion.div>
                {/* museum caption on the mat */}
                <motion.div
                  className="mt-[3%] flex items-baseline justify-between text-[#3d382e]"
                  style={{ opacity: printOnPaperOpacity }}
                >
                  <span className="font-display italic text-[clamp(0.7rem,1.6vw,1rem)]">
                    {print.title}
                  </span>
                  <span className="text-[clamp(0.5rem,1vw,0.65rem)] tracking-[0.22em] uppercase">
                    {print.location} · {print.year} · Edition of {print.editionOf}
                  </span>
                </motion.div>
              </div>

              {/* ---------------- STAGE 3 · asymmetric wood growth ---------------- */}
              {/* top rail — grows from 30% origin leftward & rightward */}
              <motion.div
                aria-hidden
                className="absolute -top-[2.6%] left-0 right-0 h-[3.4%]"
                style={{
                  opacity: nubTopOpacity,
                  scaleX: nubTop,
                  transformOrigin: "30% 50%",
                  background:
                    "linear-gradient(180deg, #5a4330 0%, #3b2b1d 60%, #2a1e13 100%)",
                }}
              />
              {/* bottom rail — origin 72% */}
              <motion.div
                aria-hidden
                className="absolute -bottom-[2.6%] left-0 right-0 h-[3.4%]"
                style={{
                  opacity: nubBottomOpacity,
                  scaleX: nubBottom,
                  transformOrigin: "72% 50%",
                  background:
                    "linear-gradient(0deg, #5a4330 0%, #3b2b1d 60%, #2a1e13 100%)",
                }}
              />
              {/* left rail — origin 20% from top */}
              <motion.div
                aria-hidden
                className="absolute -left-[2%] top-0 bottom-0 w-[2.6%]"
                style={{
                  opacity: nubLeftOpacity,
                  scaleY: nubLeft,
                  transformOrigin: "50% 20%",
                  background:
                    "linear-gradient(90deg, #5a4330 0%, #3b2b1d 60%, #2a1e13 100%)",
                }}
              />
              {/* right rail — origin 65% */}
              <motion.div
                aria-hidden
                className="absolute -right-[2%] top-0 bottom-0 w-[2.6%]"
                style={{
                  opacity: nubRightOpacity,
                  scaleY: nubRight,
                  transformOrigin: "50% 65%",
                  background:
                    "linear-gradient(270deg, #5a4330 0%, #3b2b1d 60%, #2a1e13 100%)",
                }}
              />
              {/* mitred corner glints */}
              <motion.div aria-hidden style={{ opacity: cornersOpacity }}>
                <span className="absolute -top-[2.6%] -left-[2%] h-[3.4%] w-[2.6%] bg-[#6b5138]" />
                <span className="absolute -top-[2.6%] -right-[2%] h-[3.4%] w-[2.6%] bg-[#493520]" />
                <span className="absolute -bottom-[2.6%] -left-[2%] h-[3.4%] w-[2.6%] bg-[#493520]" />
                <span className="absolute -bottom-[2.6%] -right-[2%] h-[3.4%] w-[2.6%] bg-[#6b5138]" />
              </motion.div>

              {/* ---------------- STAGE 4 · glass ---------------- */}
              <motion.div
                aria-hidden
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: glassOpacity }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 80%, rgba(255,255,255,0) 100%)",
                  }}
                />
                {/* the travelling specular shine */}
                <motion.div
                  className="absolute -inset-y-[20%] w-[38%]"
                  style={{
                    x: shineX,
                    opacity: shineOpacity,
                    rotate: 18,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 45%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.20) 55%, transparent 100%)",
                    filter: "blur(6px)",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* the rolled cylinder that travels with the reveal edge */}
            <motion.div
              aria-hidden
              className="absolute inset-y-[-1.5%] left-0 right-0 pointer-events-none"
              style={{ opacity: cylinderOpacity }}
            >
              <motion.div
                className="absolute top-0 bottom-0 w-[7%] -ml-[3.5%]"
                style={{
                  left: cylinderX,
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, #d9d2c0 18%, #f4efe2 40%, #b8b09c 78%, #776f5c 100%)",
                  borderRadius: "38% / 6%",
                  boxShadow: "-14px 0 26px -8px rgba(0,0,0,0.6)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ---------------- STAGE 5 · exclusivity phrases ---------------- */}
        <motion.div
          className="absolute inset-y-0 right-0 z-30 hidden w-[44%] items-center pr-[6%] md:flex pointer-events-none"
          style={{ opacity: phrasesVisible }}
        >
          <div className="relative h-40 w-full">
            {[phrase1, phrase2, phrase3].map((op, i) => (
              <motion.p
                key={i}
                className="absolute inset-0 font-display text-3xl lg:text-4xl leading-snug text-bone/90"
                style={{ opacity: op }}
              >
                {phrases[i]}
                <span className="mt-6 block h-px w-16 bg-gold/70" />
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* ---------------- STAGE 6 · wordmark + CTA ---------------- */}
        <motion.div
          className="absolute inset-x-0 top-[9%] z-30 text-center pointer-events-none"
          style={{ opacity: wordmarkOpacity }}
        >
          <p className="eyebrow mb-3">The debut collection</p>
          <motion.p
            className="font-display text-4xl md:text-6xl text-bone uppercase"
            style={{ letterSpacing: wordmarkSpacing }}
          >
            {COLLECTION_NAME}
          </motion.p>
        </motion.div>
        <motion.div
          className="absolute inset-x-0 bottom-[8%] z-30 flex justify-center"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <Link
            href="/collection"
            className="group border border-gold/70 px-10 py-4 text-[0.72rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
