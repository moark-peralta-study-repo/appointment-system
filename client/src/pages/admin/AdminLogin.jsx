import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "../../assets/logo/happy-paws-logo-2.png";
import { useAuth } from "../../context/useAuth";

function AdminLogin() {
	const navigate = useNavigate();
	// login = a react-query mutation wrapping POST /auth/login.
	// It carries isPending (button spinner) and error (message to show) for us.
	const { login, isAuthed } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// The API's error message ("Invalid email or password", "email must be valid"…)
	// is shown verbatim — no more hard-coded success check here.
	const error = login.error?.message || "";

	const handleLogin = (e) => {
		e.preventDefault();
		login.mutate({ email, password }, { onSuccess: () => navigate("/admin") });
	};

	// Already signed in (e.g. came back from a page) → go straight to the dashboard.
	if (isAuthed) {
		return <Navigate to="/admin" replace />;
	}

	return (
		<div className="admin-login-page">
			<div className="admin-login-card">
				<div className="admin-login-brand">
					<img src={logo} alt="Mutuals Paws Veterinary Clinic" />

					<div>
						<strong>Mutuals Paws</strong>
						<span>Veterinary Clinic</span>
					</div>
				</div>

				<div className="admin-login-heading">
					<p>STAFF PORTAL</p>
					<h1>Welcome back</h1>
					<span>Sign in to manage the Mutuals Paws clinic portal.</span>
				</div>

				<form onSubmit={handleLogin} className="admin-login-form">
					<div className="admin-login-field">
						<label htmlFor="admin-email">Email Address</label>

						<input
							id="admin-email"
							type="email"
							placeholder="Enter your staff email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="admin-login-field">
						<label htmlFor="admin-password">Password</label>

						<div className="admin-password-wrapper">
							<input
								id="admin-password"
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
						disabled={login.isPending}
					>
						{login.isPending ? "Signing in…" : "Sign In to Staff Portal"}
					</button>
				</form>

				<div className="admin-login-demo">
					<span>Demo account</span>
					<p>admin@mutualspaws.com</p>
					<p>admin123</p>
				</div>

				<button
					type="button"
					className="admin-back-button"
					onClick={() => navigate("/")}
				>
					← Back to main website
				</button>
			</div>

			<div className="admin-login-side">
				<div className="admin-login-side-content">
					<span className="admin-login-side-label">MUTUALS PAWS</span>

					<h2>
						Caring for pets.
						<br />
						Supporting their people.
					</h2>

					<p>
						Access appointments, patient records, veterinarian schedules, and
						clinic reports from one place.
					</p>
				</div>

				<div className="admin-login-side-footer">Staff Portal</div>
			</div>
		</div>
	);
}

export default AdminLogin;
