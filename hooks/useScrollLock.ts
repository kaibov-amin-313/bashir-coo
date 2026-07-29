"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

/**
 * Bashir&Co — useScrollLock.
 *
 * Locks page scrolling while a full-screen overlay (search, nav) is
 * open, so the wheel scrolls the overlay's own content rather than the
 * page beneath it.
 *
 * Deliberately does NOT pin the body with `position: fixed`. That is the
 * usual recipe, but it collapses the document's scroll height, so the
 * browser clamps scrollY to 0 — and Lenis then restarts from that zero,
 * which jumped the page to the top on close. Instead:
 *
 *   1. Stop Lenis. It hijacks the wheel for smooth scrolling and would
 *      keep driving the page even with overflow hidden.
 *   2. Set `overflow: hidden` on <html>, which suppresses native
 *      scrolling without changing the document's height — the scroll
 *      offset survives untouched, so nothing needs restoring.
 *
 * Scrollbar width is compensated with padding so locking doesn't shift
 * the layout sideways.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const lenis = getLenis();
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    lenis?.stop();
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      root.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      lenis?.start();
    };
  }, [locked]);
}
