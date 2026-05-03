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
            gap: '0.65rem',
            padding: '0.4rem 0.95rem 0.4rem 0.55rem',
            border: '1px solid var(--hairline)',
            borderRadius: '999px',
            color: 'var(--ink-1)',
            fontSize: 'calc(var(--step--1) * 0.95)',
            letterSpacing: '0.02em',
            background: 'oklch(0.155 0.007 264 / 0.55)',
            backdropFilter: 'blur(14px)',
            marginBottom: '2.5rem',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'relative',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: 'var(--accent)',
              boxShadow: '0 0 14px var(--accent-glow)',
            }}
          />
          A new app from <span style={{ color: 'var(--ink-0)' }}>Pocket</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.18 }}
          style={{
            fontSize: 'var(--step-5)',
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
            fontWeight: 400,
            margin: 0,
            maxWidth: '14ch',
          }}
        >
          Speak.
          <br />
          <span style={{ color: 'var(--ink-1)' }}>It reads like you wrote it.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.34 }}
          style={{
            color: 'var(--ink-1)',
            maxWidth: '42ch',
            fontSize: 'var(--step-1)',
            lineHeight: 1.45,
            letterSpacing: '-0.012em',
            fontWeight: 380,
            marginTop: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          Voice‑to‑text that understands the surface you’re writing in and
          composes the sentence you would have typed. Any app. Any language.
          Instantly.
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
              letterSpacing: '-0.005em',
              transition: 'color var(--t-quick) var(--ease-out)',
            }}
          >
            Watch a demo
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
          <span>iPhone</span>
          <span style={{ color: 'var(--hairline-strong)' }}>—</span>
          <span>108 languages</span>
          <span style={{ color: 'var(--hairline-strong)' }}>—</span>
          <span>On‑device, private</span>
        </motion.div>
      </div>
    </section>
  );
}
