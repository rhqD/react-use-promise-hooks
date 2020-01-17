import { useMemo, useState } from 'react';

const usePromise = (executorCreator, deps) => {
    const executor = useMemo(executorCreator, deps);
    const [hook, setHook] = useState({});
    const { resolve, reject } = hook;
    const promiseCreator = useMemo(() => (...args) => new Promise((re, rj) => {
        setHook({ resolve: re, reject: rj });
        executor(...args);
    }), [executor]);
    return [promiseCreator, resolve, reject];
};

export default usePromise;
