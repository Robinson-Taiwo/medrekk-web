"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Brings a section in once, the first time it is reached.
 *
 * Two deliberate safeguards. It never re-animates on the way back up, because a page where
 * every section re-enters each time it crosses the fold is exhausting rather than polished.
 * And it reveals itself after a moment regardless of whether the observer ever fired — a
 * reveal that depends on JavaScript hides the whole page when JavaScript does not arrive,
 * which is the worst possible failure for a page whose job is to explain the product.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fallback = setTimeout(() => setShown(true), 1200);

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return () => clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
