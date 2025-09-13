import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { root: null, rootMargin: "200px", threshold: 0, ...options }
    );
    io.observe(el);
    return () => io.unobserve(el);
  }, [options]);

  return { ref, inView };
}
