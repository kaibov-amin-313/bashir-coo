"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import styles from "./NavOverlay.module.css";
import { NavMark } from "./NavMark";
import { NavMenuItem } from "./NavMenuItem";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NavLocaleSwitcher } from "./NavLocaleSwitcher";
import type { NavOverlayProps } from "./nav.types";

/**
 * Bashir&Co — Nav.Overlay.
 *
 * A full-screen dialog, not a dropdown, side drawer, or mega-menu.
 *
 * Close control: this component renders its own `Nav.Mark` instance,
 * at the identical top-left position the page-level one occupies, as its
 * first child — reusing the same controlled component rather than a new
 * "X" icon. This resolves a real z-index question, not just a styling
 * preference: this system's stacking order (Production Architecture Plan
 * Ch.6) places `--z-fullscreen-nav-overlay` (30) above
 * `--z-sticky-nav-mark` (10) by design — the overlay is meant to be the
 * dominant layer. If the page-level Nav.Mark stayed mounted underneath,
 * it would be visually hidden but still focusable, a real keyboard-
 * accessibility bug. `NavSystem` solves this by unmounting the page-level
 * instance whenever the overlay is open — the version rendered here,
 * inside the overlay's own stacking context, is the only one in the DOM
 * while this is visible, at the exact same visual position, doing the
 * same thing.
 *
 * "Click outside to close" is deliberately not implemented: a full-bleed,
 * opaque, full-viewport panel has no "outside" to click. Escape and the
 * always-visible Nav.Mark-as-close-control are the two closing
 * mechanisms, which is the correct equivalent for this specific shape of
 * overlay.
 *
 * Background currently defaults to the Deepest surface register — this
 * component doesn't yet know which page/Act it's mounted over (that
 * per-page register awareness is a homepage-integration concern for a
 * later phase, not something Nav.Overlay needs to solve in isolation).
 *
 * Mount/unmount, not visibility toggling — screen readers never
 * encounter a hidden-but-present dialog. The fade is handled with a
 * short local `visible` flag flipped one frame after mount (so the
 * browser actually paints the pre-transition state first) and a matching
 * delay before physically unmounting on close, timed to `--motion-standard`.
 * This is a simple CSS transition, not a GSAP sequence — Phase 6 replaces
 * this with real choreography; nothing here should make that harder.
 */
export function NavOverlay({
  isOpen,
  onClose,
  items,
  locale,
  dictionary,
  restoreFocusRef,
}: NavOverlayProps) {
  useScrollLock(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef, shouldRender, restoreFocusRef);
  useEscapeKey(onClose, shouldRender);
  useBodyScrollLock(shouldRender);

  useEffect(() => {
    if (isOpen) {
      // Two frames, deliberately: frame N mounts the node (shouldRender),
      // frame N+1 flips the opacity class. If both happened in the same
      // frame, the browser would never paint the pre-transition state,
      // and the fade wouldn't visually animate at all. Every state write
      // below lives inside a callback, never as a direct synchronous
      // call in the effect body itself (react-hooks/set-state-in-effect).
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        setShouldRender(true);
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    // Matches --motion-standard (1s) exactly — the CSS transition uses
    // the same token. The timeout is 50ms longer so the fade has
    // genuinely finished painting before the node unmounts.
    const raf = requestAnimationFrame(() => setVisible(false));
    const timeout = setTimeout(() => setShouldRender(false), 1050);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      id="nav-overlay"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={[styles.overlay, visible ? styles.visible : ""].join(" ")}
    >
      <NavMark
        isOpen={true}
        onToggle={onClose}
        openLabel={dictionary.nav.open}
        closeLabel={dictionary.nav.close}
      />
      <NavLocaleSwitcher locale={locale} dictionary={dictionary} />
      <nav className={styles.menu} aria-label="Primary">
        {items.map((item) => (
          <NavMenuItem key={item.href} item={item} onNavigate={onClose} />
        ))}
      </nav>
    </div>
  );
}
