import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import logo from "../../assets/logo/happy-paws-logo-2.png";
import { useAuth } from "../../context/useAuth";

function ClientLogin() {
    const navigate = useNavigate();
    const { login, isAuthed } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const error = login?.error?.message || "";

    const handleLogin = (e) => {
        e.preventDefault();

        // Only navigate on success — on error we stay on the form so the
        // API's message (e.g. "Invalid email or password") stays visible.
        login?.mutate?.({ email, password }, {
            onSuccess: () => navigate("/client/dashboard"),
        });
    };

    if (isAuthed) {
        return <Navigate to="/client/dashboard" replace />;
    }

    return (
        <div 
            className="admin-login-page" 
            style={{ 
                display: "flex", 
                flexDirection: "row-reverse !important", 
                flexWrap: "nowrap" 
            }}
        >
            {/* 1. KANAN: Login Form */}
            <div className="admin-login-card" style={{ order: 2 }}>
                {/* Brand Logo & Name */}
                <div className="admin-login-brand">
                    <img src={logo} alt="Mutuals Paws Veterinary Clinic" />

                    <div>
                        <strong>Mutuals Paws</strong>
                        <span>Veterinary Clinic</span>
                    </div>
                </div>

                {/* Heading */}
                <div className="admin-login-heading">
                    <p>CLIENT PORTAL</p>
                    <h1>Welcome back</h1>
                    <span>Sign in to manage your pets and appointments.</span>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="admin-login-form">
                    <div className="admin-login-field">
                        <label htmlFor="client-email">Email Address</label>

                        <input
                            id="client-email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-login-field">
                        <label htmlFor="client-password">Password</label>

                        <div className="admin-password-wrapper">
                            <input
                                id="client-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="admin-login-error">{error}</div>}

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={login?.isPending}
                    >
                        {login?.isPending ? "Signing in…" : "Sign In to Client Portal"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
                        New to the portal?{" "}
                        <Link to="/client/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
                            Create an account
                        </Link>
                    </p>
                </form>

                {/* Client Demo Account Credentials */}
                <div className="admin-login-demo">
                    <span>Demo account</span>
                    <p>client@mutualspaws.com</p>
                    <p>client123</p>
                </div>

                {/* Back Button */}
                <button
                    type="button"
                    className="admin-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to main website
                </button>
            </div>

            {/* 2. KALIWA: Hero Banner */}
            <div className="admin-login-side" style={{ order: 1 }}>
                <div className="admin-login-side-content">
                    <span className="admin-login-side-label">MUTUALS PAWS</span>

                    <h2>
                        Caring for pets.
                        <br />
                        Supporting their people.
                    </h2>

                    <p>
                        Access your pets' records, manage upcoming appointments, and get
                        updates directly from your veterinarian.
                    </p>
                </div>

                <div className="admin-login-side-footer">Client Portal</div>
            </div>
        </div>
    );
}

export default ClientLogin;