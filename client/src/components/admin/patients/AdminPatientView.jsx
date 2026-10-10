import AdminModal from "../AdminModal";
import { formatDate } from "../../../utils/admin";

function AdminPatientView({ pet, ownersById, visits, onClose }) {
	return (
		<AdminModal
			eyebrow="PATIENT RECORD"
			title={pet.name}
			onClose={onClose}
			wide
		>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>OWNER</span>
					<strong>{ownersById[pet.owner]?.name ?? "—"}</strong>
					<small>{ownersById[pet.owner]?.email ?? ""}</small>
				</div>
				<div className="admin-detail-item">
					<span>SPECIES / BREED</span>
					<strong>
						{pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1)}
						{pet.breed ? ` — ${pet.breed}` : ""}
					</strong>
				</div>
				<div className="admin-detail-item">
					<span>AGE</span>
					<strong>{pet.age != null ? `${pet.age} years` : "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>GENDER</span>
					<strong>
						{pet.gender?.charAt(0).toUpperCase() + pet.gender?.slice(1) ?? "—"}
					</strong>
				</div>
				<div className="admin-detail-item full">
					<span>STATUS</span>
					<strong>{pet.notes ? "Under Observation" : "Healthy"}</strong>
					{pet.notes && <small>{pet.notes}</small>}
				</div>
			</div>

			<div className="admin-detail-section">VISIT HISTORY</div>

			{visits.length === 0 ? (
				<p className="admin-slot-note">No visits on record yet.</p>
			) : (
				<div className="admin-detail-grid">
					{visits.map((v) => (
						<div className="admin-detail-item" key={v._id}>
							<span>
								{formatDate(v.date)} · {v.status?.toUpperCase()}
							</span>
							<strong>{v.reason ?? "Visit"}</strong>
							<small>
								Dr. {(v.vet ?? "").replace(/^Dr\.\s*/, "") || "—"}
								{v.vetNotes ? ` — ${v.vetNotes}` : ""}
							</small>
						</div>
					))}
				</div>
			)}
		</AdminModal>
	);
}

export default AdminPatientView;
