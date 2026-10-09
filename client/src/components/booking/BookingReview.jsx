import { FaArrowRight } from "react-icons/fa";
import BookingHeader from "./BookingHeader";
import { useVets, useBookAppointment } from "../../hooks/useAdminData";
import { format12h, formatDate } from "../../utils/admin";

// Step 4 — show the full booking and fire the real POST /appointments.
function BookingReview({ booking, pet, account, onBack, onConfirm }) {
	const { data: vets = [] } = useVets();
	const book = useBookAppointment();
	const vet = vets.find((v) => v._id === booking.vetId);

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

					<p>Please check your information before submitting your appointment request.</p>
				</div>

				<div className="appointment-card">
					<div className="review-appointment">
						<div className="review-row">
							<span>Pet</span>

							<strong>
								{pet?.name ?? "—"}
								{pet?.species ? ` (${pet.species})` : ""}
							</strong>
						</div>

						<div className="review-row">
							<span>Booked for</span>

							<strong>
								{account?.name ?? "—"}
								{account?.email ? ` · ${account.email}` : ""}
							</strong>
						</div>

						<div className="review-row">
							<span>Service</span>

							<strong>{booking.service}</strong>
						</div>

						<div className="review-row">
							<span>Veterinarian</span>

							<strong>{vet?.name ?? "—"}</strong>
						</div>

						<div className="review-row">
							<span>Date</span>

							<strong>{formatDate(booking.date)}</strong>
						</div>

						<div className="review-row">
							<span>Time</span>

							<strong>{format12h(booking.time)}</strong>
						</div>

						<div className="review-row">
							<span>Additional Notes</span>

							<strong>{booking.notes || "No additional notes"}</strong>
						</div>
					</div>

					{book.error && (
						<div className="admin-form-error">
							⚠ {book.error.message} — pick a different time or date.
						</div>
					)}

					<div className="appointment-actions">
						<button type="button" className="cancel-button" onClick={onBack}>
							← Edit
						</button>

						<button
							type="button"
							className="continue-button"
							disabled={book.isPending}
							onClick={() =>
								book.mutate(
									{
										vetId: booking.vetId,
										petId: pet._id,
										date: booking.date,
										time: booking.time,
										reason: booking.service,
										ownerNotes: booking.notes || undefined,
									},
									{ onSuccess: onConfirm },
								)
							}
						>
							{book.isPending ? "Booking…" : "Confirm Appointment"} <FaArrowRight />
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

export default BookingReview;
