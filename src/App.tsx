import { useLayoutEffect } from 'react';
import { gsap } from './lib/gsap';
import { Nav } from './components/Nav';
import { AnywhereYouType } from './sections/AnywhereYouType';
import { Differentiators } from './sections/Differentiators';
import { Footer } from './sections/Footer';
import { FromPocket } from './sections/FromPocket';
import { Hero } from './sections/Hero';
import { MicDemo } from './sections/MicDemo';
import { Speak } from './sections/Speak';
import { SpeedProof } from './sections/SpeedProof';

export default function App() {
  // One-shot reveal for glass panels as they enter (no scrub → no per-frame churn).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%' },
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
        <Hero />
        <Speak />
        <MicDemo />
        <Differentiators />
        <AnywhereYouType />
        <SpeedProof />
        <FromPocket />
      </main>
      <Footer />
    </>
  );
}
