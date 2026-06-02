import ReactDOM from 'react-dom/client';
import App from './App';
import './design/fonts.css';
import './design/globals.css';
import './design/responsive.css';

// Note: React.StrictMode is intentionally omitted - its dev-only double-invocation
// of effects breaks GSAP's imperative fromTo/ScrollTrigger setup (tweens get stuck
// at their from-state). Standard practice for GSAP-driven React apps.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
