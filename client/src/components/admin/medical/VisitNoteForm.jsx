import { useState } from "react";
import AdminModal from "../AdminModal";
import { useAddVisitNote } from "../../../hooks/useAdminData";
import { formatDate } from "../../../utils/admin";
import { FiAlertTriangle } from "react-icons/fi";
import { useFieldErrors, required } from "../../../utils/validate";

const RECORD_FIELDS = [
	{ key: "findings", label: "Findings", required: true, rows: 4, placeholder: "Exam observations: body condition, vitals, abnormalities…" },
	{ key: "diagnosis", label: "Diagnosis", required: false, rows: 2, placeholder: "Working or confirmed diagnosis" },
	{ key: "treatment", label: "Treatment", required: false, rows: 2, placeholder: "What was done: procedure, surgery, imaging…" },
	{ key: "medications", label: "Medications", required: false, rows: 2, placeholder: "Drug, dose, frequency, duration" },
	{ key: "followUp", label: "Follow-up", required: false, rows: 2, placeholder: "Recheck date or recommended next steps" },
];

function AdminVisitNoteForm({ appointments, presetId, onClose }) {
	const addNote = useAddVisitNote();

	// Only confirmed (today) or pending visits can become records.
	const eligible = appointments
		.filter((a) => a.status === "confirmed" || a.status === "pending")
		.sort((x, y) => new Date(y.date) - new Date(x.date));

	const [apptId, setApptId] = useState(
		presetId && eligible.some((a) => a._id === presetId)
			? presetId
			: eligible[0]?._id ?? "",
	);
	const selected = eligible.find((a) => a._id === apptId);
	const [record, setRecord] = useState({});
	const [errors, validate, clear] = useFieldErrors();

	const submit = () => {
		const rules = {
			visit: selected ? "" : "Select a visit to record.",
			findings: required(record.findings, "Findings are required"),
		};
		if (Object.keys(validate(rules)).length) return;
		const clean = {};
		for (const f of RECORD_FIELDS) {
			const v = (record[f.key] ?? "").trim();
			if (v) clean[f.key] = v;
		}
		addNote.mutate(
			{ id: selected._id, record: clean },
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
						disabled={addNote.isPending}
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
					— or add a record via the Appointments page.
				</p>
			) : (
				<div className="admin-form-grid">
					<div className="admin-form-field full">
						<label>Visit to Record</label>
						<select
							value={apptId}
							onChange={(e) => {
								setApptId(e.target.value);
								setRecord({});
								clear("visit")();
							}}
							className={errors.visit ? "invalid" : ""}
							aria-invalid={errors.visit ? true : undefined}
						>
							{eligible.map((a) => (
								<option key={a._id} value={a._id}>
									{formatDate(a.date)} — {a.pet?.name ?? "Unknown"} —{" "}
									{a.reason ?? "Visit"} ({a.status})
								</option>
							))}
						</select>
						{errors.visit && (
							<p className="field-error" role="alert">
								{errors.visit}
							</p>
						)}
						{selected && (
							<p className="admin-slot-note">
								Saving marks this visit as <strong>Completed</strong> and
								stores the structured record below. The owner is emailed a
								summary of the visit.
							</p>
						)}
					</div>

					{RECORD_FIELDS.map((f) => (
						<div className="admin-form-field full" key={f.key}>
							<label>
								{f.label}
								{f.required ? <span> *</span> : null}
							</label>
							<textarea
								rows={f.rows}
								value={record[f.key] ?? ""}
								onChange={(e) => {
									setRecord((r) => ({ ...r, [f.key]: e.target.value }));
									clear(f.key)();
								}}
								className={errors[f.key] ? "invalid" : ""}
								aria-invalid={errors[f.key] ? true : undefined}
								placeholder={f.placeholder}
							/>
							{errors[f.key] && (
								<p className="field-error" role="alert">
									{errors[f.key]}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</AdminModal>
	);
}

export default AdminVisitNoteForm;
