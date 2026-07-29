"use client";

import { useEffect } from "react";

/**
 * Calls `onEscape` when the Escape key is pressed while `isActive` is
 * true. Generic and reusable — not `Nav.Overlay`-specific.
 */
export function useEscapeKey(onEscape: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape]);
}
