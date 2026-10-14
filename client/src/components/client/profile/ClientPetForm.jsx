import { useState } from "react";
import AdminModal from "../../admin/AdminModal";
import { useCreateMyPet, useUpdateMyPet } from "../../../hooks/useClientData";
import { SPECIES_PICKER, GENDERS } from "../../shared/Species";
import { FiAlertTriangle } from "react-icons/fi";
import { required, ageValue, collectErrors } from "../../../utils/validate";

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
	const set = (k) => (e) => {
		setForm((f) => ({ ...f, [k]: e.target.value }));
		if (errors[k]) setErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
	};
	const [errors, setErrors] = useState({});

	const submit = () => {
		const found = collectErrors({
			name: required(form.name, "Pet name"),
			age: ageValue(form.age),
		});
		setErrors(found);
		if (Object.keys(found).length) return;
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
						disabled={mutation.isPending}
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
						className={errors.name ? "invalid" : ""}
						aria-invalid={errors.name ? true : undefined}
						aria-describedby={errors.name ? "pet-name-err" : undefined}
						autoFocus
					/>
					{errors.name && (
					<p id="pet-name-err" className="field-error" role="alert">{errors.name}</p>
					)}
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
						className={errors.age ? "invalid" : ""}
						aria-invalid={errors.age ? true : undefined}
						aria-describedby={errors.age ? "pet-age-err" : undefined}
						placeholder="e.g. 2"
					/>
					{errors.age && (
					<p id="pet-age-err" className="field-error" role="alert">{errors.age}</p>
					)}
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
