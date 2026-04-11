import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

/** Intersection-based reveal: opacity + translateY (see index.css .home-section-reveal). */
export function HomeSectionReveal({ children, className }) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cn("home-section-reveal", visible && "home-section-reveal--visible", className)}>
      {children}
    </div>
  );
}
