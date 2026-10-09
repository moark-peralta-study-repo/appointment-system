import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import BookingHeader from "./BookingHeader";
import { format12h, formatDate } from "../../utils/admin";

function BookingConfirmation({ appointment }) {
	return (
		<div className="booking-page">
			<BookingHeader />

			<main className="booking-main">
				<div className="appointment-card confirmation-card">
					<div className="confirmation-icon"><FaCheck size={22} /></div>

					<span className="confirmation-label">APPOINTMENT REQUESTED</span>

					<h1>You're all set!</h1>

					<p>
						Your booking is in — the clinic will confirm it shortly. You can
						track and manage it any time from your client portal.
					</p>

					<div className="confirmation-details">
						<div>
							<span>Pet</span>

							<strong>{appointment?.pet?.name ?? "—"}</strong>
						</div>

						<div>
							<span>Service</span>

							<strong>{appointment?.reason ?? "—"}</strong>
						</div>

						<div>
							<span>Veterinarian</span>

							<strong>{appointment?.vet ?? "—"}</strong>
						</div>

						<div>
							<span>Date</span>

							<strong>{formatDate(appointment?.date)}</strong>
						</div>

						<div>
							<span>Time</span>

							<strong>{format12h(appointment?.time)}</strong>
						</div>

						<div>
							<span>Status</span>

							<strong className="confirmation-status">
								{appointment?.status ? appointment.status.toUpperCase() : "PENDING"}
							</strong>
						</div>
					</div>

					<div className="confirmation-actions">
						<Link to="/client/dashboard" className="continue-button confirmation-home">
							Manage in Client Portal
						</Link>

						<a href="/" className="cancel-button">
							Back to Home
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}

export default BookingConfirmation;
