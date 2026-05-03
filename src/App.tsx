import { Nav } from './components/Nav';
import { AnywhereYouType } from './sections/AnywhereYouType';
import { Differentiators } from './sections/Differentiators';
import { Footer } from './sections/Footer';
import { FromPocket } from './sections/FromPocket';
import { Hero } from './sections/Hero';
import { MagicMoment } from './sections/MagicMoment';
import { SpeedProof } from './sections/SpeedProof';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MagicMoment />
        <Differentiators />
        <AnywhereYouType />
        <SpeedProof />
        <FromPocket />
      </main>
      <Footer />

      <style>{`
        @keyframes pv-pulse {
          0%   { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pv-caret {
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
