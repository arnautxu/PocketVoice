import { InstallButton } from '../components/InstallButton';
import { usePlatform } from '../hooks/usePlatform';

/* ══════════════════════════════════════════════════════════════════════════════
 * FINAL CTA — the climax. The one big button that actually takes you to the App
 * Store. Platform-aware label + href.
 * ════════════════════════════════════════════════════════════════════════════ */

export function FinalCTA() {
  const { storeHref, downloadLabel } = usePlatform();

  return (
    <section className="sec alt-dark">
      <div className="rail final-cta">
        <h2 className="reveal">
          Stop typing.<br />
          <span style={{ color: '#A9D9F2', fontStyle: 'italic' }}>Start listening.</span>
        </h2>
        <p style={{ margin: 0, maxWidth: '40ch', fontSize: 'var(--step-1)', lineHeight: 1.5, color: 'var(--ink-1)' }}>
          Press once and talk. Your fastest keyboard is the one you already carry everywhere.
        </p>
        <InstallButton size="lg" label={downloadLabel} href={storeHref} />
        <span className="hero-cta-note" style={{ color: 'var(--ink-2)' }}>Free to start · iPhone &amp; Mac</span>
      </div>
    </section>
  );
}
