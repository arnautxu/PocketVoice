# Pocket Voice — Brand & Product Source of Truth

> Authored from the Project Discovery Brief (May 2026, Open Vision Engineering Inc.).
> This file is read by every design pass. Edit deliberately.

## Register

`brand` — design IS the product. The launch site is the first public surface of Pocket Voice and must carry the entire brand promise on its own.

## What it is

Pocket Voice turns speech into perfectly written text — anywhere you type, in any language, instantly. iOS first; Mac and Android later. **Standalone**: no Pocket device required. The software expression of Pocket's philosophy: technology that disappears.

## The promise (the thing that has to feel true on the site)

> You speak naturally — rambling, pausing, changing your mind — and perfectly polished text appears before you've even finished your thought. No corrections. No cleanup. It just works.

The site does not say "effortless." The site **feels** effortless.

## Users

Professionals and creators who type for hours every day. They already optimize their tools (Raycast, Notion, Linear). They value speed, craft, and things that work without configuration. Writers, developers, executives, students, founders. Pocket-device owners are early evangelists; the addressable market is much broader.

## Voice & tone

Confident, sharp, direct. Like a brilliant colleague who finishes your sentences — not because they're showing off, but because they genuinely understand what you mean. Zero fluff. No exclamation marks. No em dashes. No emojis.

## Positioning

Sub-brand of Pocket. Connected DNA, evolved expression — Apple Watch to Apple. Defines the visual lane for voice-to-text for the next decade.

## Anti-references (what NOT to look or sound like)

- **Wispr Flow** — green/white/friendly is theirs. We don't visit that lane.
- **Generic AI startups** — purple gradients, sparkle emojis, "powered by AI" badges, robot icons.
- **Dragon NaturallySpeaking** — legacy, clinical, enterprise.

## Off-limits visuals

- Green as a brand color
- Purple gradients
- Microphone icon as the primary mark (too literal, too common)
- "Powered by AI" badges
- Sparkles, robots, generic AI iconography
- Pure `#000` and pure `#fff` (tinted neutrals only)
- Inter as a display face
- 3-up icon-heading-text feature card grids
- Centered hero with dark image overlay
- Lucide icon set
- shadcn/ui in default state

## Brand axes (locked)

| Scale | Position |
|---|---|
| Minimal ↔ Expressive | Minimal (1/5) |
| Warm ↔ Cold/technical | Balanced (3/5) |
| Serious ↔ Playful | Mostly serious (2/5) |
| Premium ↔ Mass | Premium (1/5) |
| Conservative ↔ Bold | Bold (4/5) |

## Visual references

Linear (speed as identity), Raycast (premium productivity), Vercel (technical sophistication), Nothing (bold material distinctiveness), Arc Browser (reinventing a boring category through brand).

## Color system (Restrained strategy)

OKLCH only. No `#000`, no `#fff`. All neutrals tinted toward the brand hue.

| Token | OKLCH | Use |
|---|---|---|
| `--surface-0` | `oklch(0.14 0.005 270)` | Primary background |
| `--surface-1` | `oklch(0.18 0.006 270)` | Elevated surface |
| `--surface-2` | `oklch(0.22 0.007 270)` | Inputs, separators |
| `--ink-0` | `oklch(0.97 0.005 270)` | Primary text |
| `--ink-1` | `oklch(0.78 0.005 270)` | Secondary text |
| `--ink-2` | `oklch(0.55 0.005 270)` | Tertiary, captions |
| `--accent` | `oklch(0.72 0.18 250)` | Electric blue. ≤10% of surface. |
| `--accent-soft` | `oklch(0.72 0.18 250 / 0.18)` | Glows, focus rings |

## Typography

- Display + body: **Geist** (variable, MIT)
- Mono: **Geist Mono**
- Display tracking: `-0.03em`. Body tracking: `0`.
- Hierarchy contrast ratio: ≥1.5 between steps.
- Body cap: 65–72ch. Body leading: 1.55.

## Motion language

Motion is a brand element, not decoration. Custom curves only.

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);   /* UI feedback */
--ease-io:  cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1); /* iOS-like surfaces */
```

Durations: 100–200ms interactive, 400–800ms narrative, never >300ms on rapid actions. Animate `transform` and `opacity` only.

## The signature object

A liquid-metal morphing mesh as the hero scene. Custom shader, dark reflective material, scroll-driven uniforms. Non-figurative — never a microphone, never a soundwave. Reference: Apple Vision Pro material studies, Nothing transparent renders. Static AVIF poster as fallback for first paint.

## The launch IA

1. Hero — headline + sub + App Store CTA + signature scene.
2. Magic moment — scripted reenactment of "speak → polished text" with real audio + real transcript timing.
3. Differentiators — speed, multilingual, context-aware. Sticky scroll-stack, not card grid.
4. Anywhere you type — kinetic marquee of in-context vignettes.
5. Speed proof — honest monospaced timing comparison.
6. From Pocket — sub-brand reveal.
7. Footer — minimal.

## The AI-slop test

If a stranger could guess "voice-to-text" from the visuals alone without reading copy, push the visual identity further from the category cliché.
