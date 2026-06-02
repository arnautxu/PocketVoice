import { useLayoutEffect } from 'react';
import { gsap } from './lib/gsap';
import { FloatingIslandNav } from './components/FloatingIslandNav';
import { SkyBackground } from './components/SkyBackground';

const NAV_LINKS = [
  { name: 'How it works', href: '#speak' },
  { name: 'Different', href: '#different' },
  { name: 'Anywhere', href: '#anywhere' },
  { name: 'Speed', href: '#speed' },
];
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
      <SkyBackground />
      <FloatingIslandNav items={NAV_LINKS} className="fixed top-5 left-1/2 -translate-x-1/2 z-50" />
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
