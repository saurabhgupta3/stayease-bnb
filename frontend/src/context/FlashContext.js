import { createContext, useContext } from "react";

export const FlashContext = createContext(null);

export function useFlash() {
    const ctx = useContext(FlashContext);
    if (!ctx) throw new Error("useFlash must be used inside a FlashProvider");
    return ctx;
}
