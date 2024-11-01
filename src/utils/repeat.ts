export function repeat(fn: () => Promise<void>, interval: number) {
  let timeoutId: NodeJS.Timeout;
  let stopped = false;

  const runLoop = async () => {
    if (stopped) return;
    
    await fn();
    timeoutId = setTimeout(runLoop, interval);
  };

  runLoop();

  return () => {
    stopped = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}
