import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { initClouds } from './effects/clouds';
import { initDemos } from './effects/demoTyping';
import { initAudienceCarousel } from './effects/audienceCarousel';
import { initNavMenu } from './effects/navMenu';

const appPills = [
  { src: '/assets/gmail.svg', label: 'Gmail' },
  { src: '/assets/notion.svg', label: 'Notion' },
  { src: '/assets/slack.svg', label: 'Slack' },
  { src: '/assets/whatsapp.svg', label: 'WhatsApp' },
  { src: '/assets/teams.svg', label: 'Teams' },
  { src: '/assets/chatgpt.svg', label: 'ChatGPT' },
  { src: '/assets/claude.svg', label: 'Claude' },
  { src: '/assets/messenger.svg', label: 'Messenger' },
  { src: '/assets/signal.svg', label: 'Signal' },
  { src: '/assets/snapchat.svg', label: 'Snapchat' },
  { src: '/assets/telegram.svg', label: 'Telegram' },
];

const audiences = [
  ['Writers', 'First drafts at the speed of thought. Editing is easier than starting, and now you always start with something.'],
  ['Founders', 'Your day is conversations. The investor update, the recap, the intro: spoken in the gaps between them.'],
  ['Developers', 'Keep your hands on the keys for code. Speak everything around it, and OAuth lands spelled right.'],
  ['HR people', 'You write about people all day, and tone is the whole job. Say it once, choose how it reads.'],
  ['Sales', "Follow-ups die in the parking lot. Speak the recap walking out, and the deal moves while it's warm."],
  ['Support Teams', 'The hundredth answer, with the care of the first. Snippets carry the policy, you carry less typing.'],
  ['Executives', 'Your calendar leaves no room for composing. Speak the decision, and it arrives written like you had the time.'],
  ['Students', 'Ideas show up faster than you can type. Talk the argument through, and the draft writes itself.'],
  ['Healthcare workers', 'Notes between patients, not after hours. Speak it while it’s fresh, leave on time.'],
  ['Lawyers', "Billable thinking shouldn't wait on typing speed. This is dictation that punctuates."],
  ['Product Managers', "Your job is translating between people, and most of it is typed. Now it's spoken, and lands structured."],
  ['Recruiters', "Candidate notes after every call, outreach that doesn't sound like outreach. It reads natural because it started as you talking."],
];

const speakWord = ['s', 'p', 'e', 'a', 'k'];

export default function App() {
  useEffect(() => {
    const cleanups = [initNavMenu(), initClouds(), initDemos(), initAudienceCarousel()];
    return () => cleanups.forEach((fn) => fn && fn());
  }, []);

  return (
    <>
      <div className="site-bg" aria-hidden="true">
        <canvas className="site-bg-clouds" id="webgpuClouds" />
        <div className="site-bg-noise" />
      </div>

      <div className="page">
        <header className="nav">
          <div className="nav-left">
            <a className="logo" href="#" aria-label="Pocket Voice home">
              <img className="logo-icon" src="/assets/logo-mark-3.svg" alt="" />
              <img className="logo-pocket" src="/assets/logo-mark-2.svg" alt="" />
              <img className="logo-voice" src="/assets/logo-mark-1.svg" alt="Pocket Voice" />
            </a>
          </div>

          <nav className="nav-links" id="primaryNav" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#enterprise">Enterprise</a>
            <a className="nav-device-link" href="#device">Get the Pocket Device</a>
          </nav>

          <div className="nav-actions">
            <a className="btn btn-ghost" href="#device">Get the Pocket Device</a>
            <a className="btn btn-paper" href="#get-app">
              <img className="app-glyph" src="/assets/app-store-glyph.svg" alt="" />
              Get the app
            </a>
          </div>
          <button
            className="nav-menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="primaryNav"
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <main>
          {/* HERO */}
          <section className="hero" aria-label="Pocket Voice hero">
            <p className="eyebrow">
              <img className="eyebrow-flash" src="/assets/flash.svg" alt="" />
              An iOS keyboard built for dictation
            </p>

            <h1 className="hero-title">
              Type
              <br />
              Out Loud
            </h1>

            <p className="hero-tagline">
              You talk. It writes. Everything you'd have typed, without the typing — in <em>any</em>{' '}
              app, <em>any</em> language.
            </p>

            <a className="btn btn-paper btn-lg" href="#get-app">
              <img className="app-glyph" src="/assets/app-store-glyph.svg" alt="" />
              Start Speaking on iOS
            </a>
          </section>

          {/* DEMO CARD */}
          <section className="demo" aria-label="How it works">
            <div className="demo-frame">
              <svg
                className="demo-frame-wave"
                viewBox="0 0 750 428"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <filter id="demo-frame-wave-filter">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.16 0.18"
                    numOctaves={2}
                    seed={8}
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale={4}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  >
                    <animate
                      attributeName="scale"
                      values="3.5;7.5;4.8;8.4;3.8;6.6;4"
                      keyTimes="0;0.18;0.34;0.52;0.7;0.86;1"
                      dur="1.9s"
                      repeatCount="indefinite"
                    />
                  </feDisplacementMap>
                </filter>
                <rect
                  className="demo-frame-wave-rect"
                  x="8"
                  y="8"
                  width="734"
                  height="412"
                  rx="28"
                  ry="28"
                  filter="url(#demo-frame-wave-filter)"
                />
              </svg>
              <div className="demo-card">
                <div className="demo-row">
                  <div className="demo-head">
                    <span className="demo-label">You Speak</span>
                    <span className="mic-chip" aria-hidden="true">
                      <img className="mic-chip-icon" src="/assets/mic.svg" alt="" />
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                      <span className="kb-voice-bar" />
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                      <span className="kb-voice-bar" />
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                    </span>
                  </div>
                  <p className="demo-speech">
                    <s>so um</s>, can you move the standup to nine — <s>no, wait</s>, nine thirty,
                    and <s>uh</s>, ask Priya to share the doc before
                  </p>
                </div>

                <div className="demo-row demo-row--out">
                  <span className="demo-label">What Appears</span>
                  <p className="demo-output">
                    Can we move the standup to 9:30? Priya, please share the doc beforehand.
                    <span className="caret">|</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ANYWHERE */}
          <section className="anywhere" id="features">
            <div className="anywhere-copy">
              <h2>
                Anywhere you type<span className="caret-inline">|</span>, you can{' '}
                <span className="speak-morph">
                  <span className="speak-word" aria-label="speak.">
                    {speakWord.map((letter, i) => (
                      <span key={i} className="speak-letter" style={{ '--i': i } as CSSProperties}>
                        {letter}
                      </span>
                    ))}
                    <span
                      className="speak-letter speak-period"
                      style={{ '--i': 5 } as CSSProperties}
                    >
                      .
                    </span>
                  </span>
                  <span className="waveform" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </h2>
              <p>
                Mail, Notion, Slack, your code editor, that form you've been putting off. Pocket
                Voice works wherever your cursor blinks — no copy-paste, no switching apps. The text
                lands where you're already working.
              </p>
            </div>

            <div className="phone" aria-hidden="true">
              <img className="phone-shadows" src="/assets/phone-shadows.svg" alt="" />
              <div className="phone-screen">
                <div className="phone-app-carousel" aria-hidden="true">
                  <img className="phone-app-shot is-active" src="/assets/app-chatgpt-typing.png" alt="" />
                  <img className="phone-app-shot" src="/assets/app-slack-reply.png" alt="" />
                  <img className="phone-app-shot" src="/assets/app-messages-reply.png" alt="" />
                </div>
                <div className="kb" role="group" aria-label="Pocket Voice keyboard preview">
                  <div className="kb-bar">
                    <button className="kb-close" type="button" aria-label="Close keyboard">
                      <svg className="kb-symbol kb-symbol--close" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7.5 7.5 16.5 16.5M16.5 7.5 7.5 16.5" />
                      </svg>
                    </button>
                    <button className="kb-voice" type="button" aria-label="Recording">
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                      <span className="kb-voice-bar" />
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                      <span className="kb-voice-bar" />
                      <span className="kb-voice-bar kb-voice-bar--tall" />
                    </button>
                  </div>
                  <div className="kb-row">
                    {'qwertyuiop'.split('').map((k) => (
                      <button key={k} className="kb-key" type="button">
                        {k}
                      </button>
                    ))}
                  </div>
                  <div className="kb-row kb-row--mid">
                    {'asdfghjkl'.split('').map((k) => (
                      <button key={k} className="kb-key" type="button">
                        {k}
                      </button>
                    ))}
                  </div>
                  <div className="kb-row kb-row--low">
                    <button className="kb-key kb-wide kb-shift" type="button" aria-label="Shift">
                      <svg className="kb-symbol kb-symbol--shift" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 4.75 4.75 12.2h4.1v7.05h6.3V12.2h4.1L12 4.75Z" />
                      </svg>
                    </button>
                    <div className="kb-letter-cluster">
                      {'zxcvbnm'.split('').map((k) => (
                        <button key={k} className="kb-key" type="button">
                          {k}
                        </button>
                      ))}
                    </div>
                    <button className="kb-key kb-wide kb-delete" type="button" aria-label="Delete">
                      <svg className="kb-symbol kb-symbol--delete" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9.05 6.8h9.05c1.22 0 2.2.98 2.2 2.2v6c0 1.22-.98 2.2-2.2 2.2H9.05L3.85 12l5.2-5.2Z" />
                        <path d="m12.25 9.35 4.7 5.3M16.95 9.35l-4.7 5.3" />
                      </svg>
                    </button>
                  </div>
                  <div className="kb-row kb-row--bottom">
                    <button className="kb-key kb-sm" type="button">
                      123
                    </button>
                    <button className="kb-key kb-sm" type="button" aria-label="Emoji">
                      <img className="kb-key-ico" src="/assets/kb-emoji.svg" alt="" />
                    </button>
                    <button className="kb-key kb-space" type="button" aria-label="Space" />
                    <button className="kb-key kb-return" type="button" aria-label="Return">
                      <svg className="kb-symbol kb-symbol--return" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.7 6.35v5.35c0 2.05-1.2 3.25-3.25 3.25H6.05" />
                        <path d="m9.35 11.65-3.6 3.35 3.6 3.35" />
                      </svg>
                    </button>
                  </div>
                  <div className="kb-system-row" aria-hidden="true">
                    <span className="kb-globe">
                      <svg className="kb-symbol kb-symbol--globe" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="9.1" />
                        <path d="M3.25 12h17.5M12 2.9c2.1 2.15 3.15 5.18 3.15 9.1S14.1 18.95 12 21.1M12 2.9C9.9 5.05 8.85 8.08 8.85 12S9.9 18.95 12 21.1M5.75 6.35c1.67.92 3.75 1.38 6.25 1.38s4.58-.46 6.25-1.38M5.75 17.65c1.67-.92 3.75-1.38 6.25-1.38s4.58.46 6.25 1.38" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <img className="device-frame" src="/assets/device-frame.png" alt="" />
            </div>
          </section>

          {/* MARQUEE */}
          <section className="marquee" aria-label="Works in your favorite apps">
            <div className="marquee-track">
              {appPills.map((pill, i) => (
                <span className="app-pill" key={`a-${i}`}>
                  <span className="app-chip">
                    <img src={pill.src} alt="" />
                  </span>
                  {pill.label}
                </span>
              ))}
              {appPills.map((pill, i) => (
                <span className="app-pill" aria-hidden="true" key={`b-${i}`}>
                  <span className="app-chip">
                    <img src={pill.src} alt="" />
                  </span>
                  {pill.label}
                </span>
              ))}
            </div>
          </section>

          {/* FINISHING TOOLS */}
          <section className="finish" id="device" aria-labelledby="finish-title">
            <div className="section-intro section-intro--center">
              <h2 id="finish-title">
                <span>Think out loud.</span> Send it finished.
              </h2>
              <p>
                You think faster than you type. Say it the way it comes, unfinished and out of order,
                and get back finished writing. Tones, snippets, your own vocabulary: all tuned to how
                you work. Try them.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-panel feature-panel--wide">
                <div className="feature-copy">
                  <div className="feature-heading">
                    <p className="feature-kicker">Personal Dictionary</p>
                    <h3>Fluent in your world.</h3>
                  </div>
                  <p>
                    Every team speaks its own language. Pocket Voice learns yours as you go: the
                    tricky spellings, the product names, the jargon nobody else uses.
                  </p>
                </div>

                <div className="word-stack" aria-hidden="true">
                  <div className="word-stack-head">
                    <span>Your Words</span>
                    <span className="word-plus">+</span>
                  </div>
                  <span className="word-pill word-pill--tilt-left">Ajay</span>
                  <span className="word-pill">Josh</span>
                  <span className="word-pill word-pill--ghost word-pill--tilt-right js-dict-pill">
                    Yolo
                  </span>
                </div>
              </article>

              <article className="feature-panel">
                <div className="feature-top">
                  <p className="feature-kicker">Tones</p>
                  <h3>You decide how it reads.</h3>
                </div>
                <div className="feature-body">
                  <div className="message-shell">
                    <div
                      className="message-demo message-demo--glass js-tone-message"
                      data-type-text="Yeah, of course! Send it my way by tomorrow morning and I'll have plenty of time to look it over before the deadline."
                      data-type-speed="25"
                    >
                      Yeah, of course! Send it my way by tomorrow morning and I'll have plenty of
                      time to look it over before the deadline.<span className="caret">|</span>
                    </div>
                  </div>
                  <div className="tone-picker" aria-hidden="true">
                    <div className="tone-side">
                      <span className="tone-icon">
                        <img src="/assets/tone-neutral.svg" alt="" />
                      </span>
                      <span className="tone-icon">
                        <img src="/assets/tone-briefcase.svg" alt="" />
                      </span>
                    </div>
                    <div className="tone-active">
                      <span className="tone-icon">
                        <img src="/assets/tone-smile.svg" alt="" />
                      </span>
                      <strong>Friendly</strong>
                    </div>
                    <div className="tone-side">
                      <span className="tone-icon">
                        <img src="/assets/tone-shrink.svg" alt="" />
                      </span>
                      <span className="tone-icon">
                        <img src="/assets/tone-code.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="feature-panel">
                <div className="feature-top">
                  <p className="feature-kicker">Snippets</p>
                  <h3>The things you always say, said once.</h3>
                </div>
                <div className="feature-body">
                  <div className="message-shell message-shell--snippet">
                    <div className="message-demo message-demo--glass js-snippet-demo">
                      Thanks for stopping by, I won't be home for a while but you can just send
                      everything to my <mark>address</mark>
                    </div>
                  </div>
                  <p className="feature-note">
                    Some messages you've sent a hundred times. Save them once. After that, one word
                    brings back the whole thing, ready to send.
                  </p>
                </div>
              </article>
            </div>

            <section className="speed-panel" aria-labelledby="speed-title">
              <div className="speed-intro">
                <p className="feature-kicker">Speed</p>
                <h3 id="speed-title">Your keyboard just can't keep up.</h3>
              </div>
              <div className="speed-compare">
                <div className="speed-card">
                  <p
                    className="js-speed-demo"
                    data-type-text="Hey, any chance we can move our 1:1 to Thursday? Today completely got away from me and I don't want to rush it. Same time works if that's good for you."
                    data-type-speed="52"
                  >
                    Hey, any chance we can move our 1:1 to Thursday? Today completely got away from
                    me and I don't want to rush it. Same time works if that's good for you.
                    <span className="caret">|</span>
                  </p>
                  <span>Traditional Typing</span>
                </div>
                <div className="speed-card speed-card--blue">
                  <p
                    className="js-speed-demo"
                    data-type-text="Hey, any chance we can move our 1:1 to Thursday? Today completely got away from me and I don't want to rush it. Same time works if that's good for you."
                    data-type-speed="16"
                  >
                    Hey, any chance we can move our 1:1 to Thursday? Today completely got away from
                    me and I don't want to rush it. Same time works if that's good for you.
                    <span className="caret">|</span>
                  </p>
                  <span>Pocket Voice</span>
                </div>
              </div>
            </section>
          </section>

          {/* AUDIENCES */}
          <section className="audiences" id="enterprise" aria-labelledby="audiences-title">
            <div className="section-intro section-intro--split">
              <div>
                <h2 id="audiences-title">People who type for a living</h2>
                <p>
                  Built for people who already optimize their tools, and recognize craft the moment
                  they encounter it.
                </p>
              </div>
              <div className="audience-controls" aria-label="Audience cards">
                <button
                  type="button"
                  className="audience-arrow audience-arrow--prev"
                  aria-label="Previous audience cards"
                >
                  <img src="/assets/audience-arrow-prev.svg" alt="" />
                </button>
                <button
                  type="button"
                  className="audience-arrow audience-arrow--next"
                  aria-label="Next audience cards"
                >
                  <img src="/assets/audience-arrow-next.svg" alt="" />
                </button>
              </div>
            </div>

            <div className="audience-grid">
              {audiences.map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section className="pricing" id="pricing" aria-labelledby="pricing-title">
            <div className="section-intro section-intro--center">
              <h2 id="pricing-title">Free to start. Fair to stay.</h2>
              <p>Try everything before paying anything. Upgrade when speaking becomes how you write.</p>
            </div>

            <div className="pricing-grid">
              <article className="price-card">
                <div>
                  <h3>Free</h3>
                  <p className="price">
                    <span>$0</span>/m
                  </p>
                  <p className="price-note">For trying it properly.</p>
                </div>
                <ul>
                  <li>2,000 words a week</li>
                  <li>Every feature included</li>
                  <li>All languages</li>
                  <li>No card required</li>
                </ul>
                <a className="btn price-cta price-cta--dark" href="#get-app">
                  Start Speaking
                </a>
              </article>

              <article className="price-card">
                <div>
                  <h3>Pro</h3>
                  <p className="price">
                    <span>$12</span>/m
                  </p>
                  <p className="price-note">For every day, every app.</p>
                </div>
                <ul>
                  <li>Unlimited words</li>
                  <li>Tones, snippets, and dictionary</li>
                  <li>Early access to new features</li>
                  <li>Priority support</li>
                </ul>
                <a className="btn price-cta price-cta--blue" href="#get-app">
                  Go Pro
                </a>
              </article>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="final-cta" id="get-app" aria-labelledby="final-cta-title">
            <h2 id="final-cta-title">
              Stop typing.
              <br />
              Start Speaking
            </h2>
            <p>Press once and talk. Your fastest keyboard is the one you already carry everywhere</p>
            <a className="btn btn-paper btn-lg" href="#get-app">
              <img className="app-glyph" src="/assets/app-store-glyph.svg" alt="" />
              Start Speaking on iOS
            </a>
          </section>
        </main>

        <footer className="footer">
          <img className="footer-cloud-image" src="/assets/footer-cloud.png" alt="" aria-hidden="true" />
          <span>© Pocket Voice</span>
          <nav className="footer-links" aria-label="Footer">
            <a href="#pricing">Pricing</a>
            <a href="#enterprise">Enterprise</a>
            <a href="#get-app">Get the app</a>
          </nav>
        </footer>
      </div>
    </>
  );
}
