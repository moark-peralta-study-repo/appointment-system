import AdminModal from "../../admin/AdminModal";
import { useDeleteMyPet } from "../../../hooks/useClientData";
import { FiAlertTriangle } from "react-icons/fi";


function ClientPetDeleteModal({ pet, onClose }) {
	const deletePet = useDeleteMyPet();
	return (
		<AdminModal
			eyebrow="MY PETS"
			title={`Remove ${pet.name}?`}
			onClose={onClose}
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Keep
					</button>
					<button
						className="admin-secondary-button"
						style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
						type="button"
						disabled={deletePet.isPending}
						onClick={() => deletePet.mutate(pet._id, { onSuccess: onClose })}
					>
						{deletePet.isPending ? "Removing…" : "Remove pet"}
					</button>
				</>
			}
		>
			<p className="admin-form-desc">
				{pet.name} will be removed from your account. Past appointments stay in
				your history, but future bookings will need a pet on file.
			</p>
			{deletePet.error && <div className="admin-form-error"><FiAlertTriangle size={13} /> {deletePet.error.message}</div>}
		</AdminModal>
	);
}


export default ClientPetDeleteModal;
