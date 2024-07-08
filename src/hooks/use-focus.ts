import { useRef, useCallback } from "react";

export const useFocus = () => {
    const ref = useRef<HTMLElement>(null);

    const focusElement = useCallback(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return [ref, focusElement];
};



// const [inputRef, focusInput] = useFocus();

// <input ref={inputRef} type="text" />
// <button onClick={focusInput}>Focus Input</button>
