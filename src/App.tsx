import { useLayoutEffect } from 'react';
import { gsap } from './lib/gsap';
import { Nav } from './components/Nav';
import { AmbientClouds } from './components/AmbientClouds';
import { CookieBanner } from './components/CookieBanner';
import { MobileGetBanner } from './components/MobileGetBanner';
import { Hero } from './sections/Hero';
import { AllInOne } from './sections/AllInOne';
import { SocialProof } from './sections/SocialProof';
import { Features } from './sections/Features';
import { MadeForEveryone } from './sections/MadeForEveryone';
import { Pricing } from './sections/Pricing';
import { FinalCTA } from './sections/FinalCTA';
import { Footer } from './sections/Footer';

export default function App() {
  // One-shot reveal for sections as they enter (no scrub → no per-frame churn).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Transform-only: content is never opacity/visibility-hidden, so it can
        // never be trapped if a trigger doesn't fire. The slide is enhancement.
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 28 },
            {
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%' },
            },
          );
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Nav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* the single continuous scene photo (clouds → sky → grass), behind it all */}
        <div className="page-scene" aria-hidden />

        {/* The landscape descent, anchored to the DOM in three pieces that meet at
            shared colors so the join is seamless at any width — and each zone holds
            ONE text register so the dark↔light flip lands on a zone boundary:
              · sky zone     — luminous cloud sky, the Hero            (DARK text)
              · surface zone — pale blue deepening down, the body      (DARK text)
              · ground zone  — Blue Deep settling into Pocket-Black terra,
                               pricing → final CTA → footer            (LIGHT text) */}
        <div className="sky-zone">
          <Hero />
        </div>
        <div className="surface-zone">
          <AmbientClouds />
          <AllInOne />
          <SocialProof />
          <Features />
          <MadeForEveryone />
        </div>
        <div className="ground-zone">
          <Pricing />
          <FinalCTA />
          <Footer />
        </div>
      </main>
      <MobileGetBanner />
      <CookieBanner />
    </>
  );
}
