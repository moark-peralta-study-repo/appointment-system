import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "../../assets/logo/happy-paws-logo-2.png";
import { useAuth } from "../../context/useAuth";
import { useRegister } from "../../hooks/useClientData";

// Public pet-owner sign-up. On success the JWT is stored (useRegister) and
// the visitor lands straight in the client portal — the booking wizard's
// "create account" tab calls the same API.
function ClientRegister() {
	const navigate = useNavigate();
	const { isAuthed } = useAuth();
	const register = useRegister();

	const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const error = register.error?.message || "";
	const mismatch =
		form.confirm && form.confirm !== form.password ? "Passwords do not match." : "";
	const showFormError = error || mismatch;

	const handleRegister = (e) => {
		e.preventDefault();
		if (mismatch) return;
		register.mutate(
			{
				name: form.name.trim(),
				email: form.email.trim(),
				phone: form.phone.trim() || undefined,
				password: form.password,
			},
			{
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
			style={{ display: "flex", flexDirection: "row-reverse !important", flexWrap: "nowrap" }}
		>
			{/* 1. KANAN: Register Form */}
			<div className="admin-login-card" style={{ order: 2 }}>
				<div className="admin-login-brand">
					<img src={logo} alt="Mutuals Paws Veterinary Clinic" />

					<div>
						<strong>Mutuals Paws</strong>
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
							required
						/>
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
							required
						/>
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
						/>
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
							required
							minLength={6}
						/>
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
							required
							minLength={6}
						/>
					</div>

					{showFormError && <div className="admin-login-error">{showFormError}</div>}

					<button
						type="submit"
						className="admin-login-button"
						disabled={register.isPending}
					>
						{register.isPending ? "Creating account…" : "Create Account"}
					</button>
				</form>

				<p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--muted)" }}>
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
						onClick={() => navigate("/client/login")}
					>
						Sign in
					</button>
				</p>

				<button type="button" className="admin-back-button" onClick={() => navigate("/")}>
					← Back to main website
				</button>
			</div>

			{/* 2. KALIWA: Hero Banner */}
			<div className="admin-login-side" style={{ order: 1 }}>
				<div className="admin-login-side-content">
					<span className="admin-login-side-label">MUTUALS PAWS</span>

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
