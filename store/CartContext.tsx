"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

/**
 * Bashir&Co — cart state.
 *
 * The one piece of genuinely global, cross-route, persistent client state
 * in the app (Production Architecture Plan Ch.12 left room for exactly
 * this kind of thing — a small Context, no Redux). A cart line stores
 * only what the header badge and the cart panel need to render — slug,
 * title, image, price label, category — not the whole piece record, so a
 * later change to the piece model doesn't invalidate a stored cart.
 *
 * Persistence is localStorage under a single key, written on every change
 * and read once on mount. It is deliberately read AFTER the first client
 * render (in an effect), never during render, so the server and the first
 * client paint agree on an empty cart and there is no hydration mismatch;
 * the stored cart then hydrates in a beat later. All reads/writes are
 * wrapped — private-browsing modes can throw on storage access, and a
 * cart is not worth crashing the page over.
 */

export interface CartLine {
  slug: string;
  title: string;
  image: string;
  priceLabel: string;
  /** Numeric price in USD; null means "quoted on request". */
  priceUsd: number | null;
  category: string;
  /** Placeholder kind, so the cart thumbnail falls back gracefully. */
  visualVariant: string;
  qty: number;
}

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "qty"> }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "clear" };

const STORAGE_KEY = "bashirco_cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };

    case "add": {
      const existing = state.lines.find((l) => l.slug === action.line.slug);
      if (existing) {
        // Already in the cart — bump its quantity rather than duplicating.
        return {
          lines: state.lines.map((l) =>
            l.slug === action.line.slug ? { ...l, qty: l.qty + 1 } : l
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty: 1 }] };
    }

    case "remove":
      return { lines: state.lines.filter((l) => l.slug !== action.slug) };

    case "setQty": {
      const qty = Math.max(1, Math.floor(action.qty) || 1);
      return {
        lines: state.lines.map((l) =>
          l.slug === action.slug ? { ...l, qty } : l
        ),
      };
    }

    case "clear":
      return { lines: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  /** Total number of items (sum of quantities) — for the header badge. */
  count: number;
  add: (line: Omit<CartLine, "qty">) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  /** Whether the cart panel is open. Lives here (not in the button) so the
   *  header can react to it — e.g. switch to its solid theme while the
   *  panel is open, the same way it does for the mega-menu. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);

  // Read the stored cart once, on the client, after first paint.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
    } catch {
      // Corrupt or unreadable storage — start from an empty cart.
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage may be unavailable (private mode) — a non-persisted cart
      // is a safe degradation, not a failure.
    }
  }, [state.lines]);

  const add = useCallback(
    (line: Omit<CartLine, "qty">) => dispatch({ type: "add", line }),
    []
  );
  const remove = useCallback(
    (slug: string) => dispatch({ type: "remove", slug }),
    []
  );
  const setQty = useCallback(
    (slug: string, qty: number) => dispatch({ type: "setQty", slug, qty }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0);
    return {
      lines: state.lines,
      count,
      add,
      remove,
      setQty,
      clear,
      has: (slug: string) => state.lines.some((l) => l.slug === slug),
      isOpen,
      open,
      close,
    };
  }, [state.lines, add, remove, setQty, clear, isOpen, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
