import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useUpdateMyProfile } from "../../hooks/useClientData";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";
import { required, emailValue, phoneValue, firstError, useFieldErrors } from "../../utils/validate";

function AccountSection() {
	const { user } = useAuth();
	const updateProfile = useUpdateMyProfile();
	const [saved, setSaved] = useState(false);
	const saveTimer = useRef(null);
	const [form, setForm] = useState({
		name: user?.name ?? "",
		phone: user?.phone ?? "",
		email: user?.email ?? "",
	});
	const [errors, validate, clear] = useFieldErrors();
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		clear(k)();
	};

	// Re-sync if the signed-in account changes (e.g. after re-login).
	useEffect(() => {
		setForm({
			name: user?.name ?? "",
			phone: user?.phone ?? "",
			email: user?.email ?? "",
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?._id]);

	const dirty =
		form.name !== user?.name ||
		form.phone !== (user?.phone ?? "") ||
		form.email !== user?.email;

	const submit = () => {
		const found = validate({
			name: required(form.name, "Full name"),
			email: firstError(required(form.email, "Email"), emailValue(form.email)),
			phone: phoneValue(form.phone),
		});
		if (Object.keys(found).length) return;
		updateProfile.mutate(
			{
				name: form.name.trim(),
				phone: form.phone.trim(),
				email: form.email.trim(),
			},
			{
				onSuccess: () => {
					setSaved(true);
					clearTimeout(saveTimer.current);
					saveTimer.current = setTimeout(() => setSaved(false), 1800);
				},
			},
		);
	};

	return (
		<section className="admin-panel client-profile-account">
			<div className="settings-panel-header">
				<div>
					<h2>Account Details</h2>
					<p>Your name and contact info, as the clinic sees them.</p>
				</div>
				{updateProfile.isPending ? (
					<span className="client-save-badge">Saving…</span>
				) : saved ? (
					<span className="client-save-badge">
						<FiCheck size={12} /> Saved
					</span>
				) : null}
			</div>

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>
						Full name <span>*</span>
					</label>
					<input
						value={form.name}
						onChange={set("name")}
						className={errors.name ? "invalid" : ""}
						aria-invalid={errors.name ? true : undefined}
					/>
					{errors.name && (
						<p className="field-error" role="alert">{errors.name}</p>
					)}
				</div>
				<div className="admin-form-field">
					<label>Phone</label>
					<input
						value={form.phone}
						onChange={set("phone")}
						className={errors.phone ? "invalid" : ""}
						aria-invalid={errors.phone ? true : undefined}
						placeholder="+63 917 000 0000"
					/>
					{errors.phone && (
						<p className="field-error" role="alert">{errors.phone}</p>
					)}
				</div>
				<div className="admin-form-field">
					<label>Email</label>
					<input
						type="email"
						value={form.email}
						onChange={set("email")}
						className={errors.email ? "invalid" : ""}
						aria-invalid={errors.email ? true : undefined}
					/>
					{errors.email && (
						<p className="field-error" role="alert">{errors.email}</p>
					)}
				</div>
			</div>

			{updateProfile.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {updateProfile.error.message}
				</div>
			)}

			<div className="settings-actions">
				<button
					className="admin-primary-button"
					type="button"
					disabled={updateProfile.isPending}
					onClick={submit}
				>
					{updateProfile.isPending ? "Saving…" : "Save changes"}
				</button>
			</div>
		</section>
	);
}

export default AccountSection;
