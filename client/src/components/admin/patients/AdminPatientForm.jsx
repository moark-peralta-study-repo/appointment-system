import { useState } from "react";
import AdminModal from "../AdminModal";
import {
	useUsers,
	useCreatePet,
	useUpdatePet,
} from "../../../hooks/useAdminData";
import { SPECIES_OPTIONS, GENDERS } from "../../shared/Species";
import { FiAlertTriangle } from "react-icons/fi";

function AdminPatientForm({ pet, onClose }) {
	const { data: users = [] } = useUsers();
	const createPet = useCreatePet();
	const updatePet = useUpdatePet();
	const owners = users.filter((u) => u.role === "user");

	const [form, setForm] = useState({
		ownerId: pet?.owner ?? "",
		name: pet?.name ?? "",
		species: pet?.species ?? "dog",
		breed: pet?.breed ?? "",
		age: pet?.age ?? "",
		gender: pet?.gender ?? "male",
		notes: pet?.notes ?? "",
	});

	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
	const mutation = pet ? updatePet : createPet;
	const error = mutation.error;
	const canSubmit = form.name.trim() && form.ownerId;

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
		else
			mutation.mutate(
				{ ...body, ownerId: form.ownerId },
				{ onSuccess: onClose },
			);
	};

	return (
		<AdminModal
			eyebrow="CLINIC MANAGEMENT"
			title={pet ? `Edit Patient — ${pet.name}` : "Add Patient"}
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
						disabled={!canSubmit || mutation.isPending}
						onClick={submit}
					>
						{mutation.isPending
							? "Saving…"
							: pet
								? "Save Changes"
								: "Register Patient"}
					</button>
				</>
			}
		>
			{error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {error.message}
				</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>Pet Owner</label>
					<select
						value={form.ownerId}
						onChange={set("ownerId")}
						disabled={Boolean(pet)}
					>
						<option value="">Select an owner…</option>
						{owners.map((o) => (
							<option key={o._id} value={o._id}>
								{o.name} — {o.email}
							</option>
						))}
					</select>
					{pet && (
						<small className="admin-slot-note">
							Owner is fixed once a patient is registered.
						</small>
					)}
				</div>

				<div className="admin-form-field">
					<label>
						Pet Name <span>*</span>
					</label>
					<input
						type="text"
						value={form.name}
						onChange={set("name")}
						placeholder="e.g. Mochi"
					/>
				</div>

				<div className="admin-form-field">
					<label>Species</label>
					<select value={form.species} onChange={set("species")}>
						{SPECIES_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s.charAt(0).toUpperCase() + s.slice(1)}
							</option>
						))}
					</select>
				</div>

				<div className="admin-form-field">
					<label>Breed</label>
					<input
						type="text"
						value={form.breed}
						onChange={set("breed")}
						placeholder="e.g. Golden Retriever"
					/>
				</div>

				<div className="admin-form-field">
					<label>Age (years)</label>
					<input
						type="number"
						min="0"
						max="30"
						value={form.age}
						onChange={set("age")}
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
					<label>
						Medical Notes <span>(optional)</span>
					</label>
					<textarea
						rows="3"
						value={form.notes}
						onChange={set("notes")}
						placeholder="Allergies, conditions, medications…"
					/>
				</div>
			</div>
		</AdminModal>
	);
}

export default AdminPatientForm;
