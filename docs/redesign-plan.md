# TripQuest Website Redesign Plan

> **Status: implemented.** All phases below are done on the working tree.
> Decisions taken: reconciliation = **"white paper with illustrated windows"**; sourcing = **option C
> (motifs rebuilt as SVG)**; display face = **Nunito, self-hosted**; dark theme **dropped**; scope =
> **all six pages**. See [What shipped](#what-shipped) at the end for the as-built record.

Two independent but related workstreams:

- **Part 1 — Illustrated backgrounds:** bring the painted road-trip artwork from the App Store screenshots into the site background.
- **Part 2 — Layout system:** restructure the page to match the Duolingo-style reference at
  https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350

They conflict in one important way. Read [Reconciling the two](#reconciling-the-two-parts) before starting either.

---

## Current state (baseline)

| Item | Today |
|---|---|
| Pages | `index.html`, `support.html`, `privacy.html`, `submit-content.html`, `release-notes.html`, `feedback.html` |
| CSS | Single `style.css` (~23 KB), hand-rolled, no build step |
| JS | `script.js` (nav toggle + copyright year) |
| Theme | Dark navy gradient, glassmorphism panels (`.glass-panel`, `backdrop-filter`), gold/cyan accents |
| Background | CSS-only: `body` radial gradients + `.sky-noise` star dots + three blurred `.orb` divs |
| Type | Inter, weights 800–950, `clamp()` fluid sizing, tight negative tracking |
| Radii | 18 / 24 / 32px |
| Wrap | 1180px |
| Deploy | GitHub Pages (CNAME → thetripquestapp.com), static |
| Local preview | `.claude/launch.json` → `python3 -m http.server 4321` |

**Asset weight problem, relevant to both parts:** `assets/` currently ships ~16 MB of PNGs
(`app-trip-trivia.png` 4.0 MB, `app-story-reveal.png` 3.3 MB, `app-content-selector.png` 3.3 MB,
`app-home.png` 2.7 MB, `app-trip-setup.png` 2.6 MB, `tripquest-icon.png` 992 KB). Any background-image
work must not add to this. Fixing it is a prerequisite, not a nice-to-have.

---

## Part 1 — Illustrated backgrounds

### 1.1 What the source imagery actually is

The three App Store marketing screenshots share a consistent painted-illustration language:

| Screenshot | Background scene | Palette |
|---|---|---|
| "Packs for Every Adventure" | Alpine lake + pine forest + blue SUV on a curving road, wooden signpost | Sky blue `#3aa8f0`-ish, pine green, warm wood brown, gold accents |
| "Relive Your Best Trips" | Flat-vector tropical coast, palms, winding highway, mountains | Flatter, 3–4 blues + teal, yellow signposts |
| "Spark Fun Conversations" | Detailed painted forest + coastal cliffs, mountains, blue SUV | Same blues, deeper greens, gold sun sparkles |

Common vocabulary worth extracting as reusable motifs:
- **Sky gradient** — light cyan at horizon → saturated blue at top
- **Curving road ribbon** with dashed centerline
- **Layered horizon** — mountains behind, conifer treeline in front
- **Puffy clouds**, **route dashes**, **map-pin**, **wooden signpost**, **gold sun-ray sparkles**

### 1.2 Sourcing — decide this first

The images shown are composed App Store marketing frames; they are **not in the repo**. Three options:

- **A. Re-generate clean, text-free background art** (recommended). Produce 3–5 wide scenes without the
  device mockup, headline text, or signposts. Gives full control over crop, aspect, and file size.
- **B. Crop the existing marketing frames.** Cheapest, but the compositions are portrait 4:5 with a device
  mockup punched out of the middle — they crop badly to wide web bands, and the baked-in headline text
  will fight the site's own copy.
- **C. Rebuild the motifs as inline SVG.** Best performance (a few KB, infinitely scalable, theme-able via
  `currentColor`), and it survives Part 2's flat-surface rules better than photographic art. Loses the
  painted texture.

**Recommendation: C for structural elements (sky bands, horizon layers, road ribbon, clouds, dashes) plus
A for two or three "hero moment" raster scenes.** Do not do B.

### 1.3 Where backgrounds go

Do not put a single scene behind the whole page — it will collide with text at every scroll position, and
it fights the reference style's white canvas. Instead, **place scenery at section seams and in bounded
containers**, so the middle of the page stays calm and readable.

| Zone | Treatment |
|---|---|
| Hero | Full-bleed sky gradient + layered SVG horizon (mountains, treeline) anchored to the bottom edge, with the road ribbon leading toward the phone mockup. Content sits on the sky, never on the busy treeline. |
| Section dividers | SVG "horizon divider" between sections — a treeline or hill silhouette, ~80–140px tall, that visually stitches white sections together. |
| Feature bands (2–3 max) | Full-bleed raster scene with a color-matched scrim, white/near-white text on top. These are the "hero moment" images from option A. |
| Cards / panels | No background art. Flat surfaces only. Art belongs behind sections, never behind body copy. |
| Footer | Solid brand-blue band (see Part 2) with a subtle road-dash or map-pin motif at low opacity. |
| Fixed page backdrop | Replace `.orb` + `.sky-noise` with a **single** very low-opacity cloud/route-dash tile, or drop it entirely. |

### 1.4 Implementation notes

1. **Delete the current backdrop layers.** `.sky-noise` and the three `.orb` divs in `index.html` (and their
   ~35 lines of CSS) become redundant once real scenery lands. Removing them also removes three
   `position: fixed` blurred layers that cost paint time on mobile.
2. **Inline the SVGs** for dividers and the horizon — they're small, they avoid extra requests, and they can
   pick up CSS custom properties for color.
3. **Raster bands use `<picture>`** with AVIF → WebP → JPEG fallbacks, `loading="lazy"` on everything below
   the fold, explicit `width`/`height` to prevent CLS, and `srcset` at ~800/1400/2000px.
4. **Budget:** every raster background ≤ 150 KB at 1400px wide. Total page weight target ≤ 1.5 MB.
   Today's five app screenshots alone are 16 MB — convert them to WebP/AVIF in the same pass (expect
   95%+ reduction).
5. **Text contrast is non-negotiable.** Any text over a raster band gets either a solid scrim
   (`rgba(6,19,38,0.55)` or a brand-blue tint) or a dedicated flat card. Verify 4.5:1 for body, 3:1 for
   large text, at every breakpoint.
6. **Motion:** if a parallax or drifting-cloud effect is added, gate it behind
   `@media (prefers-reduced-motion: no-preference)`.
7. **Mobile:** raster bands switch to a shorter crop or a flat color fill under ~640px. Do not ship a 2000px
   scene to a phone.
8. **Decorative art is `aria-hidden="true"`** and carries empty `alt`. Only the app screenshots are
   meaningful images.

### 1.5 Part 1 deliverables

- [ ] Decide sourcing (A / C / mixed) and generate the art
- [ ] Add `assets/bg/` with optimized AVIF + WebP + JPEG sets
- [ ] Convert the five existing app screenshots to WebP/AVIF; keep PNG fallback only if needed
- [ ] Inline SVG horizon + divider components in CSS/markup
- [ ] Remove `.sky-noise` / `.orb` markup and CSS
- [ ] Contrast audit at 360 / 768 / 1280 / 1920px

---

## Part 2 — Layout, modeled on the reference style

### 2.1 What the reference specifies

The reference URL resolves to **Duolingo — "Playful classroom mascot on white paper."** Its defining rules:

**Color**

| Role | Duolingo value | Notes |
|---|---|---|
| Page canvas | `#ffffff` | Every section sits on pure white |
| Primary saturated | `#58cc02` Eager Green | Display headings, CTA fill, footer band — nothing else |
| Soft wash | `#d7ffb8` | Subtle background tints |
| Accent / links | `#1cb0f6` Spark Blue | Links and outlined secondary CTAs only |
| Heading + body dark | `#4b4b4b` Charcoal | Hero headline, primary body |
| Muted body | `#777777` Pencil Gray | Default paragraph color |
| Borders | `#afafaf` Faded Gray | 2px button/pill borders |

**Typography** — Minor Third (1.2) scale from a 16px base:
display 64/1.2/-1.28px · heading 48/1.2/-0.96px · heading-sm 32/1.2 · subheading 19/1.4 ·
body 17/1.18 · nav-label 15/1.33 uppercase with 0.053em tracking · caption 13/1.23.
Rounded display face (Feather / Nunito Black substitute) at 48–64px only; geometric sans (Nunito Sans /
DIN Next / Inter) 500 for body, 700 for emphasis.

**Shape & spacing** — 4px base unit; scale 8/12/16/24/32/40/48/64/80/96; **12px radius on everything**
(buttons, links, nav items, pills); 1200px max width; 80–120px section gaps; 16–24px card padding;
12px element gap.

**Components** — filled primary CTA (color-only, no border); outlined secondary (2px `#afafaf` border,
blue text); nav pills (transparent, 2px border, uppercase label); section headline in the display face and
the brand's saturated color; illustration floating beside text with **no container**; full-width saturated
footer band at 48px vertical padding.

**Hard "don'ts" from the reference:** no gradients, no shadows, no glass effects, no sharp corners, no
colored body text, no display face below 48px, no saturated color on small UI text.

### 2.2 TripQuest translation of the palette

Do not adopt Duolingo green. Map the *roles* onto TripQuest's existing brand blue/gold, taken from the
app artwork and the current stylesheet:

| Role | Token | Value | Source |
|---|---|---|---|
| Canvas | `--canvas` | `#ffffff` | new |
| Brand saturated | `--brand` | `#2a9df4` (from the app's sky blue) | app art |
| Brand deep | `--brand-deep` | `#0d2a52` | existing `--navy-800` |
| Soft wash | `--wash` | `#dff0ff` | new |
| Accent | `--accent` | `#ffc33d` gold | existing `--gold` |
| Heading / strong body | `--ink` | `#173049` | new, ≥7:1 on white |
| Muted body | `--ink-muted` | `#5b6b7c` | new, ≥4.5:1 on white |
| Border | `--line` | `#c6d3de` | new |

Role discipline mirrors the reference: **brand blue** carries display headings, the primary CTA fill, and the
footer band. **Gold** is the accent for pills, highlights, and the secondary outlined CTA — the "curious
companion." Body copy stays `--ink-muted`; never colored.

Contrast caution: `#2a9df4` on white is roughly 2.6:1 — fine for 48px+ display headings under the large-text
rule, **not** fine for body text or small UI. White text on a `#2a9df4` fill is also below 4.5:1; for the
primary CTA and footer band, either darken the fill toward `#1571c4` or use `--brand-deep` text. Verify
before shipping.

### 2.3 Typography translation

Replace the current Inter-at-950-weight treatment:

- **Display** — Nunito Black (or Baloo 2 / Fredoka, all rounded and free) at 48–64px, `line-height: 1.2`,
  `letter-spacing: -0.02em`, colored `--brand`. Self-host as WOFF2 with `font-display: swap`; do not add a
  Google Fonts request to a static site that currently has zero third-party calls.
- **Body** — Nunito Sans 500 at 17px, `line-height: 1.18–1.4`, `--ink-muted`.
- **Nav labels** — 15px, 700, uppercase, `letter-spacing: 0.053em`.
- Replace the `clamp(3.2rem, 6.6vw, 6.2rem)` fluid ramp with the fixed Minor Third scale as custom
  properties, with one scale-down step at the mobile breakpoint.

### 2.4 Structural changes to `index.html`

Current order: hero → submit callout → trust panel → screens → how-it-works → games → trip mode → packs →
perfect-for → FAQ → final CTA → footer. The content is good; the **framing** changes.

| Section | Change |
|---|---|
| Header | White, 2px bottom border in `--line` instead of translucent blur. Nav links become uppercase 15px pills at 12px radius. App Store badge stays as the right-hand anchor. |
| Hero | Split layout, copy left / phone mockups right, illustration **not** in a card. Headline in `--ink` at 32–48px (reference keeps the *hero* headline neutral so the CTA carries the color); primary CTA below it. Sky + horizon art from Part 1 sits behind, bounded to the hero. |
| Submit callout | Currently a glass panel. Becomes a flat `--wash` band with a 2px border and a filled primary CTA. |
| Trust panel | Flat white, no container — just centered display heading + body. |
| Screens | Screenshots float on white with no card chrome (reference: "illustrations floating beside text, no container"). Keep captions as 13px captions. |
| How it works | 4 flat cards, 2px `--line` border, 12px radius, 16–24px padding, numeral in a filled brand circle. |
| Games | 3-col grid of the same flat card. Icons become simple filled circles, not gradient chips. |
| Trip Mode | Alternating split — copy left, screenshot right, no panel. Checklist markers in `--brand`. |
| Packs | Two-column: display heading left, flat bordered list right. Each row 12px radius, 2px border. |
| Perfect for | Row of outlined pills, 2px `--line` border, 12px radius, uppercase 15px labels. |
| FAQ | `<details>` accordions keep semantics; restyle to flat bordered rows with a 12px radius. |
| Final CTA | Full-width `--wash` (or brand-tinted) band, centered display heading, filled CTA. |
| Footer | **Full-width saturated brand-blue band**, 48px vertical padding, white section headers, `--wash` links stacked with 8px gaps. This is the reference's strongest structural signature. |

### 2.5 CSS refactor

`style.css` is a single flat file with theme values scattered inline (`rgba(...)` literals in ~40 places).
Before restyling, tokenize:

1. **Token layer** — replace the `:root` block with the Part 2.2 palette, the type scale, the 4px spacing
   scale, and a single `--radius: 12px`.
2. **Delete `.glass-panel`.** It's applied on 20+ elements across five pages and directly violates the
   reference's "no glass, no shadows, no gradients" rule. Replace with `.surface` (white fill, 2px `--line`
   border, 12px radius) — same class-swap surface area, flat result.
3. **Purge shadow/gradient/blur.** Remove `--shadow`, `backdrop-filter`, every `linear-gradient` on a
   component surface, and the `filter: brightness()` hovers. Hover states become a border-color or fill
   change.
4. **Radii** — `--radius-xl/lg/md` (32/24/18) all collapse to 12px.
5. **Wrap** — 1180px → 1200px.
6. **Section padding** — 88px → the 80–120px band using the spacing tokens.
7. Apply to all six HTML pages, not just `index.html`. `support.html`, `privacy.html`,
   `submit-content.html`, and `release-notes.html` share `.glass-panel`, `.page-hero`, and `.content-card`.

### 2.6 Accessibility carry-over

The current site does several things right — keep them: skip link, `aria-expanded` nav toggle,
`aria-current` on nav, visible `:focus-visible` outline, `<details>` for FAQ. The focus ring color
(`#fff2a8`, tuned for a dark background) must change to something that reads on white — `--brand-deep`
at 3px works.

---

## Reconciling the two parts

**These requests pull in opposite directions, and this is the main decision to make.**

Part 1 wants rich, painted, atmospheric backgrounds. Part 2's reference explicitly forbids gradients,
shadows, and glass, and wants "white-on-white sections with illustrations floating beside text" — a flat
paper canvas where color appears only in display headings, the CTA, and the footer band.

Applied naively, you get illustrations fighting a canvas that was designed to be empty.

**Recommended resolution — "white paper with illustrated windows":**

- Sections, cards, type, buttons, and spacing follow the reference **exactly**: white canvas, flat surfaces,
  2px borders, 12px radius, no shadows.
- Scenery is **contained, not ambient**. It appears in three places only: the hero backdrop, the section
  divider silhouettes, and two or three full-bleed feature bands.
- Everything between those is pure white. The art reads as deliberate punctuation instead of wallpaper.
- Within the art itself, the painted style is fine — the "no gradients" rule governs *UI surfaces*, not
  illustration content. The reference makes this same distinction: mascot art carries a secondary palette
  the UI chrome never touches.

**Alternative if you want more scenery:** treat the reference as a *layout and typography* spec only and
keep an illustrated canvas throughout. That is a legitimate choice, but it stops being a Duolingo-style
site — say so explicitly rather than drifting into it.

---

## Sequencing

| Phase | Work | Why first |
|---|---|---|
| 0 | Decide the Part 1 sourcing option and the reconciliation stance | Everything downstream depends on both |
| 1 | Optimize existing assets (16 MB → target <1 MB) | Independent win; unblocks any background work |
| 2 | Token layer + type scale + self-hosted fonts in `style.css` | Foundation for every visual change |
| 3 | Flatten surfaces: `.glass-panel` → `.surface`, purge shadows/gradients/blur, radii → 12px | The largest single diff; do it in one pass across all six pages |
| 4 | Restructure `index.html` section by section (2.4 table) | Now that surfaces are flat, layout is visible |
| 5 | Footer band + header restyle | The two strongest reference signatures |
| 6 | Generate and place background art (hero, dividers, feature bands) | Lands on a finished, stable layout |
| 7 | Apply to the five secondary pages | They share the same classes |
| 8 | Verify: contrast at 4 breakpoints, `prefers-reduced-motion`, keyboard nav, Lighthouse | — |

Work on a branch; `main` deploys straight to GitHub Pages.

## Verification

- Local preview via the existing `.claude/launch.json` config (`python3 -m http.server 4321`)
- Contrast: every text/background pair, especially white-on-brand-blue and brand-blue-on-white
- Breakpoints: 360, 768, 1280, 1920
- Keyboard: skip link, nav toggle, FAQ accordions, all CTAs
- Page weight before/after, and Lighthouse performance + a11y

---

## What shipped

### Assets

| | Before | After |
|---|---|---|
| `assets/` on disk | 16 MB | 2.6 MB |
| `index.html` payload | ~16 MB | **566 KB** across 15 files |
| Screenshots | 1206×2622 PNG, 2.6–4.0 MB each | 900px WebP (61–135 KB) + downscaled PNG fallback via `<picture>` |
| Fonts | Inter (system fallback) | `assets/fonts/nunito-latin-var.woff2` — 39 KB variable, 400–900, self-hosted, preloaded. No third-party requests. |

### Scenery — `assets/scenery/` (SVG, option C)

Generated, not cropped. Total ~25 KB for all four.

| File | Use |
|---|---|
| `horizon.svg` | Layered scene: snow-capped far peaks, mid hills, treeline, winding road ribbon with perspective-tapered dashed centerline. Tree rows are masked out where the road runs. |
| `clouds.svg` | Puffy cloud band across the top of the hero only. |
| `divider.svg` | Conifer treeline that transitions a white section into a scene band. |
| `route.svg` | Dashed route line + map pin, low opacity, behind the footer band. |

**Placement — five illustrated windows, everything else pure white:**
`index.html` hero · treeline divider → Trip Mode scene · treeline divider → final-CTA scene · footer motif.
Each interior page gets one scene hero plus the footer band.

Text never sits on the busy part of the art: `.scene-art` is capped at `max-height: 62%`
(45% on the shorter interior-page heroes) and anchored to the bottom, so copy always lands on open sky.

### Layout system — `style.css` (full rewrite, 552 → ~640 lines)

- Token layer: palette, Minor Third type scale (13/15/17/19/24/32/48/64), 4px spacing scale, single `--radius: 12px`, 1200px wrap.
- `.glass-panel` → `.surface` (white fill, 2px `--line` border, 12px radius). Every `backdrop-filter`, `box-shadow`, component gradient, and `filter: brightness()` hover removed. Radii 32/24/18 → 12.
- `.sky-noise` and the three `.orb` fixed layers deleted from markup and CSS.
- Nav links, buttons, and pills are uppercase 15px/700 at 0.053em tracking; outlined secondary buttons carry a 2px border.
- Footer is a full-width `#1369b5` band, 48px vertical padding, white headers and `--wash` links.
- Screenshots and the Trip Mode phone float free — no card chrome, per the reference.

### Palette as built

`--brand #1d90e8` (display headings only) · `--brand-cta #1369b5` (fills, links, eyebrows) ·
`--brand-deep #0d2a52` · `--accent #ffc33d` with `--accent-ink #5c3f00` ·
`--ink #173049` · `--ink-muted #5b6b7c` · `--line #c6d3de` · `--wash #dff0ff`.

The plan's provisional `#2a9df4` / `#1571c4` both failed the audit (2.91:1 for display on white,
4.31:1 for footer links on the band) and were darkened. `#2a9df4` survives only inside the illustrations,
where it is the sky, not text.

### Verification

- **Contrast** — all 11 text/background pairs pass; worst case is display-on-white at 3.38:1 (needs 3:1 for 48px+). Body 5.47:1, footer links 4.86:1, gold button 6.06:1.
- **Breakpoints** — 390 and 1280 checked; no horizontal overflow at either (`scrollWidth === innerWidth`).
- **Grid** — `minmax(0, 1fr)` everywhere plus `picture { display: block; min-width: 0 }`, after the 900px screenshots blew grid columns out to natural width and tripled page height.
- **Behavior** — mobile nav toggle sets `body.nav-open` / `aria-expanded` correctly; zero console errors; `prefers-reduced-motion` disables smooth scroll and transitions.

### Notes

- `.claude/launch.json` moved from port 4321 (occupied) to **4399**.
- `feedback.html` is a redirect stub and needed only the theme-color update.
- Changes are on the working tree, uncommitted. `main` deploys straight to GitHub Pages.

### Possible follow-ups

- A raster "hero moment" band (plan option A) if you want painted texture somewhere the SVG can't reach.
- Regenerate `assets/og-tripquest.png` — it still uses the old dark navy treatment.
- `apple-touch-icon.png` and `favicon-*.png` were left untouched.
