"use client";

import { useRef, useState } from "react";
import { NavMark } from "./NavMark";
import { NavOverlay } from "./NavOverlay";
import { NavLocaleSwitcher } from "./NavLocaleSwitcher";
import { getNavMenuItems } from "./navMenuItems";
import styles from "./NavSystem.module.css";
import type { NavSystemProps } from "./nav.types";

/**
 * Bashir&Co — NavSystem, locale-aware. The always-mounted Nav.Mark +
 * inert + restoreFocusRef focus architecture is unchanged — see
 * NavOverlay.tsx / useFocusTrap.ts before altering. `markHidden`
 * remains available but the quiet-luxury site shows nav everywhere
 * (no Act-gated hiding).
 */
export function NavSystem({
  locale,
  dictionary,
  markHidden = false,
}: NavSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const markRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <NavMark
        ref={markRef}
        isOpen={isOpen}
        onToggle={() => setIsOpen(true)}
        openLabel={dictionary.nav.open}
        closeLabel={dictionary.nav.close}
        inert={isOpen || markHidden}
        className={markHidden ? styles.markHidden : undefined}
      />
      {!isOpen && <NavLocaleSwitcher locale={locale} dictionary={dictionary} />}
      <NavOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={getNavMenuItems(locale, dictionary)}
        locale={locale}
        dictionary={dictionary}
        restoreFocusRef={markRef}
      />
    </>
  );
}
