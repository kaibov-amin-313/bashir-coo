# /lib

Framework-adjacent logic with real side effects or external dependencies
— as opposed to `/utils`, which holds pure functions only.

Will eventually hold: the single global Lenis instance and its GSAP
ticker sync, ScrollTrigger config helpers, the capability-detection logic
deciding canvas vs. video fallback (Production Architecture Plan Ch.11),
and the Zod schema for the Contact form (shared by the form component
tree and the Route Handler — one schema, two consumers).

Nothing here yet. GSAP/ScrollTrigger/Lenis are installed (see
package.json) but not initialized — that begins at Phase 6.
