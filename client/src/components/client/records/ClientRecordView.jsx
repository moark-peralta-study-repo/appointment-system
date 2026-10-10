import AdminModal from "../../admin/AdminModal";
import { formatDate, format12h } from "../../../utils/admin";
import { SpeciesIcon } from "../../shared/Species";


function ClientRecordView({ record, onClose }) {
	const pet = record.pet;
	return (
		<AdminModal
			eyebrow="VISIT NOTES"
			title={`${pet?.name ?? "Your pet"} — ${record.reason ?? "Visit"}`}
			onClose={onClose}
			wide
		>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>PET</span>
					<strong>
						{pet?.name ?? "Unknown"}
						<small>{pet?.breed ?? pet?.species ?? ""}</small>
					</strong>
				</div>
				<div className="admin-detail-item">
					<span>VETERINARIAN</span>
					<strong>{record.vet ?? "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>DATE</span>
					<strong>
						{formatDate(record.date)} · {format12h(record.time)}
					</strong>
				</div>
				<div className="admin-detail-item">
					<span>REASON</span>
					<strong>{record.reason ?? "—"}</strong>
				</div>
				<div className="admin-detail-item full">
					<span>VISIT NOTES</span>
					{record.vetNotes ? (
						<p className="client-record-notes">{record.vetNotes}</p>
					) : (
						<p className="admin-panel-empty">No notes were recorded for this visit.</p>
					)}
				</div>
			</div>
		</AdminModal>
	);
}


export default ClientRecordView;
