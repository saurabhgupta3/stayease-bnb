import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ask the server who we are — the session cookie is the source of truth.
    useEffect(() => {
        let cancelled = false;
        api.me()
            .then((data) => {
                if (!cancelled) setUser(data.user);
            })
            .catch(() => {
                if (!cancelled) setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (credentials) => {
        const data = await api.login(credentials);
        setUser(data.user);
        return data;
    }, []);

    const signup = useCallback(async (details) => {
        const data = await api.signup(details);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        const data = await api.logout();
        setUser(null);
        return data;
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, signup, logout }),
        [user, loading, login, signup, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
