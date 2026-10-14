import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";
import logo from "../assets/logo/pink-paws-full.png";
import { useAuth } from "../context/useAuth";
import { useVerifyOtp, useResendOtp } from "../hooks/useClientData";
import { required, emailValue, otpValue, firstError, collectErrors } from "../utils/validate";

// Confirm a just-registered account: enter the 6-digit code from the
// email. The server stores only the code's hash; codes expire after
// 15 minutes. Reaching here signed-in (e.g. verified on another tab)
// bounces to the dashboard.
//
// Also reachable directly: if someone registered, closed the tab, and
// returns to sign in, the login error tells them to check their email —
// they can come here (email prefilled from ?email=) and enter the code.
function VerifyEmail() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const { isAuthed } = useAuth();

	const verify = useVerifyOtp();
	const resend = useResendOtp();

	const [email, setEmail] = useState(params.get("email") || "");
	const [otp, setOtp] = useState("");
	const [cooldown, setCooldown] = useState(0);
	const [errors, setErrors] = useState({});

	// 60s resend cooldown, mirrored client-side (the server enforces it too).
	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setInterval(() => setCooldown((c) => c - 1), 1000);
		return () => clearInterval(t);
	}, [cooldown]);

	if (isAuthed) {
		return <Navigate to="/client/dashboard" replace />;
	}

	const serverError = verify.error?.message || resend.error?.message || "";

	const handleVerify = (e) => {
		e.preventDefault();
		const found = collectErrors({
			email: firstError(required(email, "Email"), emailValue(email)),
			otp: firstError(required(otp, "Code"), otpValue(otp)),
		});
		setErrors(found);
		if (Object.keys(found).length) return;
		verify.mutate(
			{ email: email.trim(), otp: otp.trim() },
			{ onSuccess: () => navigate("/client/dashboard") },
		);
	};

	const handleResend = () => {
		resend.mutate(email.trim(), {
			onSuccess: () => setCooldown(60),
		});
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
					<p>ALMOST DONE</p>
					<h1>Verify your email</h1>
					<span>
						We sent a 6-digit code to your inbox. It expires in 15 minutes.
					</span>
				</div>

				<form onSubmit={handleVerify} className="admin-login-form" noValidate>
					<div className="admin-login-field">
						<label htmlFor="verify-email">Email Address</label>

						<input
							id="verify-email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (errors.email) setErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
							}}
							autoComplete="email"
							className={errors.email ? "invalid" : ""}
							aria-invalid={errors.email ? true : undefined}
							aria-describedby={errors.email ? "verify-email-err" : undefined}
							required
						/>

						{errors.email && (
						<p id="verify-email-err" className="field-error" role="alert">{errors.email}</p>
						)}
					</div>

					<div className="admin-login-field">
						<label htmlFor="verify-otp">Verification Code</label>

						<input
							id="verify-otp"
							type="text"
							inputMode="numeric"
							pattern="\d{6}"
							placeholder="6-digit code"
							value={otp}
							onChange={(e) => {
								setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
								if (errors.otp) setErrors((prev) => { const next = { ...prev }; delete next.otp; return next; });
							}}
							autoComplete="one-time-code"
							className={errors.otp ? "invalid" : ""}
							aria-invalid={errors.otp ? true : undefined}
							aria-describedby={errors.otp ? "verify-otp-err" : undefined}
							required
						/>

						{errors.otp && (
						<p id="verify-otp-err" className="field-error" role="alert">{errors.otp}</p>
						)}
					</div>

					{serverError && <div className="admin-login-error">{serverError}</div>}

					<button
						type="submit"
						className="admin-login-button"
						disabled={verify.isPending}
					>
						{verify.isPending ? "Verifying…" : "Verify Email"}
					</button>

					<p
						style={{
							textAlign: "center",
							marginTop: 12,
							fontSize: 13,
							color: "var(--muted)",
						}}
					>
						Didn't get the code?{" "}
						<button
							type="button"
							style={{
								background: "none",
								border: "none",
								padding: 0,
								font: "inherit",
								color: "var(--primary)",
								fontWeight: 700,
								cursor: cooldown > 0 ? "default" : "pointer",
							}}
							disabled={cooldown > 0 || resend.isPending || !email.trim()}
							onClick={handleResend}
						>
							{resend.isPending
								? "Sending…"
								: cooldown > 0
									? `Resend in ${cooldown}s`
									: "Resend code"}
						</button>
					</p>
				</form>

				<p
					style={{
						textAlign: "center",
						marginTop: 14,
						fontSize: 13,
						color: "var(--muted)",
					}}
				>
					Already verified?{" "}
					<Link
						to="/login"
						style={{ color: "var(--primary)", fontWeight: 700 }}
					>
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
						One quick step.
						<br />
						Then you're in.
					</h2>

					<p>
						Verifying your email keeps your account safe and confirms where we
						send appointment updates.
					</p>
				</div>

				<div className="admin-login-side-footer">Client Portal</div>
			</div>
		</div>
	);
}

export default VerifyEmail;
