import { useState } from "react";
import AdminModal from "../AdminModal";
import { useAddVisitNote } from "../../../hooks/useAdminData";
import { formatDate } from "../../../utils/admin";
import { FiAlertTriangle } from "react-icons/fi";

function AdminVisitNoteForm({ appointments, onClose }) {
	const addNote = useAddVisitNote();

	// Only confirmed (today) or pending visits can become records.
	const eligible = appointments
		.filter((a) => a.status === "confirmed" || a.status === "pending")
		.sort((x, y) => new Date(y.date) - new Date(x.date));

	const [apptId, setApptId] = useState(eligible[0]?._id ?? "");
	const selected = eligible.find((a) => a._id === apptId);
	const [notes, setNotes] = useState("");

	const canSubmit = Boolean(selected) && notes.trim().length > 0;

	const submit = () => {
		addNote.mutate(
			{ id: selected._id, vetNotes: notes.trim() },
			{ onSuccess: onClose },
		);
	};

	return (
		<AdminModal
			eyebrow="PATIENT CARE"
			title="New Medical Record"
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
						disabled={!canSubmit || addNote.isPending}
						onClick={submit}
					>
						{addNote.isPending ? "Saving…" : "Save Record"}
					</button>
				</>
			}
		>
			{addNote.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {addNote.error.message}
				</div>
			)}

			{eligible.length === 0 ? (
				<p className="admin-slot-note">
					No pending or confirmed visits to record. Mark a visit Complete first
					— or add a note via the Appointments page.
				</p>
			) : (
				<div className="admin-form-grid">
					<div className="admin-form-field full">
						<label>Visit to Record</label>
						<select value={apptId} onChange={(e) => setApptId(e.target.value)}>
							{eligible.map((a) => (
								<option key={a._id} value={a._id}>
									{formatDate(a.date)} — {a.pet?.name ?? "Unknown"} —{" "}
									{a.reason ?? "Visit"} ({a.status})
								</option>
							))}
						</select>
						{selected && (
							<p className="admin-slot-note">
								Saving marks this visit as <strong>Completed</strong> and stores
								the note below.
							</p>
						)}
					</div>

					<div className="admin-form-field full">
						<label>
							Visit Notes <span>*</span>
						</label>
						<textarea
							rows="5"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Findings, prescriptions, follow-up plan…"
						/>
					</div>
				</div>
			)}
		</AdminModal>
	);
}

export default AdminVisitNoteForm;
