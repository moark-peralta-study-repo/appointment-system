import AdminModal from "../../admin/AdminModal";
import { useCancelMyAppointment } from "../../../hooks/useClientData";
import { format12h, formatDate } from "../../../utils/admin";
import { FiAlertTriangle } from "react-icons/fi";

function ClientCancelModal({ appointment, onClose }) {
	const cancel = useCancelMyAppointment();

	const confirm = () => {
		cancel.mutate(appointment._id, {
			onSuccess: onClose,
			onError: () => {},
		});
	};

	const pet = appointment.pet;
	return (
		<AdminModal
			eyebrow="CANCEL VISIT"
			title="Cancel this appointment?"
			onClose={onClose}
			footer={
				<>
					<button
						className="admin-secondary-button"
						type="button"
						onClick={onClose}
					>
						Keep appointment
					</button>
					<button
						className="admin-secondary-button"
						style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
						type="button"
						disabled={cancel.isPending}
						onClick={confirm}
					>
						{cancel.isPending ? "Cancelling…" : "Yes, cancel it"}
					</button>
				</>
			}
		>
			<p className="admin-slot-note">
				{pet?.name ?? "Your pet"} — {formatDate(appointment.date)} at{" "}
				{format12h(appointment.time)}
			</p>
			<p className="admin-form-desc">
				Cancelling frees the slot so another pet can book it. You can always
				schedule a new visit afterwards.
			</p>
			{cancel.error && (
				<div className="admin-form-error">
					<FiAlertTriangle size={13} /> {cancel.error.message}
				</div>
			)}
		</AdminModal>
	);
}

export default ClientCancelModal;
