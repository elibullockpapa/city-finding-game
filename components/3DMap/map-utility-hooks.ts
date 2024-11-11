// components/3DMap/map-utility-hooks.ts
"use client";

import {
    DependencyList,
    EffectCallback,
    Ref,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import isDeepEqual from "fast-deep-equal";

export function useCallbackRef<T>() {
    const [el, setEl] = useState<T | null>(null);
    const ref = useCallback((value: T) => setEl(value), [setEl]);

    return [el, ref as Ref<T>] as const;
}

export function useDeepCompareEffect(
    effect: EffectCallback,
    deps: DependencyList,
) {
    const ref = useRef<DependencyList | undefined>(undefined);

    if (!ref.current || !isDeepEqual(deps, ref.current)) {
        ref.current = deps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, ref.current);
}

export function useDebouncedEffect(
    effect: EffectCallback,
    timeout: number,
    deps: DependencyList,
) {
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => effect(), timeout);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeout, ...deps]);
}