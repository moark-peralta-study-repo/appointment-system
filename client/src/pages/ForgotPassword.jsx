import { useState } from "react";
import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";
import logo from "../assets/logo/pink-paws-mark-sq-256.png";
import { useAuth } from "../context/useAuth";
import { useForgotPassword } from "../hooks/useClientData";

// "Forgot password?" — email a signed reset link. The server always
// answers 200 (unknown emails included) so the form can't be used to
// probe which addresses exist; the success state just says "check your
// inbox" either way.
function ForgotPassword() {
	const navigate = useNavigate();
	const { isAuthed } = useAuth();
	const forgot = useForgotPassword();

	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);

	const error = forgot.error?.message || "";

	const handleSend = (e) => {
		e.preventDefault();
		if (!email.trim()) return;
		forgot.mutate(email.trim(), { onSuccess: () => setSent(true) });
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
				flexWrap: "nowrap",
			}}
		>
			<div className="admin-login-card" style={{ order: 2 }}>
				<div className="admin-login-brand">
					<img src={logo} alt="Pink Paws Veterinary Clinic" />

					<div>
						<strong>Pink Paws</strong>
						<span>Veterinary Clinic</span>
					</div>
				</div>

				<div className="admin-login-heading">
					<p>RESET PASSWORD</p>
					<h1>Forgot your password?</h1>
					<span>
						{sent
							? "If an account exists for that address, a reset link is on its way. It expires in 1 hour."
							: "Enter the email on your account and we'll send you a link to choose a new password."}
					</span>
				</div>

				{!sent ? (
					<form onSubmit={handleSend} className="admin-login-form" noValidate>
						<div className="admin-login-field">
							<label htmlFor="forgot-email">Email Address</label>

							<input
								id="forgot-email"
								type="email"
								placeholder="Enter your email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								required
								autoFocus
							/>
						</div>

						{error && <div className="admin-login-error">{error}</div>}

						<button
							type="submit"
							className="admin-login-button"
							disabled={!email.trim() || forgot.isPending}
						>
							{forgot.isPending ? "Sending…" : "Send Reset Link"}
						</button>
					</form>
				) : (
					<div style={{ textAlign: "center", marginTop: 8 }}>
						<p style={{ fontSize: 13, color: "var(--muted)" }}>
							Didn't get it? Check the spam folder, or request another
							link.
						</p>
						<button
							type="button"
							className="admin-secondary-button"
							style={{ marginTop: 10 }}
							onClick={() => setSent(false)}
						>
							Request another link
						</button>
					</div>
				)}

				<p
					style={{
						textAlign: "center",
						marginTop: 14,
						fontSize: 13,
						color: "var(--muted)",
					}}
				>
					Remembered it?{" "}
					<Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
						Sign in
					</Link>
				</p>

				<button
					type="button"
					className="admin-back-button"
					onClick={() => navigate("/")}
				>
					← Back to main website
				</button>
			</div>

			<div className="admin-login-side" style={{ order: 1 }}>
				<div className="admin-login-side-content">
					<span className="admin-login-side-label">PINK PAWS</span>

					<h2>
						Lock yourself out?
						<br />
						Happens to the best of us.
					</h2>

					<p>
						Your new password only takes effect when you set it — until
						then, the old one still works for you and only you.
					</p>
				</div>

				<div className="admin-login-side-footer">Client Portal</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
