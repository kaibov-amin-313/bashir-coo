# /hooks

React hooks — generic, reusable browser-interaction utilities live here,
not tied to any one component.

## Present (Phase 4)

- `useFocusTrap` — traps Tab cycling within a container while active,
  restores focus to whatever was focused before activation on release.
  Used by `Nav.Overlay`; written generically enough for any future
  full-viewport takeover to reuse.
- `useEscapeKey` — calls a handler on Escape while active.
- `useBodyScrollLock` — locks body scroll while active, with scrollbar-
  width compensation so the page doesn't shift.

## Not yet built

`useRecognitionGesture`, `useSessionState`, `useDirectedArrival`,
`useReducedMotion` — see Production Architecture Plan Ch.3, Ch.12. These
depend on state and motion architecture that doesn't exist until later
phases.
