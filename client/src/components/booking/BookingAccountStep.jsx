import { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";
import { useRegister } from "../../hooks/useClientData";

// Step 1 — make sure there's a pet-owner account behind the booking.
//
// If the visitor already has a signed-in owner account (they may have come
// in from the client portal), we skip the forms entirely. Otherwise they
// can create an account or sign in with an existing one; the booking is
// then tied to THAT account so they can manage it in the client portal.
function BookingAccountStep({ onDone }) {
	const { user, isAuthed, login } = useAuth();
	const register = useRegister();

	const [mode, setMode] = useState("register"); // "register" | "login"
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	// Already a signed-in owner → no forms needed.
	if (isAuthed && user?.role !== "vet") {
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
					<a href="/" className="cancel-button">
						Cancel
					</a>

					<button type="button" className="continue-button" onClick={onDone}>
						Continue <FaArrowRight />
					</button>
				</div>
			</div>
		);
	}

	const error =
		mode === "register" ? register.error?.message : login.error?.message;
	const busy = mode === "register" ? register.isPending : login.isPending;

	function submit(e) {
		e.preventDefault();
		if (mode === "register") {
			register.mutate(
				{
					name: form.name.trim(),
					email: form.email.trim(),
					phone: form.phone.trim() || undefined,
					password: form.password,
				},
				{ onSuccess: onDone },
			);
		} else {
			login.mutate(
				{ email: form.email.trim(), password: form.password },
				{ onSuccess: onDone },
			);
		}
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
								required
							/>
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
							required
						/>
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
							/>
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
								mode === "register" ? "At least 6 characters" : "Your password"
							}
							autoComplete={
								mode === "register" ? "new-password" : "current-password"
							}
							required
						/>
					</div>

					{error && (
						<div className="admin-form-error">
							<FiAlertTriangle size={13} /> {error}
						</div>
					)}

					<div className="appointment-actions">
						<a href="/" className="cancel-button">
							Cancel
						</a>

						<button type="submit" className="continue-button" disabled={busy}>
							{busy
								? "One moment…"
								: mode === "register"
									? "Create account & continue"
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
