import { useMemo, useState } from "react";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminModal from "../../components/admin/AdminModal";
import { useStaff, useCreateStaff, useRemoveStaff, useUpdateStaff } from "../../hooks/useAdminData";
import { required, emailValue, minLength, firstError, useFieldErrors } from "../../utils/validate";
import { initials } from "../../utils/admin";

// Add / edit form for a non-vet staff account (reception / front desk).
function StaffForm({ member, onClose }) {
	const create = useCreateStaff();
	const update = useUpdateStaff();
	const editing = Boolean(member);

	const [form, setForm] = useState({
		name: editing ? member.name : "",
		email: editing ? member.email : "",
		password: "",
		phone: editing ? member.phone ?? "" : "",
	});
	const [errors, validate, clear] = useFieldErrors();
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		if (errors[k]) clear(k)();
	};

	const submit = () => {
		const found = validate({
			name: required(form.name, "Full name"),
			...(editing
				? {}
				: {
						email: firstError(required(form.email, "Email"), emailValue(form.email)),
						password: firstError(required(form.password, "Password"), minLength(form.password, 6, "Password")),
				  }),
		});
		if (Object.keys(found).length) return;

		if (editing) {
			update.mutate(
				{
					id: member._id,
					body: {
						name: form.name.trim(),
						phone: form.phone.trim() || undefined,
						// Blank = keep the existing password.
						password: form.password || undefined,
					},
				},
				{ onSuccess: onClose },
			);
		} else {
			create.mutate(
				{
					name: form.name.trim(),
					email: form.email.trim(),
					password: form.password,
					phone: form.phone.trim() || undefined,
				},
				{ onSuccess: onClose },
			);
		}
	};

	const err = editing ? update.error : create.error;
	const busy = editing ? update.isPending : create.isPending;

	return (
		<AdminModal
			eyebrow="STAFF MANAGEMENT"
			title={editing ? `Edit ${member.name}` : "Add Staff Member"}
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Cancel
					</button>
					<button className="admin-primary-button" type="button" disabled={busy} onClick={submit}>
						{busy
							? "Saving…"
							: editing
								? "Save Changes"
								: "Create Staff Member"}
					</button>
				</>
			}
		>
			{err && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {err.message}
				</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field">
					<label>Full Name <span>*</span></label>
					<input
						type="text"
						value={form.name}
						onChange={set("name")}
						className={errors.name ? "invalid" : ""}
						aria-invalid={errors.name ? true : undefined}
						placeholder="Jane Reyes"
					/>
					{errors.name && (
						<p className="field-error" role="alert">{errors.name}</p>
					)}
				</div>

				{!editing && (
					<div className="admin-form-field">
						<label>Email <span>*</span></label>
						<input
							type="email"
							value={form.email}
							onChange={set("email")}
							className={errors.email ? "invalid" : ""}
							aria-invalid={errors.email ? true : undefined}
							placeholder="staff@pinkpaws.com"
						/>
						{errors.email && (
							<p className="field-error" role="alert">{errors.email}</p>
						)}
					</div>
				)}

				<div className="admin-form-field">
					<label>{editing ? "New Password" : "Portal Password"}{!editing && " *"}</label>
					<input
						type="text"
						value={form.password}
						onChange={set("password")}
						className={errors.password ? "invalid" : ""}
						aria-invalid={errors.password ? true : undefined}
						placeholder={editing ? "Leave blank to keep current" : "At least 6 characters"}
					/>
					{errors.password && (
						<p className="field-error" role="alert">{errors.password}</p>
					)}
				</div>

				<div className="admin-form-field">
					<label>Phone</label>
					<input type="text" value={form.phone} onChange={set("phone")} placeholder="+63 917 000 0000" />
				</div>
			</div>
		</AdminModal>
	);
}

function Staff() {
	const { data: staff = [], isPending } = useStaff();
	const remove = useRemoveStaff();

	const [search, setSearch] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [confirmRemove, setConfirmRemove] = useState(null);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return staff
			.map((s) => ({ ...s, initials: initials(s.name) }))
			.filter((s) => {
				if (!q) return true;
				return `${s.name} ${s.email ?? ""}`.toLowerCase().includes(q);
			});
	}, [staff, search]);

	return (
		<>
			<AdminPageHeader
				eyebrow="STAFF MANAGEMENT"
				title="Staff"
				description="Non-vet clinic staff — reception and front-desk accounts. They handle appointments, patients, and pet owners."
				actions={
					<button
						className="admin-primary-button"
						type="button"
						onClick={() => { setEditing(null); setShowForm(true); }}
					>
						+ Add Staff
					</button>
				}
			/>

			<section className="admin-panel veterinarians-panel">
				<div className="veterinarians-toolbar">
					<div className="vet-search">
						<FiSearch size={15} />
						<input
							type="text"
							placeholder="Search staff by name or email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<div className="veterinarian-grid">
					{isPending && (
						<div className="admin-panel-empty" style={{ gridColumn: "1 / -1" }}>
							Loading staff…
						</div>
					)}

					{!isPending && rows.length === 0 && (
						<div className="admin-panel-empty" style={{ gridColumn: "1 / -1" }}>
							{search ? "No staff match your search." : "No staff yet — add a reception account to get started."}
						</div>
					)}

					{rows.map((s) => (
						<div className="veterinarian-card" key={s._id}>
							<div className="vet-card-top">
								<div className="vet-avatar">{s.initials}</div>
								<button
									className="vet-more-button"
									type="button"
									aria-label={`More options for ${s.name}`}
									onClick={() => { setEditing(s); setShowForm(true); }}
								>
									•••
								</button>
							</div>

							<div className="vet-card-info">
								<h3>{s.name}</h3>
								<p className="vet-specialty">Reception / Front Desk</p>
								<p className="vet-experience">{s.email}</p>
							</div>

							<div className="vet-card-divider"></div>

							<div className="vet-card-bottom">
								<div>
									<span>Phone</span>
									<strong>{s.phone ?? "—"}</strong>
								</div>
								<span className="vet-status available">
									<span className="vet-status-dot"></span>
									Active
								</span>
							</div>

							{confirmRemove?._id === s._id ? (
								<div style={{ display: "flex", gap: 8 }}>
									<button
										className="admin-secondary-button"
										style={{ flex: 1 }}
										type="button"
										onClick={() => { setConfirmRemove(null); remove.reset(); }}
									>
										Keep
									</button>
									<button
										className="row-action cancel"
										style={{ flex: 1 }}
										type="button"
										disabled={remove.isPending}
										onClick={() =>
											remove.mutate(s._id, {
												onSuccess: () => setConfirmRemove(null),
											})
										}
									>
										{remove.isPending ? "Removing…" : "Confirm"}
									</button>
								</div>
							) : (
								<div style={{ display: "flex", gap: 8 }}>
									<button
										className="admin-secondary-button"
										style={{ flex: 1 }}
										type="button"
										onClick={() => { setEditing(s); setShowForm(true); }}
									>
										Edit
									</button>
									<button
										className="row-action cancel"
										style={{ flex: 1 }}
										type="button"
										onClick={() => { setConfirmRemove(s); remove.reset(); }}
									>
										Remove
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			{showForm && (
				<StaffForm
					member={editing}
					onClose={() => { setShowForm(false); setEditing(null); }}
				/>
			)}
		</>
	);
}

export default Staff;
