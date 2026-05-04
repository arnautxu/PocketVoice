import { Nav } from './components/Nav';
import { AnywhereYouType } from './sections/AnywhereYouType';
import { Differentiators } from './sections/Differentiators';
import { Footer } from './sections/Footer';
import { FromPocket } from './sections/FromPocket';
import { Hero } from './sections/Hero';
import { MicDemo } from './sections/MicDemo';
import { SpeedProof } from './sections/SpeedProof';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
