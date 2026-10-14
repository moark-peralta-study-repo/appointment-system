import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import logo from "../assets/logo/pink-paws-full.png";
import { useResetPassword } from "../hooks/useClientData";
import { useAuth } from "../context/useAuth";
import { required, minLength, passwordsMatch, firstError, collectErrors } from "../utils/validate";

// /reset-password?token=... — the landing page of the email link. The token
// is a signed JWT (1h, purpose "password-reset"). Setting a new password
// is one-shot: the server clears the token on success, so a reused link
// fails cleanly. If the link is missing/expired we just offer to request a
// fresh one.
function ResetPassword() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const token = params.get("token") || "";
	const reset = useResetPassword();
	const { logout } = useAuth();

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState({});

	const noToken = token.length === 0;
	const serverExpired = reset.isError && reset.error?.status === 410;

	// The token is a signed JWT — decode its payload (no verification,
	// just the exp claim) so a dead link shows the expired state
	// immediately instead of waiting for a failed submit.
	const expired =
		serverExpired ||
		(() => {
			try {
				const payload = JSON.parse(
					atob(token.replace(/-/g, "+").replace(/_/g, "/").split(".")[1]),
				);
				return (
					typeof payload.exp === "number" && payload.exp * 1000 < Date.now()
				);
			} catch {
				return false;
			}
		})();
	const serverError = reset.error?.message || "";

	// After a successful reset the token is spent — don't let a refresh
	// re-post it.
	useEffect(() => {
		if (reset.isSuccess) setDone(true);
	}, [reset.isSuccess]);

	// The password changed, so any pre-existing session token was issued
	// against the OLD password — drop it. Without this, "Continue to sign in"
	// lands on /login, which sees you're still authed and auto-bounces you to
	// the dashboard instead of asking for the new password.
	useEffect(() => {
		if (reset.isSuccess) logout();
	}, [reset.isSuccess, logout]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const found = collectErrors({
			password: firstError(
				required(password, "Password"),
				minLength(password, 6, "Password")
			),
			confirm: firstError(
				required(confirm, "Confirmation"),
				passwordsMatch(password, confirm)
			),
		});
		setErrors(found);
		if (Object.keys(found).length) return;
		reset.mutate({ token, password }, { onSuccess: () => setDone(true) });
	};

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
					<h1>Choose a new password</h1>
					<span>
						{done
							? "Your password has been updated. You can sign in now."
							: noToken
								? "This reset link is incomplete — request a new one."
								: expired
									? "This link has expired — request a fresh one."
									: "Enter a new password. It must be at least 6 characters."}
					</span>
				</div>

				{done ? (
					<div style={{ textAlign: "center", marginTop: 8 }}>
						<button
							type="button"
							className="admin-login-button"
							onClick={() => navigate("/login")}
						>
							Continue to sign in
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="admin-login-form" noValidate>
						{noToken || expired ? (
							<button
								type="button"
								className="admin-primary-button"
								style={{ width: "100%" }}
								onClick={() => navigate("/forgot-password")}
							>
								Request a new reset link
							</button>
						) : (
							<>

								<div className="admin-login-field">
									<label htmlFor="reset-password">New Password</label>

									<input
										id="reset-password"
										type="password"
										placeholder="At least 6 characters"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (errors.password) setErrors((prev) => { const next = { ...prev }; delete next.password; return next; });
										}}
										autoComplete="new-password"
										className={errors.password ? "invalid" : ""}
										aria-invalid={errors.password ? true : undefined}
										aria-describedby={errors.password ? "reset-password-err" : undefined}
										required
										minLength={6}
										autoFocus
									/>

									{errors.password && (
										<p id="reset-password-err" className="field-error" role="alert">{errors.password}</p>
									)}
								</div>

								<div className="admin-login-field">
									<label htmlFor="reset-confirm">Confirm Password</label>

									<input
										id="reset-confirm"
										type="password"
										placeholder="Repeat your new password"
										value={confirm}
										onChange={(e) => {
											setConfirm(e.target.value);
											if (errors.confirm) setErrors((prev) => { const next = { ...prev }; delete next.confirm; return next; });
										}}
										autoComplete="new-password"
										className={errors.confirm ? "invalid" : ""}
										aria-invalid={errors.confirm ? true : undefined}
										aria-describedby={errors.confirm ? "reset-confirm-err" : undefined}
										required
										minLength={6}
									/>

									{errors.confirm && (
										<p id="reset-confirm-err" className="field-error" role="alert">{errors.confirm}</p>
									)}
								</div>

								{serverError && (
									<div className="admin-login-error">{serverError}</div>
								)}

								<button
									type="submit"
									className="admin-login-button"
									disabled={reset.isPending}
								>
									{reset.isPending ? "Updating…" : "Reset Password"}
								</button>
							</>
						)}
					</form>
				)}

				<p
					style={{
						textAlign: "center",
						marginTop: 14,
						fontSize: 13,
						color: "var(--muted)",
					}}
				>
					<Link
						to="/login"
						style={{ color: "var(--primary)", fontWeight: 700 }}
					>
						Back to sign in
					</Link>
				</p>
			</div>

			<div className="admin-login-side" style={{ order: 1 }}>
				<div className="admin-login-side-content">
					<span className="admin-login-side-label">PINK PAWS</span>

					<h2>
						Safer is simpler.
						<br />
						Set it and forget it.
					</h2>

					<p>
						Use a password you don't reuse elsewhere. We only store a hash of it
						— even our team can't read your real one.
					</p>
				</div>

				<div className="admin-login-side-footer">Client Portal</div>
			</div>
		</div>
	);
}

export default ResetPassword;
