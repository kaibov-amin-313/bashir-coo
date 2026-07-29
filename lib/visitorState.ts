/**
 * Bashir&Co — Visitor state (Threshold-scoped, for this phase).
 *
 * Reads/writes a single, invisible localStorage flag distinguishing a
 * first-time visit from a returning one — used only to select Threshold's
 * timing (Motion Bible Ch.4; Homepage Film Script Ch.3's "Returning
 * visitor variation"). No banner, no "welcome back," no user-facing
 * setting — the visitor never sees evidence this exists.
 *
 * SSR-safe by construction: both functions guard on `typeof window`, so
 * calling either during server render or before client mount is a safe
 * no-op rather than a crash. Callers are still responsible for only
 * trusting the result once they know they're on the client (see
 * `ThresholdSequence`, which defaults to "first-time" until its own
 * client-only effect resolves this).
 */

const STORAGE_KEY = "bashirco_visited";

export function getVisitorState(): "first-time" | "returning" {
  if (typeof window === "undefined") return "first-time";

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
      ? "returning"
      : "first-time";
  } catch {
    // Storage can throw in some private-browsing configurations — fail
    // safe to first-time rather than let it break the sequence.
    return "first-time";
  }
}

export function markVisited(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Same private-browsing consideration as above — a failed write just
    // means the next visit also plays first-time timing, which is a safe
    // degradation, not a broken one.
  }
}
