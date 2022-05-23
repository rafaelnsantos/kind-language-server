export function debounce<A = unknown, R = void>(fn: (args: A) => R, ms: number) {
  let timer: NodeJS.Timeout | null = null;
  const debouncedFunc = (args: A): Promise<R> =>
    new Promise((resolve) => {
      teardown();

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const teardown = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return [debouncedFunc, teardown] as const;
}
