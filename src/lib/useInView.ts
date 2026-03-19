import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  /** Fire only once (default: true) */
  once?: boolean;
}

/**
 * Lightweight native Intersection Observer hook.
 * Returns a [ref, inView] tuple.
 *
 * @example
 *   const [ref, inView] = useInView({ threshold: 0.2 });
 *   <div ref={ref} className={inView ? "visible" : ""} />
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [{ current: T | null }, boolean] {
  const { once = true, ...observerOptions } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, observerOptions);

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return [ref, inView];
}
