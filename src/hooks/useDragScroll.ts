import { useEffect, useRef } from 'react';

/**
 * Click-and-drag horizontal scrolling for a scroll container (carousels). Trackpad
 * swipe and the OS scrollbar already work on overflow-x:auto; this adds mouse-drag
 * so a mouse-only user can move the track. After a real drag, the trailing click is
 * suppressed so buttons/links inside don't fire. Returns a ref to attach.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add('is-dragging');
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove('is-dragging');
    };
    // swallow the click that ends a drag (capture phase) so child buttons don't fire
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, []);

  return ref;
}

/** Page a carousel by a whole number of visible cards, landing exactly on a card. */
export function pageByCards(track: HTMLElement | null, dir: 1 | -1) {
  if (!track) return;
  const items = [...track.children] as HTMLElement[];
  if (items.length < 2) {
    track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
    return;
  }
  const base = items[0].offsetLeft;
  const offsets = items.map((c) => c.offsetLeft - base);
  const pitch = offsets[1] - offsets[0] || 1;
  const visible = Math.max(1, Math.round(track.clientWidth / pitch));
  const current = Math.round(track.scrollLeft / pitch);
  const target = Math.max(0, Math.min(items.length - 1, current + dir * visible));
  // land on the exact card offset (= a snap point), so no card is left mid-cut
  track.scrollTo({ left: offsets[target], behavior: 'smooth' });
}
