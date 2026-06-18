# Pocket Voice — Launch Site

Marketing site for **Pocket Voice**, an iOS dictation keyboard. React + Vite + TypeScript
port of the static `PocketVoice Website` design (1:1 in layout, copy, and motion).

## Stack

- Vite + React 18 + TypeScript
- Plain CSS, single stylesheet (`src/styles.css`) — design source of truth
- Erode (display serif) + Satoshi (sans) via Fontshare (`index.html`)
- WebGPU animated cloud sky, IntersectionObserver-driven typewriter/morph demos

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit + production build
npm run preview  # serve the build
```

## Structure

```
index.html          font links, meta, #root mount
src/
├─ main.tsx         mounts <App>, imports styles.css
├─ App.tsx          the full single-page layout (all sections, in JSX)
├─ styles.css       all styling (ported verbatim from the static site)
└─ effects/         DOM-driven animations, run from App's useEffect:
   ├─ clouds.ts            WebGPU cloud sky (#webgpuClouds canvas)
   ├─ demoTyping.ts        demo card, tones, snippets, speed, speak-morph
   ├─ audienceCarousel.ts  prev/next audience cards
   └─ navMenu.ts           mobile nav toggle
public/assets/      all SVG/PNG assets, served at /assets/*
```

## Notes

- `App.tsx` renders the static markup; the `effects/*` modules then animate it by
  querying the rendered DOM (the same approach the original static site used). The
  app has no React state, so React never re-renders those nodes — manual DOM
  mutation inside them is safe.
- `prefers-reduced-motion` is respected throughout (static fallbacks in the effects).
- The cloud sky degrades gracefully (blue background) when WebGPU is unavailable.
