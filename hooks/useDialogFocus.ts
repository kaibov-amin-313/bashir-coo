"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Bashir&Co — focus handling for the slide-in dialogs.
 *
 * Opening a panel has to move focus into it, and closing has to put focus
 * back where it was. Without the first, a keyboard user presses the cart
 * button and nothing appears to happen — focus is still on the button,
 * behind a panel they can't reach without tabbing through the whole page.
 * Without the second, focus falls back to the top of the document and
 * they lose their place.
 *
 * The search overlay already did this by taking a ref to the element to
 * restore to. That works when the opener is a single known button, but
 * the filter panel is opened from more than one control, so this hook
 * captures whatever had focus at the moment of opening instead of being
 * told in advance.
 *
 * Escape is handled here too, since every panel wants it and each was
 * otherwise repeating the same listener.
 */
export function useDialogFocus(
  isOpen: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Wait a frame: the panel animates in from translateX(100%), and
    // focusing a mid-transition element makes some browsers scroll the
    // container to chase it.
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (target ?? panel).focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, panelRef, onClose]);

  // Restore on close — but not on first mount, when nothing was opened.
  useEffect(() => {
    if (isOpen) return;
    const previous = previouslyFocused.current;
    if (!previous) return;
    previous.focus();
    previouslyFocused.current = null;
  }, [isOpen]);
}
