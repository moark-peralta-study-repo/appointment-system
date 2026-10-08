import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminModal from "../../components/admin/AdminModal";
import {
	useAppointments,
	useUsers,
	useAddVisitNote,
} from "../../hooks/useAdminData";
import { formatDate, initials } from "../../utils/admin";

const REASONS = [
	"General Check-up",
	"Vaccination",
	"Consultation",
	"Dental Cleaning",
	"Surgery Follow-up",
	"Wellness Exam",
];

/* ---------------- NEW RECORD (visit note) ---------------- */

function NewRecordModal({ appointments, onClose }) {
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
		addNote.mutate({ id: selected._id, vetNotes: notes.trim() }, { onSuccess: onClose });
	};

	return (
		<AdminModal
			eyebrow="PATIENT CARE"
			title="New Medical Record"
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
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
			{addNote.error && <div className="admin-form-error">⚠ {addNote.error.message}</div>}

			{eligible.length === 0 ? (
				<p className="admin-slot-note">
					No pending or confirmed visits to record. Mark a visit Complete
					first — or add a note via the Appointments page.
				</p>
			) : (
				<div className="admin-form-grid">
					<div className="admin-form-field full">
						<label>Visit to Record</label>
						<select value={apptId} onChange={(e) => setApptId(e.target.value)}>
							{eligible.map((a) => (
								<option key={a._id} value={a._id}>
									{formatDate(a.date)} — {a.pet?.name ?? "Unknown"} — {a.reason ?? "Visit"} ({a.status})
								</option>
							))}
						</select>
						{selected && (
							<p className="admin-slot-note">
								Saving marks this visit as <strong>Completed</strong> and stores the note
								below.
							</p>
						)}
					</div>

					<div className="admin-form-field full">
						<label>Visit Notes <span>*</span></label>
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

/* ---------------- RECORD VIEW ---------------- */

function RecordView({ record, onClose }) {
	return (
		<AdminModal eyebrow="MEDICAL RECORD" title={`${record.patient} — ${record.recordType}`} onClose={onClose} wide>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>PATIENT</span>
					<strong>{record.patient}</strong>
					<small>{record.species}</small>
				</div>
				<div className="admin-detail-item">
					<span>OWNER</span>
					<strong>{record.owner}</strong>
				</div>
				<div className="admin-detail-item">
					<span>VETERINARIAN</span>
					<strong>{record.veterinarian}</strong>
				</div>
				<div className="admin-detail-item">
					<span>DATE</span>
					<strong>{record.date}</strong>
				</div>
				<div className="admin-detail-item full">
					<span>RECORD TYPE</span>
					<strong>{record.recordType}</strong>
				</div>
				<div className="admin-detail-item full">
					<span>VISIT NOTES</span>
					<strong style={{ whiteSpace: "pre-wrap", fontFamily: "'Baloo Thambi 2', sans-serif", fontSize: 15 }}>
						{record.notes || "No notes recorded for this visit."}
					</strong>
				</div>
			</div>
		</AdminModal>
	);
}

/* ---------------- PAGE ---------------- */

function MedicalRecords() {
	const { data: appointments = [], isPending } = useAppointments();
	const { data: users = [] } = useUsers();

	const [typeFilter, setTypeFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showNew, setShowNew] = useState(false);
	const [viewing, setViewing] = useState(null);

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	// Medical records = completed visits (per the domain model, a record is
	// an appointment that happened — the reason is the record type,
	// vetNotes the visit note). Sorted most-recent first.
	const records = useMemo(() => {
		const q = search.trim().toLowerCase();
		return appointments
			.filter((a) => a.status === "completed")
			.filter((a) => typeFilter === "all" || (a.reason ?? "").toLowerCase() === typeFilter)
			.map((a) => ({
				_id: a._id,
				patient: a.pet?.name ?? "Unknown",
				species: a.pet?.breed ?? a.pet?.species ?? "—",
				owner: ownersById[a.owner]?.name ?? "—",
				veterinarian: a.vet ?? "—",
				recordType: a.reason ?? "—",
				date: formatDate(a.date),
				status: "Completed",
				notes: a.vetNotes,
			}))
			.filter((r) => {
				if (!q) return true;
				return `${r.patient} ${r.owner} ${r.veterinarian} ${r.recordType}`.toLowerCase().includes(q);
			})
			.sort((x, y) => new Date(y.date) - new Date(x.date));
	}, [appointments, ownersById, typeFilter, search]);

	const completedCount = appointments.filter((a) => a.status === "completed").length;
	const withNotes = appointments.filter((a) => a.status === "completed" && a.vetNotes).length;
	const thisMonth = (() => {
		const now = new Date();
		return appointments.filter((a) => {
			if (a.status !== "completed") return false;
			const d = new Date(a.date);
			return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
		}).length;
	})();

	return (
		<>
			<AdminPageHeader
				eyebrow="PATIENT CARE"
				title="Medical Records"
				description="Review and manage medical records for registered patients."
				actions={
					<button className="admin-primary-button" type="button" onClick={() => setShowNew(true)}>
						+ New Medical Record
					</button>
				}
			/>

			{/* SUMMARY */}

			<section className="medical-summary">
				<div className="medical-summary-card">
					<div className="medical-summary-icon blue">📋</div>

					<div>
						<span>Total Records</span>
						<strong>
							{isPending ? <span className="mini-spinner" /> : completedCount}
						</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon green">✓</div>

					<div>
						<span>With Visit Notes</span>
						<strong>{withNotes}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon yellow">↻</div>

					<div>
						<span>This Month</span>
						<strong>{thisMonth}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon soft-blue">✦</div>

					<div>
						<span>Completed Visits</span>
						<strong>{completedCount}</strong>
					</div>
				</div>
			</section>

			{/* RECORDS PANEL */}

			<section className="admin-panel medical-records-panel">
				<div className="medical-toolbar">
					<div className="medical-search">
						<span>⌕</span>

						<input
							type="text"
							placeholder="Search patient, owner, or record..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="medical-filters">
						<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
							<option value="all">All Record Types</option>
							{REASONS.map((r) => (
								<option key={r} value={r.toLowerCase()}>
									{r}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="medical-table-wrapper">
					<table className="medical-table">
						<thead>
							<tr>
								<th>PATIENT</th>
								<th>OWNER</th>
								<th>VETERINARIAN</th>
								<th>RECORD TYPE</th>
								<th>DATE</th>
								<th>STATUS</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										Loading medical records…
									</td>
								</tr>
							)}

							{records.map((record) => (
								<tr key={record._id}>
									<td>
										<div className="medical-patient-info">
											<div className="medical-patient-avatar">
												{initials(record.patient)}
											</div>

											<div>
												<strong>{record.patient}</strong>
												<span>{record.species}</span>
											</div>
										</div>
									</td>

									<td>
										<span className="medical-owner">{record.owner}</span>
									</td>

									<td>{record.veterinarian}</td>

									<td>
										<span className="medical-record-type">
											{record.recordType}
										</span>
									</td>

									<td>{record.date}</td>

									<td>
										<span className="medical-status completed">
											{record.status}
										</span>
									</td>

									<td>
										<button
											className="medical-view-button"
											type="button"
											onClick={() => setViewing(record)}
											title={record.notes ? "View record" : "No visit notes"}
										>
											View
										</button>
									</td>
								</tr>
							))}

							{records.length === 0 && !isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										No completed visits yet. Records appear once an
										appointment is marked completed.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="medical-table-footer">
					<span>Showing {records.length} of {completedCount} medical records</span>

					<div className="medical-pagination">
						<button type="button">‹</button>

						<button className="active" type="button">
							1
						</button>

						<button type="button">›</button>
					</div>
				</div>
			</section>

			{showNew && (
				<NewRecordModal appointments={appointments} onClose={() => setShowNew(false)} />
			)}

			{viewing && <RecordView record={viewing} onClose={() => setViewing(null)} />}
		</>
	);
}

export default MedicalRecords;
