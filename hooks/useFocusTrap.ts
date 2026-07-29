"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab/Shift+Tab focus cycling within `containerRef`'s subtree while
 * `isActive` is true.
 *
 * Restoration on deactivation: if `restoreFocusRef` is supplied, focus
 * returns to that specific element. Otherwise this falls back to
 * `document.activeElement`, captured at activation time.
 *
 * The explicit-ref path exists because the fallback is fragile whenever
 * the element to restore focus to might be unmounted and later
 * remounted as a *different* DOM node while the trap is active — exactly
 * what happened with `Nav.Overlay`: the page-level `Nav.Mark` used to
 * unmount the instant the overlay opened, so by the time this effect's
 * capture ran, there was nothing valid left to capture, and even a
 * successful capture would have gone stale once a new `Nav.Mark` node
 * was created on close. An explicit ref to a node that stays mounted
 * throughout sidesteps both problems. Generic callers with no such
 * concern can still rely on the auto-capture fallback.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  restoreFocusRef?: React.RefObject<HTMLElement | null>
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Captured now, at effect-run time, rather than re-read inside the
    // cleanup below — a ref's `.current` can in principle change before
    // cleanup runs, and capturing it into a plain variable here removes
    // that ambiguity entirely (react-hooks/exhaustive-deps), rather than
    // relying on this hook's callers happening to keep their ref stable.
    const restoreTarget = restoreFocusRef?.current ?? null;
    if (!restoreFocusRef) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    }

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusable = getFocusable();
    (focusable[0] ?? container).focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const currentFocusable = getFocusable();
      if (currentFocusable.length === 0) return;

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      (restoreTarget ?? previouslyFocused.current)?.focus?.();
    };
  }, [isActive, containerRef, restoreFocusRef]);
}
