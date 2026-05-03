import { Wordmark } from '../components/Wordmark';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--hairline)',
        paddingBlock: '3rem 4rem',
        marginTop: '4rem',
      }}
    >
      <div
        className="rail"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Wordmark />
          <span style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)' }}>
            From Pocket — Open Vision Engineering Inc.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', color: 'var(--ink-1)' }}>
          <Group title="Product">
            <FootLink href="#magic">How it works</FootLink>
            <FootLink href="#different">Why it's different</FootLink>
            <FootLink href="#anywhere">Anywhere you type</FootLink>
            <FootLink href="#speed">Speed</FootLink>
          </Group>
          <Group title="Company">
            <FootLink href="https://pocket.computer">Pocket</FootLink>
            <FootLink href="mailto:hello@pocket.voice">Contact</FootLink>
            <FootLink href="/legal/privacy">Privacy</FootLink>
            <FootLink href="/legal/terms">Terms</FootLink>
          </Group>
          <Group title="Follow">
            <FootLink href="https://x.com/pocketvoice">X</FootLink>
            <FootLink href="https://github.com/arnautxu/PocketVoice">GitHub</FootLink>
          </Group>
        </div>
      </div>

      <div
        className="rail"
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <span>© {new Date().getFullYear()} Open Vision Engineering Inc.</span>
        <span>v0.1 · Designed for the next decade.</span>
      </div>
    </footer>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: '0.65rem' }}>
      <span
        style={{
          color: 'var(--ink-2)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </span>
      <div style={{ display: 'grid', gap: '0.4rem' }}>{children}</div>
    </div>
  );
}

function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        color: 'var(--ink-1)',
        fontSize: 'var(--step-0)',
        transition: 'color var(--t-quick) var(--ease-out)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-0)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-1)')}
    >
      {children}
    </a>
  );
}
