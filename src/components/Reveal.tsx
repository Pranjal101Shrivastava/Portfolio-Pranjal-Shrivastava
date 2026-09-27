"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal-on-scroll.
 *
 * The base `.reveal` class is transparent, which would leave content invisible
 * for anyone without JavaScript or IntersectionObserver. So the class is only
 * applied once this component has mounted AND confirmed the observer exists —
 * server-rendered HTML ships fully visible, and the animation is an
 * enhancement rather than a prerequisite for reading the page.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const reduced =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    setArmed(true);
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    // Safety net. The observer is reliable in every browser that has it, but
    // the failure mode if it ever does not fire is content that stays
    // permanently invisible — far worse than a missed animation. After three
    // seconds, show regardless. Anything below the fold is unseen anyway, so
    // this costs nothing when the observer is working.
    const failsafe = window.setTimeout(() => setShown(true), 3000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const classes = [armed ? "reveal" : "", shown ? "is-in" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref as never}
      className={classes}
      style={delay ? ({ ["--delay" as string]: `${delay}ms` } as never) : undefined}
    >
      {children}
    </Tag>
  );
}
