import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

export default function Login() {
    const { login } = useAuth();
    const flash = useFlash();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [busy, setBusy] = useState(false);

    // Set by RequireAuth, mirroring the server's session redirectUrl.
    const from = location.state?.from || "/listings";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        if (!username.trim() || !password) return;

        setBusy(true);
        try {
            const data = await login({ username, password });
            flash.success(data.message);
            navigate(from, { replace: true });
        } catch (err) {
            flash.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="row mt-3">
            <h1 className="col-md-6 offset-md-3">Login</h1>
            <div className="col-md-6 offset-md-3">
                <form
                    noValidate
                    className={`needs-validation${validated ? " was-validated" : ""}`}
                    onSubmit={handleSubmit}
                >
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <div className="invalid-feedback">Username is required</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="invalid-feedback">Password is required</div>
                    </div>
                    <button className="btn btn-success" disabled={busy}>
                        {busy ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="mt-3">
                    New here? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </div>
    );
}
