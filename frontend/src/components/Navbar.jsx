import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const flash = useFlash();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [open, setOpen] = useState(false);

    // Keep the box in sync when the URL changes from elsewhere (back button,
    // links) by resetting during render rather than in an effect.
    const urlQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(urlQuery);
    const [syncedQuery, setSyncedQuery] = useState(urlQuery);
    if (urlQuery !== syncedQuery) {
        setSyncedQuery(urlQuery);
        setQuery(urlQuery);
    }

    const onSearch = (e) => {
        e.preventDefault();
        setOpen(false);
        navigate(query.trim() ? `/listings?q=${encodeURIComponent(query.trim())}` : "/listings");
    };

    const onLogout = async () => {
        try {
            const data = await logout();
            flash.success(data.message);
            navigate("/listings");
        } catch (err) {
            flash.error(err.message);
        }
    };

    return (
        <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/listings">
                    <i className="fa-regular fa-compass"></i>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-expanded={open}
                    aria-label="Toggle navigation"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse${open ? " show" : ""}`}>
                    <div className="navbar-nav">
                        <NavLink className="nav-link" to="/listings" onClick={() => setOpen(false)}>
                            Explore
                        </NavLink>
                    </div>
                    <div className="navbar-nav ms-auto">
                        <form className="d-flex" role="search" onSubmit={onSearch}>
                            <input
                                className="form-control me-2 search-inp"
                                type="search"
                                placeholder="Search destinations"
                                aria-label="Search destinations"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button className="btn btn-search" type="submit">
                                <i className="fa-solid fa-magnifying-glass"></i>Search
                            </button>
                        </form>
                    </div>
                    <div className="navbar-nav ms-auto">
                        <NavLink className="nav-link" to="/listings/new" onClick={() => setOpen(false)}>
                            Stayease-bnb Your Home
                        </NavLink>
                        {!user ? (
                            <>
                                <NavLink className="nav-link" to="/signup" onClick={() => setOpen(false)}>
                                    <b>SignUp</b>
                                </NavLink>
                                <NavLink className="nav-link" to="/login" onClick={() => setOpen(false)}>
                                    <b>LogIn</b>
                                </NavLink>
                            </>
                        ) : (
                            <button type="button" className="nav-link btn btn-link" onClick={onLogout}>
                                <b>LogOut</b>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
