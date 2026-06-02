# Pocket Voice — Session Handoff

Marketing site for **Pocket Voice**, an iOS smart-dictation app. This doc hands off to a
new session. **Next step: (1) a typography pass, (2) add product screens/screenshots
throughout the page.** References for both will be provided by the user — wait for them
before making aesthetic calls.

> Use the design skills the project relies on: `/impeccable`, `/design-taste-frontend`,
> `/ui-ux-pro-max`, `/emil-design-eng`, `/ogilvy-copywriting`.

---

## Run it

- Stack: **Vite + React + TypeScript**, inline styles (`style={{…}}`) + CSS in `src/design/`.
- Dev server: `npm run dev` → **http://localhost:5173** (launch config name `pocket-voice` in `.claude/launch.json`; prefer the `preview_*` tools).
- Build / typecheck: `npm run build` (runs `tsc --noEmit && vite build`).
- Branch: `feat/initial-launch`.
- ⚠️ **Preview caveat:** the in-tool preview tab throttles/pauses ALL animation (CSS + rAF) when offscreen — an `requestAnimationFrame` probe times out. So GSAP/CSS motion looks "frozen" there. **Verify motion in a real foreground browser**, not via `preview_screenshot`/`eval`. Structure/colors/fonts can still be inspected via `preview_eval`.

---

## Brand system (Manual v6)

Source: `/Volumes/MIS DATOS/L-R/NEUTRALSTUDIO/POCKET VOICE/Marca/Entregables/Manual de Marca/PocketVoice_BrandManual_v6.pdf` (23pp). Brand deliverables (logos, cloud masters, ads) live under `…/Marca/Entregables/`.

- **Type:** **Erode** (display serif — H1–H3, taglines) + **Satoshi** (sans — body, UI, labels). Scale ratio **1.333**. Self-hosted woff2 in `public/fonts/` (Erode Light/Regular/Medium/Semibold + italics; Satoshi Light/Regular/Medium/Bold + italics). `@font-face` in `src/design/fonts.css`.
- **Color:** Pocket Blue `#0E8ECE`, Blue Deep `#0066A4`, Pocket Black `#1B1A19`, Graphite `#3A3937`, Ash `#8A8783`, Fog `#E8E6E2`, Paper `#FAFAF8`. Gradients: Atmosphere / Sky / Voice. All in `src/design/tokens.css` as `--pv-*` + semantic aliases (`--ink-0/1/2`, `--surface-0/1/2/3`, `--accent`, `--hairline`).
- **Marks:** engineered "speaker + voice" **symbol** (stem + 8 rays, 180° arc) and the **cloud mark** (expressive, photographic). Official vectors inlined from the deliverable: `src/components/BrandIcon.tsx` (`BrandSymbol`) and `src/components/Wordmark.tsx` (horizontal lockup). Originals stashed in `public/brand/official/*.svg`. The old pilcrow ¶ identity is fully removed.
- **Voice:** "Stop typing." · confident, not loud · **no exclamation marks** · banned words: AI-powered, magical, seamless, revolutionary, leverage, unlock. Approved: Speak/Speech, Instant, Polished, Anywhere/Any app, You.

---

## Current architecture — full-page sky + liquid glass

The page is **one fixed sky** with **frosted "liquid glass" panels** floating over it.

- **`.app-sky`** (`src/design/globals.css`) — `position: fixed` full-viewport sky photo (`/brand/sky/hero.webp`). **Intentionally static** (no animation): scrolling the glass panels over the fixed sky IS the parallax, and a static backdrop avoids constant `backdrop-filter` re-blur (the previous jank source).
- **`.glass` / `.glass-blue`** — frosted panels with edge refraction (inset highlight, 1px light border, sky-tinted shadow, `backdrop-filter: blur(16px)`, `translateZ(0)`). `.glass-blue` is the Pocket-Blue brand moment (re-maps ink tokens to paper).
- Section order (`src/App.tsx`): `Hero → Speak → MicDemo → Differentiators → AnywhereYouType → SpeedProof → FromPocket → Footer`. Each content section is a glass panel (`.rail > .glass.reveal`). FromPocket = `.glass-blue`. AnywhereYouType = glass header + a full-bleed marquee of solid (non-blur) cards.
- **Motion:**
  - **Hero entrance + cloud-icon float = CSS** (`.hero-rise`, `.hero-mark` keyframes) → the fold is always visible, never rAF-dependent.
  - **Panel reveals = GSAP one-shot** fade-up (`.reveal`), wired once in `App.tsx` via `gsap.context` + `matchMedia`. **No `scrub`** anywhere (that was the jank).
  - `prefers-reduced-motion` disables motion (GSAP `matchMedia` + a CSS guard).
  - `React.StrictMode` is **intentionally removed** in `src/main.tsx` (its dev double-invoke breaks GSAP `fromTo`).
- Typewriter effect: `src/hooks/useTypeIn.ts` + `useInViewOnce.ts` (IntersectionObserver) — used in Speak, MicDemo, Differentiators, AnywhereYouType.

### File map
- `src/design/` — `tokens.css`, `globals.css` (sky + glass + keyframes + base), `fonts.css`, `responsive.css` (all `@media` live here; breakpoints 900/768/480).
- `src/lib/gsap.ts` — registers ScrollTrigger.
- `src/components/` — `BrandIcon`(`BrandSymbol`/`BrandIcon`), `Wordmark`, `Nav`, `InstallButton` (Blue+Paper CTA, `inverted` variant, `:active` scale), `Caret`, `Heading` (h1–3 Erode / h4 Satoshi), `Paragraph`, `Microcopy`, `Prose`, `TranscriptionDisplay`, `PhoneFan` (`HeroPhones`/`ThreePhoneFan` — CSS-3D iPhone mockups with on-screen UI: Splash / RecorderLive / Transcript).
- `src/sections/` — `Hero`, `Speak` (typewriter + PhoneFan), `MicDemo` (live Web Speech demo), `Differentiators` (3 proof points), `AnywhereYouType` (surface→output marquee), `SpeedProof` (latency bar chart, Pocket Voice bar in blue), `FromPocket` (pricing + CTA), `Footer`.
- `public/brand/`: `sky/hero.webp` (in use), `sky/clouds.webp` (**now unused** — was the deleted SkyBand), `cloud-mark.png` (hero icon), `cloud-sky.png` (OG image), `official/*.svg`. `public/icon.svg` + `public/logo.svg` = official mark/lockup.

### Conventions (keep these)
- All inline styles via `var(--…)` tokens — never hardcode hex.
- New `@media` only in `responsive.css`.
- Headings inherit Erode via global `h1,h2,h3` rule; body is Satoshi.
- No emojis as icons; SVG only. No pilcrow ¶.
- Glass panels: avoid card-in-card (flatten inner boxes to dividers).

---

## NEXT STEP 1 — Typography pass

Goal: make the type feel intentional and premium, true to Manual v6. Wait for the user's references, then:

- **Honour the manual scale** (1.333): 88pt **Erode Light** for the hero display, 56 / 32 Erode Regular for H2/H3, 20 Satoshi Medium lead, 15 Satoshi Regular body, 11 Satoshi Medium uppercase labels. Currently `--step-*` is a fluid 1.333 scale in `tokens.css`; verify the big display uses **Erode Light (300)** not Regular, and that weights match the manual.
- **Levers:** `tokens.css` (`--step-*`), `globals.css` (`h1,h2,h3` tracking/weight), `Heading.tsx`, and per-section inline `fontSize/lineHeight/letterSpacing`.
- **Refine:** line-heights (tighter on display, looser on light-on-dark), tracking (negative on big Erode), measure (`max-width` ~65–75ch on body), the italic Erode accent word in blue (used in hero kicker + Speak/SpeedProof line 2), and consistent eyebrow/label styling (currently a small Satoshi uppercase with a 2ch rule — unify into one `<Eyebrow>` if it recurs across sections).
- **OpenType:** consider enabling Erode/Satoshi features (ligatures, oldstyle vs lining numerals — currently `tabular-nums` on metrics). Check `reference/typography.md` in the impeccable skill.
- Don't introduce new fonts. Erode + Satoshi only.

## NEXT STEP 2 — Product screens / screenshots throughout

Goal: show the actual app along the page. Wait for the user's reference shots, then:

- **Existing material to consider:** real UI screenshots exist at `…/Marca/Entregables/Ads/Esbossos/screenshot_*.png` (`think_out_loud`, `every_app`, `it_edits`, `sounds_like`, `hold_speak`). The brand ad comps (`…/Ads/Screenshots/Ads-0{1..4}.png`) show the intended "screen-in-sky" treatment.
- **Where screens can live:** Hero/Speak already use the `PhoneFan` CSS mockups — these could be swapped for real screenshots inside the device frames (`PhoneFan.tsx` renders `<PhoneFrame>` with a 390×844 screen; drop an `<img>` in place of the CSS screen). MicDemo (live demo), AnywhereYouType cards (already show transform text — could pair with mini screens), and a possible new gallery/feature section are candidates.
- **Asset pipeline:** put optimized screens in `public/brand/screens/` as WebP (use PIL/`sips`; target ~1400px wide, q80). Frame them in device chrome or in glass panels per the references.
- **Keep performance:** lazy-load below-the-fold images (`loading="lazy"`, `decoding="async"`); don't stack many `backdrop-filter` panels over large moving images.

---

## Known follow-ups / watch-outs
- **`clouds.webp` is unused** (SkyBand was removed) — repurpose or delete.
- **`.brand-moment` CSS** in `globals.css` is now unused (FromPocket uses `.glass-blue`) — safe to remove.
- **Framer Motion still used** by `Nav` (scroll state), `AnywhereYouType` (marquee), `MicDemo` (AnimatePresence), `SpeedProof` (bar fill). GSAP handles panel reveals. Both libs ship (~bundle 428 KB / 145 KB gzip). Optional: migrate the marquee/bar to CSS or GSAP and drop framer-motion.
- **`backdrop-filter` perf:** smooth on desktop with the static sky, but if a device stutters, the fallback is solid translucent panels (`rgba(255,255,255,0.7)`, no blur) — same look, zero blur cost.
- **Memory:** `~/.claude/projects/-Users-arnau-WEBS-Pocket-Voice/memory/` describes the *old* dark/pilcrow brand — outdated; update if relevant. The Borna migration plan (`misty-munching-sparkle.md`) is obsolete (brand is Erode + Satoshi).

## Verify before shipping
`npm run build` clean → open in a **real browser** → check: Erode/Satoshi load, hero fold visible, glass panels reveal on scroll without jank, no ¶, no exclamation marks, responsive at 375/768/1280, no console errors.
