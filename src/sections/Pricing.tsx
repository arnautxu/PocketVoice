import { InstallButton } from '../components/InstallButton';
import { usePlatform } from '../hooks/usePlatform';
import { COMPANY_JOBS } from '../config/links';

/* ══════════════════════════════════════════════════════════════════════════════
 * PRICING — three plans on the ground (alt-light). Free first, Pro featured (the
 * brand-blue card), Team last. CTAs are platform-aware downloads; Team routes to a
 * contact link.
 * ════════════════════════════════════════════════════════════════════════════ */

interface Plan {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  feats: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    blurb: 'Everything you need to start typing out loud.',
    feats: ['30 minutes of voice a day', '3 languages', 'Every app on iPhone & Mac', 'Standard speed'],
    cta: 'Download free',
  },
  {
    name: 'Pro',
    price: '$8',
    unit: '/ month',
    blurb: 'Unlimited voice, every language, priority speed.',
    feats: ['Unlimited daily use', 'All 108 languages', 'Priority composition (~180 ms)', 'Custom vocabulary', 'Tone & register control'],
    cta: 'Start Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: 'Custom',
    blurb: 'Pro for everyone, with shared vocabulary and admin.',
    feats: ['Everything in Pro', 'Shared team vocabulary', 'Centralised billing & admin', 'SSO & priority support'],
    cta: 'Contact us',
  },
];

export function Pricing() {
  const { storeHref } = usePlatform();

  return (
    <section id="pricing" className="sec alt-light">
      <div className="rail" style={{ display: 'grid', gap: 'clamp(2rem, 5vh, 3.5rem)' }}>
        <header style={{ display: 'grid', gap: '1.25rem', maxWidth: '40rem' }}>
          <span className="sec-eyebrow">Pricing</span>
          <h2 style={{ margin: 0, fontSize: 'var(--step-4)', lineHeight: 1.02, color: 'var(--ink-0)' }}>
            Start free. <span style={{ color: 'var(--blue-deep)', fontStyle: 'italic' }}>Upgrade when you’re hooked.</span>
          </h2>
        </header>

        <div className="pricing-grid">
          {PLANS.map((p) => {
            const href = p.name === 'Team' ? COMPANY_JOBS : storeHref;
            const external = p.name === 'Team';
            return (
              <article key={p.name} className={`price-card reveal${p.featured ? ' is-featured' : ''}`}>
                {p.featured && <span className="price-badge">Most popular</span>}
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <span className="price-name">{p.name}</span>
                  <span className="price-amt"><b>{p.price}</b>{p.unit && <span>{p.unit}</span>}</span>
                  <p style={{ margin: 0, fontSize: 'var(--step-0)', color: 'var(--ink-1)', lineHeight: 1.45 }}>{p.blurb}</p>
                </div>

                <ul className="price-feats">
                  {p.feats.map((f) => (
                    <li key={f}><CheckIcon />{f}</li>
                  ))}
                </ul>

                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="pv-cta"
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      padding: '0.8ch 2ch',
                      borderRadius: '0.6ch',
                      fontWeight: 600,
                      fontSize: 'var(--step-0)',
                      background: 'transparent',
                      color: 'var(--ink-0)',
                      border: '1px solid rgba(11,24,41,0.18)',
                    }}
                  >
                    {p.cta}
                  </a>
                ) : (
                  <InstallButton
                    size="lg"
                    label={p.cta}
                    href={href}
                    inverted={p.featured}
                    style={{ width: '100%', justifyContent: 'center' }}
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
