// Mobile nav menu toggle — ported from the inline script in the static site.

export function initNavMenu(): () => void {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-menu-toggle');

  if (!nav || !navLinks || !navToggle) return () => {};

  function setMenuOpen(isOpen: boolean) {
    nav!.classList.toggle('is-menu-open', isOpen);
    navToggle!.setAttribute('aria-expanded', String(isOpen));
    navToggle!.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  const onToggle = () => setMenuOpen(!nav.classList.contains('is-menu-open'));
  const onLinkClick = (event: Event) => {
    if ((event.target as Element).closest('a')) setMenuOpen(false);
  };

  // Solidify the floating pill once the page is scrolled, so it stays legible
  // over the busier content further down (Flighty-style scroll state).
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();

  navToggle.addEventListener('click', onToggle);
  navLinks.addEventListener('click', onLinkClick);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    navToggle.removeEventListener('click', onToggle);
    navLinks.removeEventListener('click', onLinkClick);
    window.removeEventListener('scroll', onScroll);
  };
}
