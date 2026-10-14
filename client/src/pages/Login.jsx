import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import logo from "../assets/logo/pink-paws-full.png";
import { useAuth } from "../context/useAuth";

// Shared by login (mutate onSuccess) and the "already signed in" redirect,
// so a vet and an owner each land on the right portal from one place.
const homeFor = (user) =>
	user?.role === "vet" ? "/admin" : "/client/dashboard";

// Single sign-in page for both portals. The form is identical to what the
// old /client/login and /admin/login pages had — the only difference now is
// that the destination is decided by the account's role, not by which URL
// the user came from.
function Login() {
	const navigate = useNavigate();
	const { login, isAuthed, user } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Show the API's message verbatim ("Invalid email or password",
	// "email must be valid"…). On error we stay on the form so it's visible.
	const error = login?.error?.message || "";
	// 403 = valid credentials but email unverified → offer the verify page
	// (prefilled with the email they just typed). 401 = plain wrong creds.
	const unverified = login?.error?.status === 403;

	const handleLogin = (e) => {
		e.preventDefault();
		login?.mutate?.(
			{ email, password },
			{ onSuccess: (data) => navigate(homeFor(data.user)) },
		);
	};

	// Already signed in (e.g. came back from a page) → go straight to the
	// portal for this role.
	if (isAuthed) {
		return <Navigate to={homeFor(user)} replace />;
	}

	return (
		<div className="admin-login-page">
			<div className="admin-login-card">
				{/* Brand Logo & Name */}
				<div className="admin-login-brand">
					<img src={logo} alt="Pink Paws Veterinary Clinic" />

					<div>
						<strong>Pink Paws</strong>
						<span>Veterinary Clinic</span>
					</div>
				</div>

				{/* Heading */}
				<div className="admin-login-heading">
					<p>WELCOME BACK</p>
					<h1>Sign in to your account</h1>
					<span>
						Clients and staff share one sign-in — we'll take you to the right
						portal.
					</span>
				</div>

				{/* Form */}
				<form onSubmit={handleLogin} className="admin-login-form">
					<div className="admin-login-field">
						<label htmlFor="login-email">Email Address</label>

						<input
							id="login-email"
							type="email"
							placeholder="Enter your email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="admin-login-field">
						<label htmlFor="login-password">Password</label>

						<div className="admin-password-wrapper">
							<input
								id="login-password"
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

					{error && (
						<div className="admin-login-error">
							{error}
							{unverified && (
								<>
									{" "}
									<button
										type="button"
										style={{
											background: "none",
											border: "none",
											padding: 0,
											font: "inherit",
											color: "var(--primary)",
											fontWeight: 700,
											cursor: "pointer",
										}}
										onClick={() =>
											navigate(
												`/verify-email?email=${encodeURIComponent(email.trim())}`,
											)
										}
									>
										Verify your email
									</button>
								</>
							)}
						</div>
					)}

					<button
						type="submit"
						className="admin-login-button"
						disabled={login?.isPending}
					>
						{login?.isPending ? "Signing in…" : "Sign In"}
					</button>

					<p
						style={{
							textAlign: "center",
							marginTop: 12,
							fontSize: 13,
							color: "var(--muted)",
						}}
					>
						<Link to="/forgot-password" style={{ color: "var(--muted)" }}>
							Forgot your password?
						</Link>
					</p>

					<p
						style={{
							textAlign: "center",
							marginTop: 12,
							fontSize: 13,
							color: "var(--muted)",
						}}
					>
						New to the portal?{" "}
						<Link
							to="/client/register"
							style={{ color: "var(--primary)", fontWeight: 700 }}
						>
							Create an account
						</Link>
					</p>
				</form>

				{/* Demo Account Credentials */}
				<div className="admin-login-demo">
					<span>Demo accounts</span>
					<p>client@pinkpaws.com · client123</p>
					<p>admin@pinkpaws.com · admin123</p>
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

			<div className="admin-login-side">
				<div className="admin-login-side-content">
					<span className="admin-login-side-label">PINK PAWS</span>

					<h2>
						Caring for pets.
						<br />
						Supporting their people.
					</h2>

					<p>
						One sign-in for everyone — pet owners and clinic staff. We recognise
						your account and take you to the right place.
					</p>
				</div>

				<div className="admin-login-side-footer">Client & Staff</div>
			</div>
		</div>
	);
}

export default Login;
