import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

export default function Signup() {
    const { signup } = useAuth();
    const flash = useFlash();
    const navigate = useNavigate();

    const [values, setValues] = useState({ username: "", email: "", password: "" });
    const [validated, setValidated] = useState(false);
    const [busy, setBusy] = useState(false);

    const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        if (!e.currentTarget.checkValidity()) return;

        setBusy(true);
        try {
            const data = await signup(values);
            flash.success(data.message);
            navigate("/listings");
        } catch (err) {
            flash.error(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="row mt-3">
            <h1 className="col-md-6 offset-md-3">Signup on Stayease-bnb</h1>
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
                            value={values.username}
                            onChange={update("username")}
                            required
                        />
                        <div className="valid-feedback">username looks good</div>
                        <div className="invalid-feedback">Username is required</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={values.email}
                            onChange={update("email")}
                            required
                        />
                        <div className="invalid-feedback">A valid email is required</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={values.password}
                            onChange={update("password")}
                            required
                        />
                        <div className="invalid-feedback">Password is required</div>
                    </div>
                    <button className="btn btn-success" disabled={busy}>
                        {busy ? "Creating account..." : "SignUp"}
                    </button>
                </form>
                <p className="mt-3">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}
