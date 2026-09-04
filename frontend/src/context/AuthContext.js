import { createContext, useContext } from "react";

// Context + hook live apart from the provider component so the file exports
// no components (keeps react-refresh happy).
export const AuthContext = createContext(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
    return ctx;
}
