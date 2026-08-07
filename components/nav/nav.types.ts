import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Bashir&Co — Navigation component types. Locale-aware since the
 * Quiet Luxury pivot: labels and hrefs come from the dictionary and
 * locale, never hardcoded.
 */

export interface NavMenuItemData {
  label: string;
  href: string;
}

export interface NavMarkProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  openLabel: string;
  closeLabel: string;
  /** Non-interactive + out of the a11y tree without unmounting — see
   * NavOverlay.tsx / useFocusTrap.ts (focus-restoration architecture). */
  inert?: boolean;
}

export interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavMenuItemData[];
  locale: Locale;
  dictionary: Dictionary;
  restoreFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

export interface NavMenuItemProps {
  item: NavMenuItemData;
  onNavigate: () => void;
}

export interface NavConciergeThreadProps {
  locale: Locale;
  dictionary: Dictionary;
  className?: string;
}

export interface NavSystemProps {
  locale: Locale;
  dictionary: Dictionary;
  markHidden?: boolean;
}
