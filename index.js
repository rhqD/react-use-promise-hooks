import { useMemo, useState } from 'react';

export const usePromise = (executorCreator, deps) => {
  const executor = useMemo(executorCreator, deps);
  const [{ hook, undo }, setMeta] = useState({ hook: {}, undo: null });
  const { resolve, reject } = hook;

  const wrappedResolve = useMemo(() => () => {
    if (typeof undo === 'function') {
      undo();
    }
    resolve();
  }, [undo, resolve]);

  const wrappedReject = useMemo(() => () => {
    if (typeof undo === 'function') {
      undo();
    }
    reject();
  }, [undo, reject]);

  const promiseCreator = useMemo(() => (...args) => new Promise((re, rj) => {
    setMeta({
      hook: { resolve: re, reject: rj },
      undo: executor(...args),
    });
  }), [executor, setMeta]);
  return [promiseCreator, wrappedResolve, wrappedReject];
};
