import { useCallback, useEffect, useState } from 'react';

/**
 * Runs `request(signal)` on mount and whenever `deps` change, exposing the
 * three states the UI renders: loading, success and error.
 *
 * `request` is intentionally left out of the dependency list so callers can
 * pass an inline arrow function without restarting the fetch on every render.
 */
export function useApi(request, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: 'loading', data: null, error: null });

    request(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data, error: null });
        }
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { ...state, retry };
}
