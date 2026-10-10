import AdminModal from "../AdminModal";
import { formatDate } from "../../../utils/admin";
import { PiCat, PiDog } from "react-icons/pi";
import { SpeciesIcon } from "../../shared/Species";

function AdminOwnerView({ owner, pets, visits, onClose }) {
	return (
		<AdminModal
			eyebrow="OWNER RECORD"
			title={owner.name}
			onClose={onClose}
			wide
		>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>EMAIL</span>
					<strong>{owner.email}</strong>
				</div>
				<div className="admin-detail-item">
					<span>PHONE</span>
					<strong>{owner.phone || "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>REGISTERED</span>
					<strong>{formatDate(owner.createdAt)}</strong>
				</div>
				<div className="admin-detail-item">
					<span>REGISTERED PETS</span>
					<strong>
						{pets.length} pet{pets.length === 1 ? "" : "s"}
					</strong>
				</div>
			</div>

			<div className="admin-detail-section">PETS</div>

			{pets.length === 0 ? (
				<p className="admin-slot-note">No pets registered yet.</p>
			) : (
				<div className="admin-detail-grid">
					{pets.map((p) => (
						<div className="admin-detail-item" key={p._id}>
							<span>SPECIES</span>
							<strong>
								{p.species === "cat" ? (
									<PiCat size={15} />
								) : (
									<PiDog size={15} />
								)}{" "}
								{p.name}
							</strong>
							<small>
								{p.breed ?? p.species}
								{p.age != null ? ` · ${p.age} yrs` : ""}
								{p.notes ? " · Under observation" : ""}
							</small>
						</div>
					))}
				</div>
			)}

			<div className="admin-detail-section">APPOINTMENTS</div>

			{visits.length === 0 ? (
				<p className="admin-slot-note">No appointments on file.</p>
			) : (
				<div className="admin-detail-grid">
					{visits.map((v) => (
						<div className="admin-detail-item" key={v._id}>
							<span>
								{formatDate(v.date)} · {v.status?.toUpperCase()}
							</span>
							<strong>
								{v.pet?.name ?? "Unknown"} — {v.reason ?? "Visit"}
							</strong>
							<small>Dr. {(v.vet ?? "").replace(/^Dr\.\s*/, "") || "—"}</small>
						</div>
					))}
				</div>
			)}
		</AdminModal>
	);
}

export default AdminOwnerView;
