import BookingHeader from "./BookingHeader";

function BookingConfirmation({ form }) {
	return (
		<div className="booking-page">
			<BookingHeader />

			<main className="booking-main">
				<div className="appointment-card confirmation-card">
					<div className="confirmation-icon">✓</div>

					<span className="confirmation-label">APPOINTMENT REQUESTED</span>

					<h1>You're all set!</h1>

					<p>
						Your appointment request has been recorded. We look forward to
						seeing you and your pet.
					</p>

					<div className="confirmation-details">
						<div>
							<span>Pet</span>
							<strong>{form.petName}</strong>
						</div>

						<div>
							<span>Service</span>
							<strong>{form.service}</strong>
						</div>

						<div>
							<span>Date</span>
							<strong>{form.date}</strong>
						</div>

						<div>
							<span>Time</span>
							<strong>{form.time}</strong>
						</div>
					</div>

					<a href="/" className="continue-button confirmation-home">
						Back to Home
					</a>
				</div>
			</main>
		</div>
	);
}

export default BookingConfirmation;
