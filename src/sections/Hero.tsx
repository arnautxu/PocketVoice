import { motion } from 'framer-motion';
import { InstallButton } from '../components/InstallButton';
import { HeroScene } from '../scene/HeroScene';

const ease = [0.23, 1, 0.32, 1];

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'grid',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroScene />

      <div
        className="rail"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'clamp(7rem, 14vh, 10rem)',
          paddingBottom: 'clamp(4rem, 12vh, 8rem)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.85rem',
            border: '1px solid var(--hairline)',
            borderRadius: '999px',
            color: 'var(--ink-1)',
            fontSize: 'var(--step--1)',
            background: 'oklch(0.16 0.005 270 / 0.5)',
            backdropFilter: 'blur(8px)',
            marginBottom: '2.25rem',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'var(--accent)',
              boxShadow: '0 0 12px var(--accent-glow)',
            }}
          />
          From Pocket. iOS first.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.18 }}
          style={{
            fontSize: 'var(--step-5)',
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            fontWeight: 500,
            margin: 0,
            maxWidth: '14ch',
          }}
        >
          Speak.
          <br />
          <span style={{ color: 'var(--ink-1)' }}>Polished text appears.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.34 }}
          style={{
            color: 'var(--ink-1)',
            maxWidth: '46ch',
            fontSize: 'var(--step-1)',
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            marginTop: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          Voice-to-text that understands what you're doing and writes the way
          you would have typed it. Anywhere you type, in any language,
          instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
        >
          <InstallButton />
          <a
            href="#magic"
            style={{
              color: 'var(--ink-1)',
              fontSize: 'var(--step-0)',
              borderBottom: '1px solid var(--hairline-strong)',
              paddingBottom: 2,
              transition: 'color var(--t-quick) var(--ease-out)',
            }}
          >
            See it in motion
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.9 }}
          style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: 'clamp(4rem, 10vh, 7rem)',
            color: 'var(--ink-2)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--step--1)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>iOS 17.4+</span>
          <span style={{ color: 'var(--hairline-strong)' }}>·</span>
          <span>108 languages</span>
          <span style={{ color: 'var(--hairline-strong)' }}>·</span>
          <span>On‑device first</span>
        </motion.div>
      </div>
    </section>
  );
}
