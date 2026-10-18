import AdminModal from "../AdminModal";

const RECORD_ROWS = [
	["FINDINGS", "findings"],
	["DIAGNOSIS", "diagnosis"],
	["TREATMENT", "treatment"],
	["MEDICATIONS", "medications"],
	["FOLLOW-UP", "followUp"],
];

function MedicalRecordView({ record, onClose }) {
	const rec = record.medicalRecord;
	const hasStructured = Boolean(rec?.findings);
	return (
		<AdminModal
			eyebrow="MEDICAL RECORD"
			title={`${record.patient} — ${record.recordType}`}
			onClose={onClose}
			wide
		>
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

				{hasStructured ? (
					RECORD_ROWS.map(([label, key]) =>
						rec[key] ? (
							<div className="admin-detail-item full" key={key}>
								<span>{label}</span>
								<strong
									style={{
										whiteSpace: "pre-wrap",
										fontFamily: "'Baloo Thambi 2', sans-serif",
										fontSize: 15,
									}}
								>
									{rec[key]}
								</strong>
							</div>
						) : null,
					)
				) : (
					<div className="admin-detail-item full">
						<span>VISIT NOTES</span>
						<strong
							style={{
								whiteSpace: "pre-wrap",
								fontFamily: "'Baloo Thambi 2', sans-serif",
								fontSize: 15,
							}}
						>
							{record.notes || "No notes recorded for this visit."}
						</strong>
					</div>
				)}

				{hasStructured && record.notes && (
					<div className="admin-detail-item full">
						<span>VISIT SUMMARY (EMAIL)</span>
						<strong
							style={{
								whiteSpace: "pre-wrap",
								fontFamily: "'Baloo Thambi 2', sans-serif",
								fontSize: 15,
							}}
						>
							{record.notes}
						</strong>
					</div>
				)}
			</div>
		</AdminModal>
	);
}

export default MedicalRecordView;
