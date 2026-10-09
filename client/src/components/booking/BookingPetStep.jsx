import { useEffect, useState } from "react";
import { FaArrowRight, FaPlus } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { FiCheck, FiAlertTriangle } from "react-icons/fi";
import { PiCat, PiDog, PiBird, PiPawPrint, PiRabbit } from "react-icons/pi";
import { useMyPets, useCreateMyPet } from "../../hooks/useClientData";
import { PET_TYPES } from "../../data/catalog";

const iconFor = (s) =>
	({
		dog: <PiDog size={22} />,
		cat: <PiCat size={22} />,
		bird: <PiBird size={22} />,
		rabbit: <PiRabbit size={22} />,
	}[s] ?? <PiPawPrint size={22} />);

const typeLabel = (s) =>
	PET_TYPES.find((t) => t.id === s)?.label ?? s ?? "—";

// Step 2 — pick which pet the visit is for, or add a new one on the spot.
function BookingPetStep({ onDone, onBack }) {
	const { data: pets = [], isPending } = useMyPets();
	const createPet = useCreateMyPet();

	const [selected, setSelected] = useState(null); // pet object
	const [adding, setAdding] = useState(false);
	const [form, setForm] = useState({ name: "", species: "dog", breed: "", age: "", gender: "male", notes: "" });
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	// If there's exactly one pet and nothing picked yet, pre-select it.
	useEffect(() => {
		if (!selected && pets.length === 1) setSelected(pets[0]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pets]);

	const canContinue = Boolean(selected);

	function submitNewPet(e) {
		e.preventDefault();
		if (!form.name.trim()) return;
		createPet.mutate(
			{
				name: form.name.trim(),
				species: form.species,
				breed: form.breed.trim() || undefined,
				age: form.age === "" ? undefined : Number(form.age),
				gender: form.gender,
				notes: form.notes.trim() || undefined,
			},
			{
				onSuccess: (pet) => {
					setSelected(pet);
					setAdding(false);
					onDone(pet);
				},
			},
		);
	}

	return (
		<div className="appointment-card">
			<section className="form-section">
				<h2>Who's coming in?</h2>

				<p className="form-description">
					Pick the pet this appointment is for, or add a new one to your account.
				</p>

				{isPending ? (
					<p className="admin-panel-empty">Loading your pets…</p>
				) : (
					<div className="booking-pet-list">
						{pets.map((p) => (
							<button
								key={p._id}
								type="button"
								className={`booking-pet-option ${selected?._id === p._id ? "selected" : ""}`}
								onClick={() => setSelected(p)}
							>
								<span className="booking-pet-avatar">{iconFor(p.species)}</span>

								<span className="booking-pet-meta">
									<strong>
										{p.name}
										{p.gender ? <small> · {p.gender}</small> : null}
									</strong>
									<small>
										{typeLabel(p.species)}
										{p.breed ? ` (${p.breed})` : ""}
										{p.age != null ? ` · ${p.age} yrs` : ""}
									</small>
								</span>

								{selected?._id === p._id && <span className="booking-pet-check"><FiCheck size={15} /></span>}
							</button>
						))}

						{pets.length > 0 && (
							<button
								type="button"
								className="booking-pet-add"
								onClick={() => setAdding((v) => !v)}
							>
								<FaPlus />
								{adding ? "Close" : `Add ${pets.length === 1 ? "another" : "a new"} pet`}
							</button>
						)}
					</div>
				)}

				{createPet.error && <div className="admin-form-error"><FiAlertTriangle size={13} /> {createPet.error.message}</div>}

				{/* INLINE ADD-PET FORM */}
				{(adding || pets.length === 0) && (
					<form className="booking-add-pet" onSubmit={submitNewPet}>
						<h3>Add a pet</h3>

						<div className="date-time-form">
							<div className="appointment-field">
								<label>Pet name *</label>
								<input value={form.name} onChange={set("name")} placeholder="e.g. Mochi" required autoFocus />
							</div>

							<div className="appointment-field">
								<label>Type *</label>

								<select value={form.species} onChange={set("species")}>
									{PET_TYPES.map((t) => (
										<option key={t.id} value={t.id}>
											{t.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="date-time-form">
							<div className="appointment-field">
								<label>Breed</label>
								<input value={form.breed} onChange={set("breed")} placeholder="e.g. Beagle" />
							</div>

							<div className="appointment-field">
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
						</div>

						<div className="appointment-field">
							<label>Gender</label>

							<select value={form.gender} onChange={set("gender")}>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>

						<button
							type="submit"
							className="continue-button"
							disabled={!form.name.trim() || createPet.isPending}
						>
							{createPet.isPending ? "Saving…" : "Add pet & continue"}
							<FaArrowRight />
						</button>
					</form>
				)}
			</section>

			<div className="appointment-actions">
				<button type="button" className="cancel-button" onClick={onBack}>
					<FiArrowLeft size={14} /> Back
				</button>

				<button
					type="button"
					className="continue-button"
					disabled={!canContinue}
					onClick={() => canContinue && onDone(selected)}
				>
					Continue <FaArrowRight />
				</button>
			</div>
		</div>
	);
}

export default BookingPetStep;
