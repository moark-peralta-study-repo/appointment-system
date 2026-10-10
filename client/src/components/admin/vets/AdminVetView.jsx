import { useState } from "react";
import AdminModal from "../AdminModal";
import { useUsers, useDeactivateVet } from "../../../hooks/useAdminData";
import { scheduleLabel } from "../../../utils/schedule";


function AdminVetView({ vet, onClose }) {
	const { data: users = [] } = useUsers();
	const deactivateVet = useDeactivateVet();
	const [confirming, setConfirming] = useState(false);

	// The public vet list omits email/phone — the vet's name matches their
	// staff user record, so look it up there.
	const user = users.find((u) => u.name === vet.name);
	const phone = user?.phone;

	return (
		<AdminModal
			eyebrow="STAFF PROFILE"
			title={vet.name}
			onClose={onClose}
			wide
			footer={
				<>
					{confirming ? (
						<>
							<span className="admin-slot-note">
								{deactivateVet.error?.message ?? "Remove " + vet.name + " from the roster?"}
							</span>
							<button className="admin-secondary-button" type="button" onClick={() => setConfirming(false)}>
								Keep
							</button>
							<button
								className="row-action cancel"
								type="button"
								disabled={deactivateVet.isPending}
								onClick={() =>
									deactivateVet.mutate(vet._id, { onSuccess: onClose })
								}
							>
								{deactivateVet.isPending ? "Removing…" : "Deactivate"}
							</button>
						</>
					) : (
						<>
							<button className="admin-secondary-button" type="button" onClick={onClose}>
								Close
							</button>
							<button className="row-action cancel" type="button" onClick={() => setConfirming(true)}>
								Deactivate
							</button>
						</>
					)}
				</>
			}
		>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>EMAIL</span>
					<strong>{user?.email ?? "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>PHONE</span>
					<strong>{phone ?? "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>SPECIALTY</span>
					<strong>{vet.specialty ?? "General"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>WORKING HOURS</span>
					<strong>{scheduleLabel(vet.schedule)}</strong>
				</div>
				{vet.bio && (
					<div className="admin-detail-item full">
						<span>BIO</span>
						<strong>{vet.bio}</strong>
					</div>
				)}
			</div>
		</AdminModal>
	);
}


export default AdminVetView;
