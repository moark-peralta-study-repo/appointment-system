import { useState } from "react";
import { useChangePassword } from "../../hooks/useClientData";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";
import {
	required,
	minLength,
	passwordsMatch,
	firstError,
	collectErrors,
} from "../../utils/validate";

function PasswordSection() {
	const changePassword = useChangePassword();
	const [form, setForm] = useState({ current: "", next: "", confirm: "" });
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		if (errors[k]) setErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
	};
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState({});

	const submit = (e) => {
		e.preventDefault();
		const found = collectErrors({
			current: required(form.current, "Current password"),
			next: firstError(
				required(form.next, "New password"),
				minLength(form.next, 6, "New password")
			),
			confirm: firstError(
				required(form.confirm, "Confirmation"),
				passwordsMatch(form.next, form.confirm)
			),
		});
		setErrors(found);
		if (Object.keys(found).length) return;
		changePassword.mutate(
			{ currentPassword: form.current, password: form.next },
			{
				onSuccess: () => {
					setDone(true);
					setForm({ current: "", next: "", confirm: "" });
					setErrors({});
					setTimeout(() => setDone(false), 2400);
				},
			},
		);
	};

	return (
		<section className="admin-panel client-password-panel">
			<div className="settings-panel-header">
				<div>
					<h2>Password</h2>
					<p>
						Use at least 6 characters. Your session stays signed in after the
						change.
					</p>
				</div>
				{done ? (
					<span className="client-save-badge">
						<FiCheck size={12} /> Updated
					</span>
				) : null}
			</div>

			<form onSubmit={submit} className="admin-form-grid" noValidate>
				<div className="admin-form-field full">
					<label>Current password</label>
					<input
						type="password"
						value={form.current}
						onChange={set("current")}
						autoComplete="current-password"
						className={errors.current ? "invalid" : ""}
						aria-invalid={errors.current ? true : undefined}
						aria-describedby={errors.current ? "pwd-current-err" : undefined}
						required
					/>
					{errors.current && (
						<p id="pwd-current-err" className="field-error" role="alert">{errors.current}</p>
					)}
				</div>

				<div className="admin-form-field">
					<label>New password</label>
					<input
						type="password"
						value={form.next}
						onChange={set("next")}
						autoComplete="new-password"
						className={errors.next ? "invalid" : ""}
						aria-invalid={errors.next ? true : undefined}
						aria-describedby={errors.next ? "pwd-next-err" : undefined}
						minLength={6}
						required
					/>
					{errors.next && (
						<p id="pwd-next-err" className="field-error" role="alert">{errors.next}</p>
					)}
				</div>

				<div className="admin-form-field">
					<label>Confirm new password</label>
					<input
						type="password"
						value={form.confirm}
						onChange={set("confirm")}
						autoComplete="new-password"
						className={errors.confirm ? "invalid" : ""}
						aria-invalid={errors.confirm ? true : undefined}
						aria-describedby={errors.confirm ? "pwd-confirm-err" : undefined}
						required
					/>
					{errors.confirm && (
						<p id="pwd-confirm-err" className="field-error" role="alert">{errors.confirm}</p>
					)}
				</div>

				{changePassword.error && (
					<div className="admin-form-error full">
						<FiAlertTriangle size={13} /> {changePassword.error.message}
					</div>
				)}

				<div className="settings-actions">
					<button
						type="submit"
						className="admin-primary-button"
						disabled={changePassword.isPending}
					>
						{changePassword.isPending ? "Updating…" : "Update password"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default PasswordSection;
