import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import logo from "../assets/logo/pink-paws-full.png";
import { useResetPassword } from "../hooks/useClientData";

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

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [done, setDone] = useState(false);

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
	const mismatch =
		confirm && confirm !== password ? "Passwords do not match." : "";
	const error = reset.error?.message || "";
	const canSubmit = password.length >= 6 && confirm === password && !noToken;

	// After a successful reset the token is spent — don't let a refresh
	// re-post it.
	useEffect(() => {
		if (reset.isSuccess) setDone(true);
	}, [reset.isSuccess]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!canSubmit) return;
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
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="new-password"
										required
										minLength={6}
										autoFocus
									/>
								</div>

								<div className="admin-login-field">
									<label htmlFor="reset-confirm">Confirm Password</label>

									<input
										id="reset-confirm"
										type="password"
										placeholder="Repeat your new password"
										value={confirm}
										onChange={(e) => setConfirm(e.target.value)}
										autoComplete="new-password"
										required
										minLength={6}
									/>
								</div>

								{(mismatch || error) && (
									<div className="admin-login-error">{mismatch || error}</div>
								)}

								<button
									type="submit"
									className="admin-login-button"
									disabled={!canSubmit || reset.isPending}
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
