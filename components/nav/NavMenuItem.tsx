"use client";

import Link from "next/link";
import styles from "./NavMenuItem.module.css";
import { TypeBase } from "@/components/type";
import type { NavMenuItemProps } from "./nav.types";

/**
 * Bashir&Co — Nav.MenuItem.
 *
 * One reusable component, rendered once per entry in `navMenuItems` —
 * never four hand-authored one-off rows. No badge, icon, counter, or
 * trailing arrow — just the label, at Act-title scale, per Component
 * Library Ch.5 ("deliberately larger than Type.NavItem, since the
 * overlay is its own considered moment").
 */
export function NavMenuItem({ item, onNavigate }: NavMenuItemProps) {
  return (
    <Link href={item.href} onClick={onNavigate} className={styles.item}>
      <TypeBase variant="actTitle" as="span">
        {item.label}
      </TypeBase>
    </Link>
  );
}
