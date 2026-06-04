import { useLayoutEffect } from 'react';
import { gsap } from './lib/gsap';
import { Nav } from './components/Nav';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Demo } from './sections/Demo';
import { Surface } from './sections/Surface';
import { Close } from './sections/Close';

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
        {/* The descent, anchored to the DOM: the sky zone (cloud-white type) holds
            dark through the live demo, then breaks through the warm horizon into the
            ground zone (graphite type). The two share --horizon-warm at the seam. */}
        <div className="sky-zone">
          <Hero />
          <Demo />
        </div>
        <div className="ground-zone">
          <Surface />
          <Close />
          <Footer />
        </div>
      </main>
    </>
  );
}
