import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useVets, useVetFreeSlots } from "../../hooks/useAdminData";
import { SERVICES } from "../../data/catalog";
import { required, firstError, useFieldErrors } from "../../utils/validate";

function localYYYYMMDD(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Step 3 — pick the service, the vet, and a genuinely available slot.
// The slot list comes from GET /vets/:id?date=..., which computes the vet's
// working schedule for that weekday minus that day's existing bookings,
// so a visitor can never pick a time the clinic is already committed to.
function BookingScheduleStep({ onDone, onBack }) {
	const { data: vets = [], isPending: vetsPending } = useVets();

	const [service, setService] = useState("");
	const [vetId, setVetId] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [notes, setNotes] = useState("");
	const [errors, validate, clear] = useFieldErrors();

	const selectedVet = vets.find((v) => v._id === vetId);
	const {
		data: slotData,
		isPending: slotsPending,
		isError: slotsError,
	} = useVetFreeSlots(vetId, date);
	const slots = slotData?.freeSlots ?? [];

	// Default to the first available vet so the time picker is always live.
	useEffect(() => {
		if (vets.length > 0 && !vets.find((v) => v._id === vetId)) {
			setVetId(vets[0]._id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vets]);

	// Keep the time valid when the vet or date changes.
	useEffect(() => {
		setTime("");
		// Drop any stale "pick a time" error — the options changed.
		if (errors.time) clear("time")();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vetId, date]);

	const today = localYYYYMMDD(new Date());
	const canContinue = Boolean(service && vetId && date && slots.includes(time));

	// Continue always runs validation so missing fields show an inline
	// message instead of the button just sitting greyed out.
	function continueBooking() {
		console.log("Review booking clicked");
		const found = validate({
			service: required(service, "Service"),
			vet: required(vetId, "Veterinarian"),
			date: firstError(
				required(date, "Date"),
				date && date < today ? "Date can't be in the past." : "",
			),
			// Only enforce once a date is chosen (otherwise "pick a
			// date" and "pick a time" show together, which is noisy).
			time: date
				? firstError(required(time, "Time"), required(vetId, "Veterinarian"))
				: "",
		});
		if (Object.keys(found).length) return;
		if (canContinue)
			onDone({ service, vetId, date, time, notes: notes.trim() });
	}

	return (
		<div className="appointment-card">
			<section className="form-section">
				<h2>Choose your schedule</h2>

				<p className="form-description">
					Pick a service, a veterinarian, and a time. Only slots the clinic
					actually has free are shown.
				</p>

				<div className="appointment-field">
					<label>Service *</label>

					<select
						value={service}
						onChange={(e) => {
							setService(e.target.value);
							clear("service")();
						}}
						className={errors.service ? "invalid" : ""}
						aria-invalid={errors.service ? true : undefined}
					>
						<option value="">Select a service</option>

						{SERVICES.map((s) => (
							<option key={s.id} value={s.label}>
								{s.label} — {s.price}
							</option>
						))}
					</select>

					{errors.service && (
						<p className="field-error" role="alert">
							{errors.service}
						</p>
					)}
				</div>

				<div className="appointment-field">
					<label>Preferred veterinarian *</label>

					<select
						value={vetId}
						onChange={(e) => {
							setVetId(e.target.value);
							clear("vet")();
						}}
						className={errors.vet ? "invalid" : ""}
						aria-invalid={errors.vet ? true : undefined}
					>
						<option value="" disabled>
							Choose a veterinarian
						</option>

						{vets.map((v) => (
							<option key={v._id} value={v._id}>
								{v.name}
								{v.specialty ? ` — ${v.specialty}` : ""}
							</option>
						))}
					</select>

					{errors.vet && (
						<p className="field-error" role="alert">
							{errors.vet}
						</p>
					)}
				</div>

				<div className="date-time-form">
					<div className="appointment-field">
						<label>Preferred date *</label>

						<input
							type="date"
							value={date}
							min={localYYYYMMDD(new Date())}
							onChange={(e) => {
								setDate(e.target.value);
								clear("date")();
							}}
							className={errors.date ? "invalid" : ""}
							aria-invalid={errors.date ? true : undefined}
						/>

						{errors.date && (
							<p className="field-error" role="alert">
								{errors.date}
							</p>
						)}
					</div>

					<div className="appointment-field">
						<label>Available times *</label>

						<select
							value={time}
							onChange={(e) => {
								setTime(e.target.value);
								clear("time")();
							}}
							disabled={!vetId || !date || slotsPending}
							className={errors.time ? "invalid" : ""}
							aria-invalid={errors.time ? true : undefined}
						>
							<option value="">
								{!vetId
									? "Select a date to see times"
									: slotsPending
										? "Checking availability…"
										: slotsError
											? "Couldn't load times"
											: slots.length === 0
												? "No slots open that day"
												: "Select a time"}
							</option>

							{slots.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>

						{errors.time && (
							<p className="field-error" role="alert">
								{errors.time}
							</p>
						)}
					</div>
				</div>

				{vetsPending && (
					<p className="admin-panel-empty">Loading veterinarians…</p>
				)}

				{selectedVet &&
					date &&
					slots.length === 0 &&
					!slotsPending &&
					!slotsError && (
						<p className="booking-slot-hint">
							{selectedVet.name} isn't working that day — try another date or a
							different vet.
						</p>
					)}

				<section className="form-section">
					<h2>Additional notes</h2>

					<p className="form-description">
						Is there anything our veterinary team should know before the visit?
					</p>

					<textarea
						name="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows="4"
						placeholder="Example: Mochi has been scratching his left ear..."
					/>
				</section>
			</section>

			<div className="appointment-actions">
				<button type="button" className="cancel-button" onClick={onBack}>
					<FiArrowLeft size={14} /> Back
				</button>

				<button
					type="button"
					className="continue-button"
					onClick={continueBooking}
				>
					Review booking <FaArrowRight />
				</button>
			</div>
		</div>
	);
}

export default BookingScheduleStep;
