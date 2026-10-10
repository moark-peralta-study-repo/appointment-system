import { useState } from "react";
import { useChangePassword } from "../../hooks/useClientData";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";


function PasswordSection() {
	const changePassword = useChangePassword();
	const [form, setForm] = useState({ current: "", next: "", confirm: "" });
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
	const [done, setDone] = useState(false);

	const mismatch = form.confirm && form.confirm !== form.next;
	const canSubmit =
		form.current && form.next.length >= 6 && form.confirm === form.next && !changePassword.isPending;

	const submit = (e) => {
		e.preventDefault();
		if (mismatch) return;
		changePassword.mutate(
			{ currentPassword: form.current, password: form.next },
			{
				onSuccess: () => {
					setDone(true);
					setForm({ current: "", next: "", confirm: "" });
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
					<p>Use at least 6 characters. Your session stays signed in after the change.</p>
				</div>
				{done ? <span className="client-save-badge"><FiCheck size={12} /> Updated</span> : null}
			</div>

			<form onSubmit={submit} className="admin-form-grid">
				<div className="admin-form-field full">
					<label>Current password</label>
					<input
						type="password"
						value={form.current}
						onChange={set("current")}
						autoComplete="current-password"
						required
					/>
				</div>

				<div className="admin-form-field">
					<label>New password</label>
					<input
						type="password"
						value={form.next}
						onChange={set("next")}
						autoComplete="new-password"
						minLength={6}
						required
					/>
				</div>

				<div className="admin-form-field">
					<label>Confirm new password</label>
					<input
						type="password"
						value={form.confirm}
						onChange={set("confirm")}
						autoComplete="new-password"
						required
					/>
					{mismatch && <small style={{ color: "var(--danger)" }}>Passwords do not match.</small>}
				</div>

				{changePassword.error && (
					<div className="admin-form-error full"><FiAlertTriangle size={13} /> {changePassword.error.message}</div>
				)}

				<div className="settings-actions full">
					<button
						type="submit"
						className="admin-primary-button"
						disabled={!canSubmit}
					>
						{changePassword.isPending ? "Updating…" : "Update password"}
					</button>
				</div>
			</form>
		</section>
	);
}


export default PasswordSection;
