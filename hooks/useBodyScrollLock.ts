"use client";

import { useEffect } from "react";

/**
 * Locks body scroll while `isActive` is true, compensating for the
 * disappearing scrollbar's width with matching right padding so the page
 * doesn't shift when the lock engages or releases. Generic and reusable
 * — not `Nav.Overlay`-specific.
 */
export function useBodyScrollLock(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isActive]);
}
