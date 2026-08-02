# Brahmanand Kori Photography — Product Requirements Document

**Fine‑art wildlife prints from Kenya & the Masai Mara**

| | |
|---|---|
| **Brand** | **Brahmanand Kori Photography** — a premium e‑commerce & storytelling site selling limited‑edition wildlife prints and frames (repo: Boma‑Website) |
| **Client** | Brahmanand Kori, wildlife photographer (Kenya / Masai Mara) |
| **Debut collection** | **ZAWADI** (Swahili: *"gift"*) |
| **Author of this PRD** | Derived from the client discovery call and built by Claude |
| **Status** | v1 — implemented in this repository |

---

## 1. Background & vision

Brahmanand shoots wildlife in Kenya and the Masai Mara and wants to sell **high‑quality premium prints and frames** of his photographs. This is not a commodity print shop — it is a **fine‑art gallery experience**. During discovery the client repeatedly emphasised two things:

1. **Cinematic, scroll‑driven storytelling** — he described (in his own words) a "scroll cinema" experience powered by "WebGL / Three.js / GPU rendering". The emotional goal is that the site should *feel* like walking into a private museum gallery.
2. **Exclusivity** — the copy he dictated: *"Fine‑art prints that are crafted for the select few who value exclusivity."*

A studio quoted **₹15–18 lakh** for this build (≈₹13–15L design + ₹2.5L development), which tells us the **bar is a design‑studio‑grade portfolio piece**, not a template store.

### 1.1 The signature idea (the client's exact concept)

The client described one hero animation in detail. It is the centrepiece of the site and is reproduced faithfully:

> *"Like a chart‑paper roll from school — a roll on the left that unrolls as you scroll. At one point it's fully open and the print is in the centre. Then on its four edges, wooden frame edges appear slowly from all four sides and join at the corners. Then glass — it gets reflective, a shine. Scroll back and it reverses. Then the framed print hangs on a museum gallery wall, and in the negative space beside it, text appears — and as you scroll the text changes, three phrases. Then scroll back down and the print takes the centre again and a button appears: 'Explore the Collection'."*

And the opening beat:

> *"First show an animal, then zoom out … it zooms out to your camera. And after the camera, the scroll sequence begins."*

Two refinements were added after the call: the camera is a **DSLR** that **produces a Polaroid‑style print from its bottom slot**, and that Polaroid is what settles into the centre of the unrolling chart paper; and the frame does not slide in as rigid rails — **a small bit of wood appears on each of the four sides and then flows and grows asymmetrically** until it covers the entire edge.

This document turns that description into an implementable sequence (see §4).

### 1.2 Design language (from the call)

- **Mood:** dark. "Dark grey, green — this type of thing." Museum/gallery calm.
- **Typography:** one distinctive display face for the brand name; refined, editorial.
- **Feel:** exclusive, crafted, unhurried, tactile (paper, wood, glass).

---

## 2. Goals & non‑goals

### Goals
- Deliver a **cinematic, scroll‑mapped hero** that reproduces the client's chart‑paper‑roll → frame → glass → gallery‑wall sequence.
- Present prints as **fine art**: rich detail pages with size / paper / frame options and a room preview.
- Communicate **provenance and craft** (the Mara, archival paper, museum glass, hand framing, limited editions).
- Provide a working **commerce flow**: browse → configure → cart → enquiry/checkout.
- Be **fast, responsive, accessible**, and **respect `prefers-reduced-motion`**.

### Non‑goals (v1)
- No real payment gateway (checkout collects a structured order enquiry; Stripe/Razorpay is a v2 drop‑in).
- No CMS/admin (product data lives in a typed data file; a CMS is a v2 swap).
- No user accounts.
- No real photographs are shipped — the build uses **original, thematically‑accurate SVG artwork** as placeholders with a clean seam so real scans drop in later (see §7).

---

## 3. Users & key journeys

| Persona | Need | Journey |
|---|---|---|
| **The collector** | A statement piece, confidence in quality | Hero → Zawadi collection → product → configure size/frame → cart → checkout enquiry |
| **The admirer** | To experience the work, be moved | Hero cinema → About the photographer → newsletter/enquiry |
| **The interior designer** | Fit, sizing, materials | Product → room preview → materials/craft → enquiry for multiples |

---

## 4. The signature hero — scroll‑cinema spec

Implemented as a single tall scroll track (~600vh) with a **pinned/sticky viewport**. Scroll progress `p ∈ [0,1]` drives every stage. All ranges are approximate and tuned in code.

| Stage | `p` | What happens |
|---|---|---|
| **1 — Animal → DSLR** | 0.00–0.13 | A wildlife scene fills the frame, then **zooms out** until it sits inside the lens of a **DSLR**. Establishes "this is his eye." |
| **1b — The Polaroid** | 0.13–0.20 | The DSLR **ejects a Polaroid‑style print from its bottom slot**; the image "develops" as it slides out. |
| **2 — The unroll** | 0.20–0.36 | Chart paper unrolls like a **school chart‑paper roll from the left**; the **Polaroid travels to and settles in the centre** of the opened sheet. |
| **3 — The frame** | 0.36–0.52 | A **small nub of wood appears on each of the four sides**, then each **flows and grows asymmetrically** (uneven origins and speeds) until the four spreads merge to cover every edge; mitred‑corner glints resolve last. |
| **4 — The glass** | 0.52–0.62 | **Museum glass** fades in over the print and a **specular shine sweeps** diagonally across it. |
| **5 — The gallery wall** | 0.62–0.86 | Background becomes a **gallery wall**; the framed piece settles with a soft cast shadow and spotlight. In the negative space, **exclusivity copy cycles** through three phrases. |
| **6 — Explore** | 0.86–1.00 | The piece **recentres**; the **"Explore the Collection"** button and Zawadi wordmark resolve. |

**Reversibility:** because every stage is a pure function of scroll progress, scrolling up cleanly reverses the sequence (as the client asked).

**Reduced motion:** when `prefers-reduced-motion: reduce`, the track collapses to a static, elegant framed hero with the same copy and CTA — no pinning, no sweep.

**Performance:** transforms are GPU‑friendly (`transform`/`opacity` only), art is vector (SVG) so it's razor‑sharp at any DPR and tiny over the wire. No 30 MB WebGL bundle required to hit the cinematic goal.

---

## 5. Information architecture

```
/                     Home — scroll‑cinema hero, Zawadi feature, the craft, about teaser, CTA
/collection           The Zawadi collection — filterable gallery grid
/print/[slug]         Product detail — configurator, room preview, story, materials
/about                The photographer — story, field notes, process
/craft                Materials & craft — paper, glass, framing, editions
/cart                 Cart + checkout enquiry
```

Global: sticky header (transparent over hero → solid on scroll), cart drawer, footer.

---

## 6. Feature requirements

### 6.1 Catalogue & product
- Typed product model: `slug, title, animal, location, year, story, orientation, sizes[], papers[], frames[], basePrice, editionOf, palette`.
- **Configurator:** choose **size**, **paper** (archival matte / baryta gloss), **frame** (natural oak / dark walnut / blackwood / frameless), optional **museum glass**. Price recomputes live.
- **Room preview:** the configured piece rendered on a wall to convey scale.
- **Limited edition** badge (e.g. "Edition of 25").

### 6.2 Commerce
- Cart in `localStorage` via React context; slide‑over drawer + `/cart` page.
- Line items capture the full configuration; live subtotal.
- **Checkout = structured enquiry** (name, email, shipping city, message) producing an order summary. Clearly labelled as concierge/enquiry, upgradeable to a payment gateway.

### 6.3 Storytelling
- About page with the photographer's narrative and field notes.
- Craft page explaining archival materials and the framing sequence (ties back to the hero).

### 6.4 Cross‑cutting
- SEO metadata + Open Graph; semantic HTML; keyboard‑navigable; visible focus states.
- Responsive from 360 px to ultrawide.
- `prefers-reduced-motion` honoured everywhere.

---

## 7. Assets strategy (placeholders → real photos)

Real photographs are not part of this repo. To keep the site **self‑contained, sharp, and on‑theme**, every "photograph" is rendered by a single parameterised component, `SavannaScene`, that draws layered savanna scenes (sky gradient, sun/moon, hills, acacia, and an animal silhouette) keyed by `animal` + `palette`. Swapping to real scans later is a one‑file change: replace the `<SavannaScene/>` render with `<Image/>` behind the same `Print` component — **no page or layout changes required**.

---

## 8. Tech stack & rationale

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Industry standard; SSG/SSR ready; great DX; the "low developer cost" the client was told about. |
| Styling | **Tailwind CSS v4** | Fast, consistent design tokens. |
| Motion | **Motion (Framer Motion) + Lenis** | Scroll‑progress mapping + buttery smooth scroll = the "scroll cinema" without hand‑rolled WebGL. |
| Fonts | **Cormorant Garamond** (display) + **Inter** (UI), self‑hosted via `@fontsource` | Editorial, exclusive; self‑hosted = no external CDN, no layout shift. |
| Art | **Original SVG** (`SavannaScene`) | Sharp at any size, tiny payload, on‑brand, easy to swap for photos. |

> **Note on WebGL/Three.js:** the client heard these buzzwords. For this content the same cinematic result is achieved with scroll‑mapped transforms — lighter, more reliable, better on mobile. Three.js remains an option for a v2 3D room walk‑through if desired.

---

## 9. Step‑by‑step build plan (as executed)

1. **Scaffold** Next.js + TS + Tailwind; add Motion, Lenis, `@fontsource` fonts.
2. **Design system** — dark palette (near‑black, dark grey, deep forest green, warm gold, bone), type scale, global CSS, Lenis smooth‑scroll provider, motion primitives.
3. **Art + data** — `SavannaScene` SVG engine, camera SVG, and the typed Zawadi catalogue.
4. **Signature hero** — the six‑stage scroll‑cinema with reduced‑motion fallback.
5. **Home** — hero → featured Zawadi → the craft → about teaser → CTA.
6. **Collection** — filterable gallery grid.
7. **Product** — configurator + room preview + story + add‑to‑cart.
8. **Cart & checkout** — context store, drawer, `/cart`, enquiry summary.
9. **About & Craft** — storytelling pages.
10. **Polish** — header/footer, SEO, favicon, responsive, a11y, reduced motion.
11. **Verify** — `next build` clean; **commit & push**.

---

## 10. Success metrics (for launch)

- Hero completes and reverses smoothly at 60 fps on a mid‑range laptop; graceful on mobile.
- Lighthouse: Performance ≥ 85 (desktop), Accessibility ≥ 95.
- A visitor can go hero → configure a print → add to cart → submit an enquiry with no dead ends.

## 11. Roadmap (v2+)

- Real photograph pipeline + responsive image optimisation.
- Payment gateway (Razorpay/Stripe) + real fulfilment.
- Headless CMS for the catalogue and journal.
- Optional Three.js 3D gallery walk‑through.
- Editorial "Journal" (field stories) for SEO and depth.
