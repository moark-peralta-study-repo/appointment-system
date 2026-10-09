import { useEffect, useRef, useState } from "react";
import { PiCat, PiDog, PiBird, PiPawPrint } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import ClientHeader from "../../components/client/ClientHeader";
import AdminModal from "../../components/admin/AdminModal";
import DogLoader from "../../components/admin/DogLoader";
import { useAuth } from "../../context/useAuth";
import {
	useMyPets,
	useCreateMyPet,
	useUpdateMyPet,
	useDeleteMyPet,
	useUpdateMyProfile,
	useChangePassword,
} from "../../hooks/useClientData";
import { initials } from "../../utils/admin";

const SPECIES = [
	{ id: "dog", label: "Dog", icon: <PiDog size={20} /> },
	{ id: "cat", label: "Cat", icon: <PiCat size={20} /> },
	{ id: "bird", label: "Bird", icon: <PiBird size={20} /> },
	{ id: "other", label: "Other", icon: <PiPawPrint size={20} /> },
];
const GENDERS = ["male", "female"];

const iconFor = (s) =>
	({ dog: <PiDog size={22} />, cat: <PiCat size={22} />, bird: <PiBird size={22} /> }[s] ??
	<PiPawPrint size={22} />);

/* ---------------- PET ADD / EDIT ---------------- */
function PetForm({ pet, onClose }) {
	const createPet = useCreateMyPet();
	const updatePet = useUpdateMyPet();
	const mutation = pet ? updatePet : createPet;

	const [form, setForm] = useState({
		name: pet?.name ?? "",
		species: pet?.species ?? "dog",
		breed: pet?.breed ?? "",
		age: pet?.age ?? "",
		gender: pet?.gender ?? "male",
		notes: pet?.notes ?? "",
	});
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const canSubmit = form.name.trim().length > 0;
	const submit = () => {
		const body = {
			name: form.name.trim(),
			species: form.species,
			breed: form.breed.trim() || undefined,
			age: form.age === "" ? undefined : Number(form.age),
			gender: form.gender,
			notes: form.notes.trim() || undefined,
		};
		if (pet) mutation.mutate({ id: pet._id, body }, { onSuccess: onClose });
		else mutation.mutate(body, { onSuccess: onClose });
	};

	return (
		<AdminModal
			eyebrow="MY PETS"
			title={pet ? `Edit ${pet.name}` : "Add a pet"}
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Cancel
					</button>
					<button
						className="admin-primary-button"
						type="button"
						disabled={!canSubmit || mutation.isPending}
						onClick={submit}
					>
						{mutation.isPending ? "Saving…" : pet ? "Save changes" : "Add pet"}
					</button>
				</>
			}
		>
			{mutation.error && <div className="admin-form-error">⚠ {mutation.error.message}</div>}

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>Pet name <span>*</span></label>
					<input value={form.name} onChange={set("name")} placeholder="e.g. Max" autoFocus />
				</div>

				<div className="admin-form-field full">
					<label>Species</label>
					<div className="client-species-picker">
						{SPECIES.map((s) => (
							<button
								key={s.id}
								type="button"
								className={form.species === s.id ? "active" : ""}
								onClick={() => setForm((f) => ({ ...f, species: s.id }))}
							>
								{s.icon}
								<small>{s.label}</small>
							</button>
						))}
					</div>
				</div>

				<div className="admin-form-field">
					<label>Breed</label>
					<input value={form.breed} onChange={set("breed")} placeholder="e.g. Beagle" />
				</div>

				<div className="admin-form-field">
					<label>Age (years)</label>
					<input
						type="number"
						min="0"
						step="0.5"
						value={form.age}
						onChange={set("age")}
						placeholder="e.g. 2"
					/>
				</div>

				<div className="admin-form-field">
					<label>Gender</label>
					<select value={form.gender} onChange={set("gender")}>
						{GENDERS.map((g) => (
							<option key={g} value={g}>
								{g.charAt(0).toUpperCase() + g.slice(1)}
							</option>
						))}
					</select>
				</div>

				<div className="admin-form-field full">
					<label>Notes (optional)</label>
					<textarea
						rows="2"
						value={form.notes}
						onChange={set("notes")}
						placeholder="Allergies, behavior, anything the vet should know…"
					/>
				</div>
			</div>
		</AdminModal>
	);
}

/* ---------------- PET DELETE ---------------- */
function PetDeleteModal({ pet, onClose }) {
	const deletePet = useDeleteMyPet();
	return (
		<AdminModal
			eyebrow="MY PETS"
			title={`Remove ${pet.name}?`}
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Keep
					</button>
					<button
						className="admin-secondary-button"
						style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
						type="button"
						disabled={deletePet.isPending}
						onClick={() => deletePet.mutate(pet._id, { onSuccess: onClose })}
					>
						{deletePet.isPending ? "Removing…" : "Remove pet"}
					</button>
				</>
			}
		>
			<p className="admin-form-desc">
				{pet.name} will be removed from your account. Past appointments stay in
				your history, but future bookings will need a pet on file.
			</p>
			{deletePet.error && <div className="admin-form-error">⚠ {deletePet.error.message}</div>}
		</AdminModal>
	);
}

/* ---------------- PROFILE FORM ---------------- */
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
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
					<span className="client-save-badge">Saved ✓</span>
				) : null}
			</div>

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>Full name <span>*</span></label>
					<input value={form.name} onChange={set("name")} />
				</div>
				<div className="admin-form-field">
					<label>Phone</label>
					<input value={form.phone} onChange={set("phone")} placeholder="+63 917 000 0000" />
				</div>
				<div className="admin-form-field">
					<label>Email</label>
					<input type="email" value={form.email} onChange={set("email")} />
				</div>
			</div>

			{updateProfile.error && <div className="admin-form-error">⚠ {updateProfile.error.message}</div>}

			<div className="settings-actions">
				<button
					className="admin-primary-button"
					type="button"
					disabled={!dirty || updateProfile.isPending}
					onClick={submit}
				>
					{updateProfile.isPending ? "Saving…" : "Save changes"}
				</button>
			</div>
		</section>
	);
}

/* ---------------- PASSWORD ---------------- */
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
				{done ? <span className="client-save-badge">Updated ✓</span> : null}
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
					<div className="admin-form-error full">⚠ {changePassword.error.message}</div>
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

/* ---------------- PAGE ---------------- */
function ClientProfile() {
	const { user, isSettled } = useAuth();
	const { data: pets = [], isPending: petsLoading } = useMyPets();
	const [editingPet, setEditingPet] = useState(null);
	const [addingPet, setAddingPet] = useState(false);
	const [deletingPet, setDeletingPet] = useState(null);

	if (!isSettled) {
		return (
			<div className="admin-loading" style={{ minHeight: "50vh" }}>
				<DogLoader />
			</div>
		);
	}

	return (
		<>
			<ClientHeader
				title="My Profile"
				subtitle="Manage your account and keep your pets' details up to date."
			/>

			{/* ACCOUNT CARD */}
			<section className="admin-panel client-profile-card">
				<div className="client-profile-id">
					<div className="settings-profile-avatar">{initials(user?.name)}</div>
					<div>
						<strong>{user?.name}</strong>
						<span>{user?.email}</span>
					</div>
				</div>
				<dl className="client-profile-meta">
					<div>
						<dt>Phone</dt>
						<dd>{user?.phone || "Not on file"}</dd>
					</div>
					<div>
						<dt>Account</dt>
						<dd>Pet Owner</dd>
					</div>
					<div>
						<dt>Pets on file</dt>
						<dd>{pets.length}</dd>
					</div>
				</dl>
			</section>

			<AccountSection />

			<PasswordSection />

			{/* PETS */}
			<section className="admin-panel client-pets-panel">
				<div className="settings-panel-header">
					<div>
						<h2>My Pets</h2>
						<p>Pets you can book appointments for.</p>
					</div>
					<button className="admin-primary-button" type="button" onClick={() => setAddingPet(true)}>
						<FiPlus />
						<span>Add a pet</span>
					</button>
				</div>

				{petsLoading ? (
					<p className="admin-panel-empty">Loading pets…</p>
				) : pets.length === 0 ? (
					<p className="admin-panel-empty">
						No pets yet — add your first furry friend to book a visit.
					</p>
				) : (
					<div className="client-pets-list">
						{pets.map((p) => (
							<article className="client-pet-card" key={p._id}>
								<div className="client-appt-avatar">{iconFor(p.species)}</div>
								<div className="client-pet-main">
									<strong>
										{p.name} <small className="client-pet-gender">{p.gender ?? ""}</small>
									</strong>
									<span>{p.breed ?? p.species ?? "—"}{p.age != null ? ` · ${p.age} yrs` : ""}</span>
									{p.notes && <p className="client-pet-notes">{p.notes}</p>}
								</div>
								<div className="client-pet-actions">
									<button className="row-action confirm" type="button" onClick={() => setEditingPet(p)}>
										Edit
									</button>
									<button className="row-action cancel" type="button" onClick={() => setDeletingPet(p)}>
										Remove
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</section>

			{addingPet && <PetForm pet={null} onClose={() => setAddingPet(false)} />}
			{editingPet && <PetForm pet={editingPet} onClose={() => setEditingPet(null)} />}
			{deletingPet && <PetDeleteModal pet={deletingPet} onClose={() => setDeletingPet(null)} />}
		</>
	);
}

export default ClientProfile;
