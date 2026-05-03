import { motion } from 'framer-motion';
import { InstallButton } from '../components/InstallButton';

export function FromPocket() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(8rem, 16vh, 14rem) 0',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-20% -10% auto auto',
          width: 'min(80vw, 800px)',
          aspectRatio: '1',
          background:
            'radial-gradient(closest-side, var(--accent-soft), transparent 70%)',
          filter: 'blur(48px)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <div
        className="rail"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(2.5rem, 6vw, 5rem)',
          alignItems: 'end',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <Eyebrow>From Pocket</Eyebrow>
          <h2
            style={{
              margin: '1.25rem 0 1.5rem',
              fontSize: 'var(--step-4)',
              letterSpacing: '-0.045em',
              lineHeight: 1.0,
              fontWeight: 400,
              maxWidth: '14ch',
            }}
          >
            Technology that
            <br />
            <span style={{ color: 'var(--ink-1)' }}>disappears.</span>
          </h2>
          <p
            style={{
              color: 'var(--ink-1)',
              maxWidth: '44ch',
              fontSize: 'var(--step-1)',
              lineHeight: 1.45,
              letterSpacing: '-0.012em',
              fontWeight: 380,
              margin: 0,
            }}
          >
            Pocket Voice is the software expression of Pocket’s philosophy.
            The same belief that shaped the hardware now lives in something
            you already carry. Press once. Speak. The interface gets out of
            the way.
          </p>
          <div style={{ marginTop: '2.25rem' }}>
            <InstallButton />
          </div>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
          style={{
            margin: 0,
            position: 'relative',
            aspectRatio: '4 / 5',
            borderRadius: 32,
            border: '1px solid var(--hairline)',
            background:
              'radial-gradient(120% 80% at 30% 20%, oklch(0.22 0.01 270) 0%, oklch(0.12 0.005 270) 70%)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-soft)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Stylised "pocket" — concentric apertures, brand DNA only */}
          <svg
            width="60%"
            height="60%"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden
            style={{ display: 'block' }}
          >
            <defs>
              <radialGradient id="pv-grad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.72 0.18 250)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="oklch(0.72 0.18 250)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="92" stroke="oklch(0.97 0.005 270 / 0.18)" />
            <circle cx="100" cy="100" r="68" stroke="oklch(0.97 0.005 270 / 0.32)" />
            <circle cx="100" cy="100" r="44" stroke="oklch(0.97 0.005 270 / 0.55)" />
            <circle cx="100" cy="100" r="20" fill="url(#pv-grad)" />
            <circle cx="100" cy="100" r="10" fill="oklch(0.97 0.005 270)" />
          </svg>
          <figcaption
            style={{
              position: 'absolute',
              left: '1.5rem',
              bottom: '1.25rem',
              right: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'var(--ink-2)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--step--1)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <span>Open Vision Engineering</span>
            <span>·</span>
            <span>Est. Pocket</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        color: 'var(--ink-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--step--1)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden style={{ display: 'inline-block', width: 14, height: 1, background: 'var(--ink-2)' }} />
      {children}
    </span>
  );
}
