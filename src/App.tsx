import { Nav } from './components/Nav';
import { AnywhereYouType } from './sections/AnywhereYouType';
import { Differentiators } from './sections/Differentiators';
import { Footer } from './sections/Footer';
import { FromPocket } from './sections/FromPocket';
import { Hero } from './sections/Hero';
import { MicDemo } from './sections/MicDemo';
import { SpeedProof } from './sections/SpeedProof';
import PocketVoiceStoryPair3D from './scene/PocketVoiceStoryPair3D';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div style={{ height: '100vh', background: '#0A0A0A' }}>
          <PocketVoiceStoryPair3D />
        </div>
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
