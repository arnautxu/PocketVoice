# Pocket Voice — Launch Site

Sub-brand launch website for Pocket Voice. React + Three.js (react-three-fiber).

## Stack

- Vite + React 18 + TypeScript
- react-three-fiber + drei + custom shader (`src/scene/voiceShader.ts`)
- Framer Motion for UI choreography
- Tailwind CSS v4 + tokens layer (`src/design/tokens.css`)
- Geist + Geist Mono (variable, MIT)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the build
```

## Brand source of truth

See [`PRODUCT.md`](./PRODUCT.md). Every design pass reads it first.

## Structure

```
src/
├─ design/     OKLCH tokens, globals, Tailwind theme
├─ scene/      Three.js — isolated client component, custom shader
├─ sections/   Hero · MagicMoment · Differentiators · AnywhereYouType · SpeedProof · FromPocket · Footer
├─ components/ Nav, Wordmark, InstallButton
└─ hooks/      useReducedMotion, useInViewOnce
```

## Non-negotiables

- No `#000` / `#fff`. OKLCH only, neutrals tinted toward the brand hue.
- No microphone icon as the primary mark. No sparkles. No "powered by AI".
- No 3-up icon-heading-text feature card grid.
- One accent (electric blue) used ≤10% of surface.
- `prefers-reduced-motion` collapses motion to opacity-only transitions.
- Animate `transform` + `opacity` only.
