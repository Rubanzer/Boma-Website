# Brahmanand Kori Photography — the Zawadi Collection

A premium storefront for limited‑edition fine‑art wildlife prints from Kenya
and the Masai Mara. Dark, museum‑grade design; a cinematic scroll‑driven hero;
a full print configurator; and a concierge‑enquiry checkout.

**The signature hero** is a six‑stage scroll cinema, fully reversible on
scroll‑up: a wildlife scene zooms out into a DSLR lens → the camera ejects a
developing Polaroid → chart paper unrolls from the left and the Polaroid
settles at its centre → wood appears as small nubs on all four sides and grows
asymmetrically into a full frame → museum glass fades in with a specular shine
sweep → the framed piece hangs on a gallery wall beside cycling exclusivity
copy → the Zawadi wordmark and "Explore the Collection" resolve.

See [`docs/PRD.md`](docs/PRD.md) for the full product requirements document and
build plan derived from the client discovery call.

## Stack

- **Next.js 16** (App Router, TypeScript, SSG) · **Tailwind CSS v4**
- **Motion** (`motion/react`) for scroll‑mapped animation · **Lenis** for
  smooth scrolling (root mode)
- Self‑hosted fonts via **@fontsource** (Cormorant Garamond + Inter) — no
  external CDNs
- All "photographs" are original parameterised SVG art
  (`src/components/art/SavannaScene.tsx`); swapping in real photo scans later
  only touches `src/components/art/Print.tsx`

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (all routes prerendered)
npm run lint
```

## Structure

```
src/app                 routes: / /collection /print/[slug] /about /craft /cart
src/components/hero     ScrollCinema (the 6-stage film) + StaticHero fallback
src/components/art      SavannaScene, CameraDSLR, Print (photo seam), FramedPrint
src/components/product  configurator with live INR pricing + room preview
src/components/layout   header, footer, cart drawer
src/components/providers  Lenis smooth scroll, cart context (localStorage)
src/lib                 catalogue, types, pricing, palettes
docs/PRD.md             product requirements + build plan
```

## Accessibility & motion

`prefers-reduced-motion` collapses the scroll cinema into a static framed hero
and disables smooth scrolling; all interactive elements are keyboard‑reachable
with visible focus states.
