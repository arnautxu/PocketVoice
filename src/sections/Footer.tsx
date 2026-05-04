import { Wordmark } from '../components/Wordmark';

export function Footer() {
  return (
    <footer
      style={{
        paddingBlock: '4ch 5ch',
        marginTop: '4ch',
      }}
    >
      {/* Mono separator */}
      <div
        className="rail"
        aria-hidden="true"
        style={{
          color: 'var(--surface-3)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.1em',
          marginBottom: '3ch',
          userSelect: 'none',
        }}
      >
        {'─'.repeat(80)}
      </div>

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
        <div style={{ display: 'grid', gap: '1ch' }}>
          <Wordmark />
          <span style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)' }}>
            From Pocket — Open Vision Engineering Inc.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4ch', flexWrap: 'wrap', color: 'var(--ink-1)' }}>
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

      {/* Bottom bar */}
      <div
        className="rail"
        style={{
          marginTop: '3ch',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          flexWrap: 'wrap',
          gap: '1ch',
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
    <div style={{ display: 'grid', gap: '0.75ch' }}>
      <span
        style={{
          color: 'var(--ink-2)',
          fontSize: 'var(--step--1)',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </span>
      <div style={{ display: 'grid', gap: '0.5ch' }}>{children}</div>
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
        transition: 'color var(--t-micro) var(--ease)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-0)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-1)')}
    >
      {children}
    </a>
  );
}
