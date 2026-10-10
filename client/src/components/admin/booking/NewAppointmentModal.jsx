import { useMemo, useState } from "react";
import {
	usePets,
	useUsers,
	useVets,
	useVetFreeSlots,
	useBookAppointment,
} from "../../../hooks/useAdminData";
import AdminModal from "../AdminModal";
import { FiAlertTriangle } from "react-icons/fi";

const REASONS = [
	"General Check-up",
	"Vaccination",
	"Consultation",
	"Dental Cleaning",
	"Surgery Follow-up",
	"Wellness Exam",
];

/** YYYY-MM-DD for a Date, in the viewer's local calendar. */
function toLocalISO(d) {
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Vet books on behalf of an owner: pick owner → that owner's pet → vet →
// date → live free slot → reason.
function NewAppointmentModal({ onClose }) {
	const { data: users = [] } = useUsers();
	const { data: pets = [] } = usePets();
	const { data: vets = [] } = useVets();
	const book = useBookAppointment();

	const owners = users.filter((u) => u.role === "user");

	const [ownerId, setOwnerId] = useState("");
	const [petId, setPetId] = useState("");
	const [vetId, setVetId] = useState("");
	const [date, setDate] = useState(toLocalISO(new Date()));
	const [time, setTime] = useState("");
	const [reason, setReason] = useState(REASONS[0]);

	const ownerPets = useMemo(
		() => pets.filter((p) => p.owner === ownerId),
		[pets, ownerId],
	);

	const { data: vetDetail, isPending: slotsPending } = useVetFreeSlots(
		vetId,
		date,
	);
	const slots = vetDetail?.freeSlots ?? [];

	const handleOwner = (id) => {
		setOwnerId(id);
		setPetId("");
	};
	const handleVet = (id) => {
		setVetId(id);
		setTime("");
	};
	const handleDate = (d) => {
		setDate(d);
		setTime("");
	};

	const canSubmit =
		ownerId && petId && vetId && time && reason.trim().length >= 3;

	const submit = () => {
		book.mutate(
			{ vetId, petId, date, time, reason: reason.trim() },
			{ onSuccess: onClose },
		);
	};

	return (
		<AdminModal
			eyebrow="CLINIC MANAGEMENT"
			title="New Appointment"
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
						disabled={!canSubmit || book.isPending}
						onClick={submit}
					>
						{book.isPending ? "Booking…" : "Book Appointment"}
					</button>
				</>
			}
		>
			{book.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {book.error.message}
				</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field">
					<label>Pet Owner</label>
					<select value={ownerId} onChange={(e) => handleOwner(e.target.value)}>
						<option value="">Select an owner…</option>
						{owners.map((o) => (
							<option key={o._id} value={o._id}>
								{o.name}
							</option>
						))}
					</select>
				</div>

				<div className="admin-form-field">
					<label>Pet</label>
					<select
						value={petId}
						onChange={(e) => setPetId(e.target.value)}
						disabled={!ownerId}
					>
						<option value="">
							{ownerId
								? ownerPets.length
									? "Select a pet…"
									: "This owner has no registered pets"
								: "Pick an owner first"}
						</option>
						{ownerPets.map((p) => (
							<option key={p._id} value={p._id}>
								{p.name} — {p.breed ?? p.species}
							</option>
						))}
					</select>
				</div>

				<div className="admin-form-field">
					<label>Veterinarian</label>
					<select value={vetId} onChange={(e) => handleVet(e.target.value)}>
						<option value="">Select a vet…</option>
						{vets.map((v) => (
							<option key={v._id} value={v._id}>
								{v.name} — {v.specialty ?? "General"}
							</option>
						))}
					</select>
				</div>

				<div className="admin-form-field">
					<label>Date</label>
					<input
						type="date"
						value={date}
						min={toLocalISO(new Date())}
						onChange={(e) => handleDate(e.target.value)}
					/>
				</div>

				<div className="admin-form-field full">
					<label>
						Time Slot <span>(available for the selected vet + date)</span>
					</label>

					{!vetId ? (
						<p className="admin-slot-note">
							Choose a veterinarian to see open slots.
						</p>
					) : slotsPending ? (
						<p className="admin-slot-note">Checking availability…</p>
					) : slots.length === 0 ? (
						<p className="admin-slot-note">
							No open slots on this date — try another day.
						</p>
					) : (
						<div className="admin-slots">
							{slots.map((s) => (
								<button
									key={s}
									type="button"
									className={`admin-slot${time === s ? " selected" : ""}`}
									onClick={() => setTime(s)}
								>
									{s}
								</button>
							))}
						</div>
					)}
				</div>

				<div className="admin-form-field full">
					<label>Reason for Visit</label>
					<select value={reason} onChange={(e) => setReason(e.target.value)}>
						{REASONS.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div>
			</div>
		</AdminModal>
	);
}

export default NewAppointmentModal;
