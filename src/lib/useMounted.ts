'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first hydration render, then true once
 * mounted on the client. Lets us render a deterministic set on the server
 * (no hydration mismatch) and swap to client-only behaviour — e.g. a random
 * shuffle — immediately after.
 *
 * Uses useSyncExternalStore rather than useEffect + setState so it complies
 * with this project's react-hooks/set-state-in-effect rule (see ThemeToggle).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // client snapshot
    () => false,  // server snapshot
  );
}
