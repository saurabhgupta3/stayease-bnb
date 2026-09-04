import { useCallback, useMemo, useState } from "react";
import { FlashContext } from "./FlashContext";

let nextId = 0;

export function FlashProvider({ children }) {
    const [messages, setMessages] = useState([]);

    const dismiss = useCallback((id) => {
        setMessages((current) => current.filter((m) => m.id !== id));
    }, []);

    const push = useCallback(
        (type, text) => {
            if (!text) return;
            const id = ++nextId;
            setMessages((current) => [...current, { id, type, text }]);
            setTimeout(() => dismiss(id), 5000);
        },
        [dismiss]
    );

    const value = useMemo(
        () => ({
            messages,
            dismiss,
            success: (text) => push("success", text),
            error: (text) => push("error", text),
        }),
        [messages, dismiss, push]
    );

    return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
}
