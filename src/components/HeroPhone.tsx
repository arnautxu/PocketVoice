/* ══════════════════════════════════════════════════════════════════════════════
 * HERO PHONE — the Speak-to-Edit product shot, featured in the hero's right column.
 * Whole device, upright, sized by HEIGHT so it always fits the hero without crop.
 * Meaningful product content (descriptive alt, NOT decorative). A soft device shadow
 * lifts it off the bright cloud sea; it floats gently and rides a light scroll
 * parallax (set via the section's --hero-shift var) for depth against the clouds.
 * ════════════════════════════════════════════════════════════════════════════ */

export function HeroPhone() {
  return (
    // .hero-phone-col carries the perspective; the .hero-phone-dolly wrapper takes the
    // scroll-driven translateZ push-in (the device is the destination of the fly-
    // through), and the inner <img> keeps its idle float — the two transforms compose
    // on separate nodes so neither clobbers the other.
    <div className="hero-phone-col">
      <div className="hero-phone-dolly">
        <img
          className="hero-phone"
          src="/brand/hero/phone-demo.webp"
          alt="Pocket Voice cleaning up a spoken WhatsApp message in real time: the filler words struck out, the finished message composed."
          width={700}
          height={1430}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
