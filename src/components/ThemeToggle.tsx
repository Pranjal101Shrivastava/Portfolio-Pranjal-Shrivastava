"use client";

import { useEffect, useState } from "react";

const KEY = "portfolio.theme";

/**
 * Dark by default, with the choice remembered per browser.
 *
 * Storage can throw in a private window and return empty under cleared site
 * data, so every access is wrapped and a failure simply means the default.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* private window, blocked storage — fall through to the default */
    }
    const next = stored === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the toggle still works for this visit */
    }
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      suppressHydrationWarning
    >
      {/* Rendered only once the stored preference is known, so the icon never
          flips on hydration. */}
      <span aria-hidden="true" style={{ opacity: ready ? 1 : 0, transition: "opacity .2s" }}>
        {theme === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}
