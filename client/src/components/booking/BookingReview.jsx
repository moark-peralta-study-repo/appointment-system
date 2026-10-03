import { FaArrowRight } from "react-icons/fa";
import BookingHeader from "./BookingHeader";

function BookingReview({ form, onBack, onConfirm }) {
	return (
		<div className="booking-page">
			<BookingHeader
				right={
					<button type="button" className="back-home" onClick={onBack}>
						← Edit Appointment
					</button>
				}
			/>

			<main className="booking-main">
				<div className="booking-title">
					<span>FINAL STEP</span>

					<h1>Review your appointment</h1>

					<p>
						Please check your information before submitting your appointment
						request.
					</p>
				</div>

				<div className="appointment-card">
					<div className="review-appointment">
						<div className="review-row">
							<span>Pet Name</span>
							<strong>{form.petName}</strong>
						</div>

						<div className="review-row">
							<span>Pet Type</span>
							<strong>{form.petType}</strong>
						</div>

						<div className="review-row">
							<span>Service</span>
							<strong>{form.service}</strong>
						</div>

						<div className="review-row">
							<span>Date</span>
							<strong>{form.date}</strong>
						</div>

						<div className="review-row">
							<span>Time</span>
							<strong>{form.time}</strong>
						</div>

						<div className="review-row">
							<span>Additional Notes</span>
							<strong>{form.notes || "No additional notes"}</strong>
						</div>
					</div>

					<div className="appointment-actions">
						<button type="button" className="cancel-button" onClick={onBack}>
							← Edit
						</button>

						<button
							type="button"
							className="continue-button"
							onClick={onConfirm}
						>
							Confirm Appointment <FaArrowRight />
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default BookingReview;
