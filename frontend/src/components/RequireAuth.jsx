import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import Spinner from "./Spinner";

export default function RequireAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();
    const flash = useFlash();
    const flashed = useRef(false);

    useEffect(() => {
        // Ref guard so StrictMode's double effect run does not stack two alerts.
        if (!loading && !user && !flashed.current) {
            flashed.current = true;
            flash.error("you must be logged in!");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    if (loading) return <Spinner />;

    // Mirrors the server's redirectUrl behaviour: come back here after logging in.
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}
