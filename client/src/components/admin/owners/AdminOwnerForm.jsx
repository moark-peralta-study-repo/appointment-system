import { useState } from "react";
import AdminModal from "../AdminModal";
import { useCreateOwner } from "../../../hooks/useAdminData";
import { FiAlertTriangle } from "react-icons/fi";
import { required, emailValue, phoneValue, newPasswordValue, firstError, useFieldErrors } from "../../../utils/validate";

function AdminOwnerForm({ onClose }) {
	const register = useCreateOwner();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
	});
	const [errors, validate, clear] = useFieldErrors();
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		clear(k)();
	};

	const submit = () => {
		const found = validate({
			name: required(form.name, "Full name"),
			email: firstError(required(form.email, "Email"), emailValue(form.email)),
			phone: phoneValue(form.phone),
			password: firstError(required(form.password, "Password"), newPasswordValue(form.password)),
		});
		if (Object.keys(found).length) return;
		register.mutate(
			{
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
				phone: form.phone.trim() || undefined,
			},
			{ onSuccess: onClose },
		);
	};

	return (
		<AdminModal
			eyebrow="CLINIC MANAGEMENT"
			title="Add Pet Owner"
			onClose={onClose}
			footer={
				<>
					<button
						className="admin-secondary-button"
						type="button"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="admin-primary-button"
						type="button"
						disabled={register.isPending}
						onClick={submit}
					>
						{register.isPending ? "Creating…" : "Create Account"}
					</button>
				</>
			}
		>
			{register.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {register.error.message}
				</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>
						Full Name <span>*</span>
					</label>
					<input
						type="text"
						value={form.name}
						onChange={set("name")}
						className={errors.name ? "invalid" : ""}
						aria-invalid={errors.name ? true : undefined}
						placeholder="e.g. Maria Lopez"
					/>
					{errors.name && (
						<p className="field-error" role="alert">{errors.name}</p>
					)}
				</div>

				<div className="admin-form-field">
					<label>
						Email <span>*</span>
					</label>
					<input
						type="email"
						value={form.email}
						onChange={set("email")}
						className={errors.email ? "invalid" : ""}
						aria-invalid={errors.email ? true : undefined}
						placeholder="owner@email.com"
					/>
					{errors.email && (
						<p className="field-error" role="alert">{errors.email}</p>
					)}
				</div>

				<div className="admin-form-field">
					<label>Phone</label>
					<input
						type="text"
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

				<div className="admin-form-field full">
					<label>
						Portal Password{" "}
						<span>* (min 6 chars — the owner uses this to sign in)</span>
					</label>
					<input
						type="text"
						value={form.password}
						onChange={set("password")}
						className={errors.password ? "invalid" : ""}
						aria-invalid={errors.password ? true : undefined}
					/>
					{errors.password && (
						<p className="field-error" role="alert">{errors.password}</p>
					)}
				</div>
			</div>
		</AdminModal>
	);
}

export default AdminOwnerForm;
