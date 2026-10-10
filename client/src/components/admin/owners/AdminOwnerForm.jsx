import { useState } from "react";
import AdminModal from "../AdminModal";
import { useCreateOwner } from "../../../hooks/useAdminData";
import { FiAlertTriangle } from "react-icons/fi";


function AdminOwnerForm({ onClose }) {
	const register = useCreateOwner();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
	});
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const canSubmit = form.name.trim() && form.email.trim() && form.password.length >= 6;

	const submit = () => {
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
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Cancel
					</button>
					<button
						className="admin-primary-button"
						type="button"
						disabled={!canSubmit || register.isPending}
						onClick={submit}
					>
						{register.isPending ? "Creating…" : "Create Account"}
					</button>
				</>
			}
		>
			{register.error && (
				<div className="admin-form-error"><FiAlertTriangle size={13} /> {register.error.message}</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>Full Name <span>*</span></label>
					<input type="text" value={form.name} onChange={set("name")} placeholder="e.g. Maria Lopez" />
				</div>

				<div className="admin-form-field">
					<label>Email <span>*</span></label>
					<input type="email" value={form.email} onChange={set("email")} placeholder="owner@email.com" />
				</div>

				<div className="admin-form-field">
					<label>Phone</label>
					<input type="text" value={form.phone} onChange={set("phone")} placeholder="+63 917 000 0000" />
				</div>

				<div className="admin-form-field full">
					<label>Portal Password <span>* (min 6 chars — the owner uses this to sign in)</span></label>
					<input type="text" value={form.password} onChange={set("password")} />
				</div>
			</div>
		</AdminModal>
	);
}


export default AdminOwnerForm;
