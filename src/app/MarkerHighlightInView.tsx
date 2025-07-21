"use client";
import React, { useRef, useEffect, useState } from "react";

// Custom hook to add animation class when in view (replayable)
export function useInViewAnimation<T extends Element = HTMLSpanElement>(animationClass: string) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView ? animationClass : ""] as const;
}

// MarkerHighlightInView component for in-view marker animation
export function MarkerHighlightInView({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
  const [ref, animateClass] = useInViewAnimation('marker-highlight-animate');
  return (
    <span ref={ref} className={`marker-highlight ${animateClass}`} style={style}>{children}</span>
  );
} 