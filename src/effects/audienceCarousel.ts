// Audience cards prev/next carousel — ported from audience-carousel.js.

export function initAudienceCarousel(): () => void {
  const grid = document.querySelector<HTMLElement>('.audience-grid');
  const previous = document.querySelector<HTMLButtonElement>('.audience-arrow--prev');
  const next = document.querySelector<HTMLButtonElement>('.audience-arrow--next');

  if (!grid || !previous || !next) return () => {};

  let index = 0;
  const cardWidth = 307;
  const maxIndex = Math.max(0, grid.children.length - 4);

  function update() {
    grid!.style.transform = `translateX(${-index * cardWidth}px)`;
    previous!.disabled = index === 0;
    next!.disabled = index === maxIndex;
  }

  const onPrev = () => {
    index = Math.max(0, index - 1);
    update();
  };
  const onNext = () => {
    index = Math.min(maxIndex, index + 1);
    update();
  };

  previous.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  update();

  return () => {
    previous.removeEventListener('click', onPrev);
    next.removeEventListener('click', onNext);
  };
}
