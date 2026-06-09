import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════════════════
 * INTERACTIVE PHONE — the "one app, everywhere you type" demo, made tappable. A CSS
 * iPhone (Dynamic Island, iOS status bar, titanium frame) runs Pocket Voice inside a
 * faithful re-creation of each app's UI: tap the mic → record (waveform) → compose →
 * the finished message lands in that app's native style (WhatsApp bubbles + ticks,
 * Slack avatar rows, a Mail compose sheet, a Notes page). The icons switch the app.
 * Auto-plays; tap re-runs. Reduced motion holds the finished state.
 * ════════════════════════════════════════════════════════════════════════════ */

type Skin = 'whatsapp' | 'slack' | 'mail' | 'notes';
type App = {
  id: string; name: string; skin: Skin; accent: string; icon: ReactNode; lightStatus: boolean;
  navTitle: string; navSub?: string;
  context?: { who?: string; initials?: string; text: string; time: string };
  composed: string;
  reply?: { who?: string; initials?: string; text: string; time: string };
  to?: string; subject?: string; noteTitle?: string; confirm?: string;
};

const APPS: App[] = [
  {
    id: 'whatsapp', name: 'WhatsApp', skin: 'whatsapp', accent: '#25D366', lightStatus: true, icon: <WhatsAppIcon />,
    navTitle: 'Sam', navSub: 'online',
    context: { text: 'Still on for 8?', time: '7:54 PM' },
    composed: 'Running 5 late — grab us a table?',
    reply: { text: 'Got it, corner booth 🍻', time: '7:55 PM' },
  },
  {
    id: 'slack', name: 'Slack', skin: 'slack', accent: '#4A154B', lightStatus: true, icon: <SlackIcon />,
    navTitle: 'eng-releases', navSub: 'Acme HQ',
    context: { who: 'Priya Nair', initials: 'PN', text: 'build’s green on staging ✅', time: '9:41 AM' },
    composed: 'Pushed the fix — could someone smoke-test before we deploy?',
    reply: { who: 'Dev Bot', initials: 'DB', text: 'On it ✅', time: '9:42 AM' },
  },
  {
    id: 'mail', name: 'Mail', skin: 'mail', accent: '#1F8AFF', lightStatus: false, icon: <MailIcon />,
    navTitle: 'New Message', to: 'Anna Reyes', subject: 'Re: Tomorrow’s deck',
    composed: 'Anna — loved the deck. Two thoughts on the pricing section when you get a sec.',
    confirm: 'Sent',
  },
  {
    id: 'notes', name: 'Notes', skin: 'notes', accent: '#FFC60B', lightStatus: false, icon: <NotesIcon />,
    navTitle: 'Notes', noteTitle: 'Idea',
    composed: 'Pocket, but for meetings — an automatic summary after each call.',
    confirm: 'Saved',
  },
];

type Phase = 'idle' | 'rec' | 'compose' | 'sent';
type State = { phase: Phase; showReply: boolean };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const BARS = ['0.4', '0.7', '0.5', '0.95', '0.6', '0.8', '0.45', '0.85', '0.55', '0.7', '0.5', '0.9', '0.6', '0.75', '0.5', '0.8'];

export function InteractivePhone() {
  const [appIdx, setAppIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [showReply, setShowReply] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const app = APPS[appIdx];

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const run = () => {
    clear();
    if (prefersReduced()) { setPhase('sent'); setShowReply(true); return; }
    setShowReply(false);
    setPhase('rec');
    at(1500, () => setPhase('compose'));
    at(1500 + 1150, () => setPhase('sent'));
    at(1500 + 1150 + 850, () => setShowReply(true));
  };

  useEffect(() => {
    clear();
    if (prefersReduced()) { setPhase('sent'); setShowReply(true); return clear; }
    setPhase('idle'); setShowReply(false);
    at(450, run);
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appIdx]);

  const s: State = { phase, showReply };
  const recording = phase === 'rec';

  return (
    <div className="iphone-wrap">
      <div className="iphone" style={{ ['--app-accent' as string]: app.accent }}>
        <div className={`iphone-screen ip-skin--${app.skin}${app.lightStatus ? ' ip-status-light' : ''}`}>
          <div className="ip-top">
            <div className="ip-statusbar" aria-hidden>
              <span className="ip-time">9:41</span>
              <span className="ip-status-icons"><SignalGlyph /><WifiGlyph /><BatteryGlyph /></span>
            </div>
            <Navbar app={app} />
          </div>

          <div className="ip-body" key={app.id}>
            <Body app={app} state={s} />
          </div>

          <Composer app={app} recording={recording} composing={phase === 'compose'} onMic={run} />

          <div className="ip-home" aria-hidden />
        </div>

        {/* real device frame (bezel, Dynamic Island, buttons, glass) on top */}
        <img className="iphone-frame-img" src="/brand/devices/iphone-frame.png" alt="" aria-hidden draggable={false} />
      </div>

      <div className="ip-switcher" role="tablist" aria-label="Try it in another app">
        {APPS.map((a, i) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={i === appIdx}
            aria-label={a.name}
            className={`ip-app ip-app--${a.skin}${i === appIdx ? ' is-on' : ''}`}
            onClick={() => setAppIdx(i)}
          >
            {a.icon}
          </button>
        ))}
      </div>
      <p className="ip-hint">Tap an app, then the mic — speak once, it composes for that surface.</p>
    </div>
  );
}

/* ── NAV BARS ─────────────────────────────────────────────────────────────── */
function Navbar({ app }: { app: App }) {
  if (app.skin === 'whatsapp') {
    return (
      <div className="ip-nav ip-nav--wa">
        <Chevron />
        <span className="ip-wa-ava">{(app.navTitle[0] || 'S')}</span>
        <span className="ip-nav__titles">
          <b>{app.navTitle}</b><span>{app.navSub}</span>
        </span>
        <span className="ip-nav__spacer" />
        <VideoGlyph /><PhoneGlyph />
      </div>
    );
  }
  if (app.skin === 'slack') {
    return (
      <div className="ip-nav ip-nav--slack">
        <Chevron />
        <span className="ip-nav__titles">
          <b># {app.navTitle}</b><span>{app.navSub}</span>
        </span>
        <span className="ip-nav__spacer" />
        <HeadphonesGlyph />
      </div>
    );
  }
  if (app.skin === 'mail') {
    return (
      <div className="ip-nav ip-nav--3">
        <span className="ip-nav__btn">Cancel</span>
        <b className="ip-nav__center">{app.navTitle}</b>
        <span className="ip-nav__btn ip-nav__btn--strong">Send</span>
      </div>
    );
  }
  // notes
  return (
    <div className="ip-nav ip-nav--3">
      <span className="ip-nav__btn"><Chevron /> Notes</span>
      <span className="ip-nav__center" />
      <span className="ip-nav__btn ip-nav__btn--strong">Done</span>
    </div>
  );
}

/* ── BODIES ───────────────────────────────────────────────────────────────── */
function Body({ app, state }: { app: App; state: State }) {
  const { phase, showReply } = state;
  const composing = phase === 'compose';
  const sent = phase === 'sent';

  if (app.skin === 'whatsapp') {
    return (
      <div className="ip-wa">
        <span className="ip-wa-day">TODAY</span>
        {app.context && (
          <div className="ip-wa-bubble ip-wa-bubble--in">{app.context.text}<i className="ip-wa-time">{app.context.time}</i></div>
        )}
        {composing && <div className="ip-wa-bubble ip-wa-bubble--out ip-typing"><span /><span /><span /></div>}
        {sent && (
          <div className="ip-wa-bubble ip-wa-bubble--out ip-pop">
            {app.composed}<i className="ip-wa-time">{app.reply?.time ?? ''} <Ticks /></i>
          </div>
        )}
        {sent && showReply && app.reply && (
          <div className="ip-wa-bubble ip-wa-bubble--in ip-pop">{app.reply.text}<i className="ip-wa-time">{app.reply.time}</i></div>
        )}
      </div>
    );
  }

  if (app.skin === 'slack') {
    return (
      <div className="ip-slack">
        {app.context && <SlackRow who={app.context.who!} initials={app.context.initials!} text={app.context.text} time={app.context.time} />}
        {composing && (
          <div className="ip-slack-row">
            <span className="ip-slack-ava" style={{ background: '#2EB67D' }}>You</span>
            <div className="ip-slack-body"><div className="ip-slack-head"><b>You</b></div><div className="ip-typing ip-typing--dark"><span /><span /><span /></div></div>
          </div>
        )}
        {sent && <SlackRow who="You" initials="You" text={app.composed} time="9:41 AM" accent="#2EB67D" pop />}
        {sent && showReply && app.reply && <SlackRow who={app.reply.who!} initials={app.reply.initials!} text={app.reply.text} time={app.reply.time} accent="#E01E5A" pop />}
      </div>
    );
  }

  if (app.skin === 'mail') {
    return (
      <div className="ip-mail">
        <div className="ip-mail-row"><span>To:</span> <b>{app.to}</b></div>
        <div className="ip-mail-row"><span>Subject:</span> <b>{app.subject}</b></div>
        <div className="ip-mail-bodytext">
          {sent ? <span className="ip-pop">{app.composed}</span> : composing ? <span className="ip-caret">▍</span> : <span className="ip-mail-ph">Tap the mic to dictate…</span>}
        </div>
        {sent && showReply && app.confirm && <div className="ip-toast ip-pop"><Ticks solid /> {app.confirm}</div>}
      </div>
    );
  }

  // notes
  return (
    <div className="ip-notes">
      <div className="ip-notes-title">{app.noteTitle}</div>
      <div className="ip-notes-meta">Today · {app.name}</div>
      <div className="ip-notes-bodytext">
        {sent ? <span className="ip-pop">{app.composed}</span> : composing ? <span className="ip-caret">▍</span> : <span className="ip-mail-ph">Tap the mic to dictate…</span>}
      </div>
      {sent && showReply && app.confirm && <div className="ip-toast ip-pop">✓ {app.confirm}</div>}
    </div>
  );
}

function SlackRow({ who, initials, text, time, accent = '#4A154B', pop }: { who: string; initials: string; text: string; time: string; accent?: string; pop?: boolean }) {
  return (
    <div className={`ip-slack-row${pop ? ' ip-pop' : ''}`}>
      <span className="ip-slack-ava" style={{ background: accent }}>{initials.slice(0, 2)}</span>
      <div className="ip-slack-body">
        <div className="ip-slack-head"><b>{who}</b><i>{time}</i></div>
        <div className="ip-slack-text">{text}</div>
      </div>
    </div>
  );
}

/* ── COMPOSER (bottom bar with the mic) ───────────────────────────────────── */
function Composer({ app, recording, composing, onMic }: { app: App; recording: boolean; composing: boolean; onMic: () => void }) {
  const chat = app.skin === 'whatsapp' || app.skin === 'slack';
  const placeholder = composing ? 'Composing…' : chat ? (app.skin === 'whatsapp' ? 'Message' : `Message # ${app.navTitle}`) : 'Dictate';
  return (
    <div className={`ip-composer ip-composer--${app.skin}${recording ? ' is-rec' : ''}`}>
      <div className="ip-field">
        {recording ? (
          <div className="ip-wave" aria-hidden>
            {BARS.map((h, i) => <span key={i} style={{ ['--h' as string]: h, animationDelay: `${i * 0.045}s` }} />)}
          </div>
        ) : (
          <span className="ip-field-ph">{placeholder}</span>
        )}
      </div>
      <button type="button" className={`ip-mic${recording ? ' is-rec' : ''}`} aria-label="Tap to talk" onClick={onMic}>
        <MicGlyph />
      </button>
    </div>
  );
}

/* ── small UI glyphs ──────────────────────────────────────────────────────── */
function Chevron() {
  return <svg className="ip-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>;
}
function Ticks({ solid }: { solid?: boolean }) {
  return <svg className="ip-ticks" viewBox="0 0 20 12" fill="none" stroke={solid ? 'currentColor' : '#34B7F1'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 7l3 3 6-7" /><path d="M8 10l1 .6 6-7" /></svg>;
}
function VideoGlyph() {
  return <svg className="ip-navicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="6" width="12" height="12" rx="2.5" /><path d="M15 10l6-3v10l-6-3" /></svg>;
}
function PhoneGlyph() {
  return <svg className="ip-navicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
}
function HeadphonesGlyph() {
  return <svg className="ip-navicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="7" rx="2" /><rect x="17" y="13" width="4" height="7" rx="2" /></svg>;
}
function MicGlyph() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
}

/* — app-switcher tile icons (white on the brand tile) — */
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.1-.8-2.6-1.1-4.2-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" /></svg>;
}
function SlackIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 14a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0v-5zM10 6a2 2 0 1 1 2 2h-2V6zm0 1a2 2 0 0 1 0 4H5a2 2 0 0 1 0-4h5zM18 10a2 2 0 1 1 2 2h-2v-2zm-1 0a2 2 0 0 1-4 0V5a2 2 0 0 1 4 0v5zM14 18a2 2 0 1 1-2-2h2v2zm0-1a2 2 0 0 1 0-4h5a2 2 0 0 1 0 4h-5z" /></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg>;
}
function NotesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h14v12l-4 4H5z" /><path d="M19 16h-4v4" /><path d="M8 9h8M8 13h5" /></svg>;
}

/* — iOS status-bar glyphs — */
function SignalGlyph() {
  return <svg viewBox="0 0 18 12" fill="currentColor" aria-hidden><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0.5" width="3" height="11.5" rx="1" /></svg>;
}
function WifiGlyph() {
  return <svg viewBox="0 0 18 13" fill="currentColor" aria-hidden><path d="M9 13l2.6-3.2a3.3 3.3 0 0 0-5.2 0L9 13z" /><path d="M9 3.2c2.6 0 5 1 6.8 2.7l1.5-1.9A12 12 0 0 0 9 .6 12 12 0 0 0 .7 4l1.5 1.9A9.6 9.6 0 0 1 9 3.2z" /><path d="M9 7.2c1.5 0 2.9.6 3.9 1.5l1.5-1.8A8 8 0 0 0 9 4.8 8 8 0 0 0 3.6 6.9l1.5 1.8A5.7 5.7 0 0 1 9 7.2z" /></svg>;
}
function BatteryGlyph() {
  return (
    <svg viewBox="0 0 28 13" fill="none" aria-hidden>
      <rect x="0.6" y="0.6" width="23" height="11.8" rx="3" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <rect x="2.2" y="2.2" width="17" height="8.6" rx="1.6" fill="currentColor" />
      <rect x="25" y="4" width="2.2" height="5" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
