"use client";

import { forwardRef } from "react";
import styles from "./NavMark.module.css";
import { TypeBase } from "@/components/type";
import type { NavMarkProps } from "./nav.types";

/**
 * Bashir&Co — Nav.Mark. Controlled toggle button; open/close labels are
 * supplied localized. The always-mounted + inert focus-restoration
 * architecture is unchanged — see useFocusTrap.ts before altering.
 */
export const NavMark = forwardRef<HTMLButtonElement, NavMarkProps>(
  ({ isOpen, onToggle, className, openLabel, closeLabel, inert = false }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        aria-controls="nav-overlay"
        inert={inert || undefined}
        className={[styles.mark, className].filter(Boolean).join(" ")}
      >
        <TypeBase variant="wordmark" as="span" splitReady={false}>
          Bashir&amp;Co
        </TypeBase>
      </button>
    );
  }
);

NavMark.displayName = "Nav.Mark";
