import { useState } from "react";
import AdminModal from "../../admin/AdminModal";
import { useCreateMyPet, useUpdateMyPet } from "../../../hooks/useClientData";
import { SPECIES_PICKER, GENDERS } from "../../shared/Species";
import { FiAlertTriangle } from "react-icons/fi";

function ClientPetForm({ pet, onClose }) {
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
						{mutation.isPending ? "Saving…" : pet ? "Save changes" : "Add pet"}
					</button>
				</>
			}
		>
			{mutation.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {mutation.error.message}
				</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field full">
					<label>
						Pet name <span>*</span>
					</label>
					<input
						value={form.name}
						onChange={set("name")}
						placeholder="e.g. Max"
						autoFocus
					/>
				</div>

				<div className="admin-form-field full">
					<label>Species</label>
					<div className="client-species-picker">
						{SPECIES_PICKER.map((s) => (
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
					<input
						value={form.breed}
						onChange={set("breed")}
						placeholder="e.g. Beagle"
					/>
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

export default ClientPetForm;
