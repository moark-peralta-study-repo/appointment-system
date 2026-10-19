import { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useRegister, useVerifyOtp } from "../../hooks/useClientData";
import {
	required,
	emailValue,
	phoneValue,
	newPasswordValue,
	firstError,
	collectErrors,
} from "../../utils/validate";
import { isPortal } from "../../utils/roles";

// Step 1 — make sure there's a verified pet-owner account behind the booking.
//
// Three modes, one step:
//   register → create account (server emails a 6-digit code, no token yet)
//   otp      → enter that code; verifying is what issues the session
//   login    → existing account signs in
//
// The wizard can't continue past this step until the user is authed — the
// next steps call /appointments and /pets with the JWT — which is why
// registration is a two-part flow here instead of a single submit.
function BookingAccountStep({ onDone }) {
	const { user, isAuthed, login } = useAuth();
	const register = useRegister();
	const verify = useVerifyOtp();
	const navigate = useNavigate();

	const [mode, setMode] = useState("register"); // "register" | "otp" | "login"
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});
	const [otp, setOtp] = useState("");
	const [errors, setErrors] = useState({});
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		if (errors[k]) setErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
	};

	// Already a signed-in owner → no forms needed. (Portal staff —
	// vet/front desk/admin — book on behalf of owners, so they keep the
	// account forms on the public wizard.)
	if (isAuthed && !isPortal(user?.role)) {
		return (
			<div className="appointment-card">
				<section className="form-section">
					<div className="booking-step-banner">
						<span className="booking-step-banner-icon">
							<FaCheck size={16} />
						</span>
						<div>
							<h2>Welcome back, {user.name}</h2>
							<p className="form-description">
								You're signed in as {user.email}. Let's pick up with your pets.
							</p>
						</div>
					</div>
				</section>

				<div className="appointment-actions">
					<button
						type="button"
						className="cancel-button"
						onClick={() => navigate("/client/dashboard")}
					>
						Cancel
					</button>

					<button type="button" className="continue-button" onClick={onDone}>
						Continue <FaArrowRight />
					</button>
				</div>
			</div>
		);
	}

	const error =
		mode === "register"
			? register.error?.message
			: mode === "otp"
				? verify.error?.message
				: login.error?.message;
	const busy =
		mode === "register" ? register.isPending : mode === "otp" ? verify.isPending : login.isPending;

	function submit(e) {
		e.preventDefault();
		const found = collectErrors(
			mode === "login"
				? {
							email: firstError(required(form.email, "Email"), emailValue(form.email)),
							password: required(form.password, "Password"),
				  }
				: {
							name: required(form.name, "Name"),
							email: firstError(required(form.email, "Email"), emailValue(form.email)),
							phone: phoneValue(form.phone),
							password: firstError(
								required(form.password, "Password"),
								newPasswordValue(form.password, { email: form.email, name: form.name })
							),
				  }
		);
		setErrors(found);
		if (Object.keys(found).length) return;
		if (mode === "register") {
			// Success → the code is in the user's inbox; show the OTP field.
			register.mutate(
				{
					name: form.name.trim(),
					email: form.email.trim(),
					phone: form.phone.trim() || undefined,
					password: form.password,
				},
				{ onSuccess: () => setMode("otp") },
			);
		} else if (mode === "otp") {
			// Verifying returns the JWT (useVerifyOtp stores it) → continue.
			verify.mutate(
				{ email: form.email.trim(), otp: otp.trim() },
				{ onSuccess: onDone },
			);
		} else {
			login.mutate({ email: form.email.trim(), password: form.password }, { onSuccess: onDone });
		}
	}

	// The post-register OTP sub-mode: no tabs, just the code.
	if (mode === "otp") {
		return (
			<div className="appointment-card">
				<section className="form-section">
					<div className="booking-step-banner">
						<span className="booking-step-banner-icon">
							<FaCheck size={16} />
						</span>
						<div>
							<h2>Account created</h2>
							<p className="form-description">
								We emailed a 6-digit code to {form.email.trim()}. Enter it to
								activate your account and continue booking.
							</p>
						</div>
					</div>

					<form onSubmit={submit} noValidate>
						<div className="appointment-field">
							<label>Verification code *</label>

							<input
								type="text"
								inputMode="numeric"
								pattern="\d{6}"
								name="otp"
								placeholder="6-digit code"
								value={otp}
								onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
								autoComplete="one-time-code"
								required
							/>
						</div>

						{error && (
							<div className="admin-form-error">
								<FiAlertTriangle size={13} /> {error}
							</div>
						)}

						<div className="appointment-actions">
							<button
								type="button"
								className="cancel-button"
								onClick={() => navigate("/")}
							>
								Cancel
							</button>

							<button type="submit" className="continue-button" disabled={busy || otp.length !== 6}>
								{busy ? "One moment…" : "Verify & continue"}
								<FaArrowRight />
							</button>
						</div>
					</form>
				</section>
			</div>
		);
	}

	return (
		<div className="appointment-card">
			<section className="form-section">
				<h2>Your account</h2>

				<p className="form-description">
					Bookings are tied to a pet-owner account, so you can manage and cancel
					them later. New here? Create one — it takes 30 seconds.
				</p>

				{/* MODE TABS */}
				<div className="booking-step-tabs" role="tablist">
					<button
						type="button"
						role="tab"
						className={mode === "register" ? "active" : ""}
						onClick={() => setMode("register")}
					>
						Create account
					</button>

					<button
						type="button"
						role="tab"
						className={mode === "login" ? "active" : ""}
						onClick={() => setMode("login")}
					>
						Sign in
					</button>
				</div>

				<form onSubmit={submit} noValidate>
					{mode === "register" && (
						<div className="appointment-field">
							<label>Your name *</label>

							<input
								type="text"
								name="name"
								value={form.name}
								onChange={set("name")}
								placeholder="e.g. Mocha Peralta"
								autoComplete="name"
								className={errors.name ? "invalid" : ""}
								aria-invalid={errors.name ? true : undefined}
								required
							/>

							{errors.name && (
							<p className="field-error" role="alert">{errors.name}</p>
							)}
						</div>
					)}

					<div className="appointment-field">
						<label>Email *</label>

						<input
							type="email"
							name="email"
							value={form.email}
							onChange={set("email")}
							placeholder="you@example.com"
							autoComplete="email"
							className={errors.email ? "invalid" : ""}
							aria-invalid={errors.email ? true : undefined}
							required
						/>

						{errors.email && (
						<p className="field-error" role="alert">{errors.email}</p>
						)}
					</div>

					{mode === "register" && (
						<div className="appointment-field">
							<label>Phone</label>

							<input
								type="tel"
								name="phone"
								value={form.phone}
								onChange={set("phone")}
								placeholder="+63 917 000 0000"
								autoComplete="tel"
								className={errors.phone ? "invalid" : ""}
								aria-invalid={errors.phone ? true : undefined}
							/>

							{errors.phone && (
							<p className="field-error" role="alert">{errors.phone}</p>
							)}
						</div>
					)}

					<div className="appointment-field">
						<label>Password *</label>

						<input
							type="password"
							name="password"
							value={form.password}
							onChange={set("password")}
							placeholder={
								mode === "register" ? "At least 8 characters" : "Your password"
							}
							autoComplete={
								mode === "register" ? "new-password" : "current-password"
							}
							className={errors.password ? "invalid" : ""}
							aria-invalid={errors.password ? true : undefined}
							required
						/>

						{errors.password && (
						<p className="field-error" role="alert">{errors.password}</p>
						)}
					</div>

					{error && (
						<div className="admin-form-error">
							<FiAlertTriangle size={13} /> {error}
						</div>
					)}

					<div className="appointment-actions">
						<button
							type="button"
							className="cancel-button"
							onClick={() => navigate("/")}
						>
							Cancel
						</button>

						<button type="submit" className="continue-button" disabled={busy}>
							{busy
								? "One moment…"
								: mode === "register"
									? "Create account"
									: "Sign in & continue"}
							<FaArrowRight />
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default BookingAccountStep;
