import { useEffect, useRef, useState } from 'react';

export function useInViewOnce<T extends HTMLElement>(margin = '-12% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: margin, threshold: 0.01 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView, margin]);

  return [ref, inView] as const;
}
