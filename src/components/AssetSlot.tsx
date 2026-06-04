import type { CSSProperties } from 'react';

interface AssetSlotProps {
  /** What real asset belongs here (shown as the slot caption). */
  label: string;
  /** Aspect ratio, e.g. '390 / 844' or '16 / 10'. */
  ratio?: string;
  /** Optional dimension / format note under the label. */
  note?: string;
  style?: CSSProperties;
  className?: string;
}

/**
 * Provisional, swappable placeholder for product imagery (screenshots, device
 * mockups, app UI). Deliberately reads as a slot — correct aspect ratio, a clear
 * label of what goes here — so the layout is built around the real asset before it
 * exists. Replace with the supplied image; the dimensions are already correct.
 */
export function AssetSlot({ label, ratio = '16 / 10', note, style, className }: AssetSlotProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label={`Placeholder — ${label}${note ? `, ${note}` : ''}`}
      style={{
        position: 'relative',
        aspectRatio: ratio,
        width: '100%',
        background: 'var(--paper-deep)',
        border: '1px solid var(--rule-strong)',
        borderRadius: 4,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* faint diagonal hatch so it never reads as a finished surface */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0 13px, var(--paper-edge) 13px 14px)',
          opacity: 0.7,
        }}
      />
      {/* corner tag */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          padding: '0.5ch 1ch',
          background: 'var(--ink-0)',
          color: 'var(--paper)',
          fontSize: 'calc(var(--step--1) * 0.86)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        asset
      </span>
      {/* centered description */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4ch',
          padding: '1.5ch',
          textAlign: 'center',
        }}
      >
        <span style={{ color: 'var(--ink-1)', fontSize: 'var(--step-0)', fontWeight: 500 }}>
          {label}
        </span>
        {note && (
          <span
            className="tabular"
            style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)', letterSpacing: '0.04em' }}
          >
            {note}
          </span>
        )}
      </span>
    </div>
  );
}
