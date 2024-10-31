import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = []
) {
  const [state, setState] = useState<T | undefined>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const result = await func();
        if (isMounted) {
          setState(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Async initialization failed'));
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [...deps, func]);

  return { state, error };
}