import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "../../assets/logo/pink-paws-full.png";
import { useAuth } from "../../context/useAuth";
import { useRegister } from "../../hooks/useClientData";
import {
	required,
	emailValue,
	minLength,
	passwordsMatch,
	phoneValue,
	firstError,
	collectErrors,
} from "../../utils/validate";

// Public pet-owner sign-up. Registration issues a session token
// immediately (no email verification step on this branch). The booking
// wizard's "create account" tab calls the same API.
function ClientRegister() {
	const navigate = useNavigate();
	const { isAuthed } = useAuth();
	const register = useRegister();

	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirm: "",
	});
	const [errors, setErrors] = useState({});
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		if (errors[k]) setErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
	};

	// Inline field errors: name, email, password format/length, confirm match.
	// The banner below the form is reserved for server messages (e.g.
	// "an account with this email already exists").
	const validate = () =>
		collectErrors({
			name: required(form.name, "Name"),
			email: firstError(required(form.email, "Email"), emailValue(form.email)),
			phone: phoneValue(form.phone),
			password: firstError(
				required(form.password, "Password"),
				minLength(form.password, 6, "Password")
			),
			confirm: firstError(
				required(form.confirm, "Confirmation"),
				passwordsMatch(form.password, form.confirm)
			),
		});

	const serverError = register.error?.message || "";

	const handleRegister = (e) => {
		e.preventDefault();
		const found = validate();
		setErrors(found);
		if (Object.keys(found).length) return;
		const email = form.email.trim();
		register.mutate(
			{
				name: form.name.trim(),
				email,
				phone: form.phone.trim() || undefined,
				password: form.password,
			},
			{
				// Session issued immediately — pre-OTP branch has no verify step.
				onSuccess: () => navigate("/client/dashboard"),
			},
		);
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
					<p>CLIENT PORTAL</p>
					<h1>Create your account</h1>
					<span>One account for your pets, appointments, and records.</span>
				</div>

				<form onSubmit={handleRegister} className="admin-login-form" noValidate>
					<div className="admin-login-field">
						<label htmlFor="reg-name">Full Name</label>

						<input
							id="reg-name"
							type="text"
							placeholder="e.g. Mocha Peralta"
							value={form.name}
							onChange={set("name")}
							autoComplete="name"
							className={errors.name ? "invalid" : ""}
							aria-invalid={errors.name ? true : undefined}
							aria-describedby={errors.name ? "reg-name-err" : undefined}
							required
						/>

						{errors.name && (
							<p id="reg-name-err" className="field-error" role="alert">{errors.name}</p>
						)}
					</div>

					<div className="admin-login-field">
						<label htmlFor="reg-email">Email Address</label>

						<input
							id="reg-email"
							type="email"
							placeholder="Enter your email address"
							value={form.email}
							onChange={set("email")}
							autoComplete="email"
							className={errors.email ? "invalid" : ""}
							aria-invalid={errors.email ? true : undefined}
							aria-describedby={errors.email ? "reg-email-err" : undefined}
							required
						/>

						{errors.email && (
							<p id="reg-email-err" className="field-error" role="alert">{errors.email}</p>
						)}
					</div>

					<div className="admin-login-field">
						<label htmlFor="reg-phone">Phone</label>

						<input
							id="reg-phone"
							type="tel"
							placeholder="+63 917 000 0000"
							value={form.phone}
							onChange={set("phone")}
							autoComplete="tel"
							className={errors.phone ? "invalid" : ""}
							aria-invalid={errors.phone ? true : undefined}
							aria-describedby={errors.phone ? "reg-phone-err" : undefined}
						/>

						{errors.phone && (
							<p id="reg-phone-err" className="field-error" role="alert">{errors.phone}</p>
						)}
					</div>

					<div className="admin-login-field">
						<label htmlFor="reg-password">Password</label>

						<input
							id="reg-password"
							type="password"
							placeholder="At least 6 characters"
							value={form.password}
							onChange={set("password")}
							autoComplete="new-password"
							className={errors.password ? "invalid" : ""}
							aria-invalid={errors.password ? true : undefined}
							aria-describedby={errors.password ? "reg-password-err" : undefined}
							required
							minLength={6}
						/>

						{errors.password && (
							<p id="reg-password-err" className="field-error" role="alert">{errors.password}</p>
						)}
					</div>

					<div className="admin-login-field">
						<label htmlFor="reg-confirm">Confirm Password</label>

						<input
							id="reg-confirm"
							type="password"
							placeholder="Repeat your password"
							value={form.confirm}
							onChange={set("confirm")}
							autoComplete="new-password"
							className={errors.confirm ? "invalid" : ""}
							aria-invalid={errors.confirm ? true : undefined}
							aria-describedby={errors.confirm ? "reg-confirm-err" : undefined}
							required
							minLength={6}
						/>

						{errors.confirm && (
							<p id="reg-confirm-err" className="field-error" role="alert">{errors.confirm}</p>
						)}
					</div>

					{serverError && (
						<div className="admin-login-error">{serverError}</div>
					)}

					<button
						type="submit"
						className="admin-login-button"
						disabled={register.isPending}
					>
						{register.isPending ? "Creating account…" : "Create Account"}
					</button>
				</form>

				<p
					style={{
						textAlign: "center",
						marginTop: 14,
						fontSize: 13,
						color: "var(--muted)",
					}}
				>
					Already have an account?{" "}
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
						onClick={() => navigate("/login")}
					>
						Sign in
					</button>
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
						Your pets' health,
						<br />
						in one place.
					</h2>

					<p>
						Book visits, keep your pets' records up to date, and see notes from
						your veterinarian — all from a single account.
					</p>
				</div>

				<div className="admin-login-side-footer">Client Portal</div>
			</div>
		</div>
	);
}

export default ClientRegister;
