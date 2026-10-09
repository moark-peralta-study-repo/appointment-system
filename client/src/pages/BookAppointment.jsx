import { useState } from "react";
import { useAuth } from "../context/useAuth";
import BookingHeader from "../components/booking/BookingHeader";
import BookingAccountStep from "../components/booking/BookingAccountStep";
import BookingPetStep from "../components/booking/BookingPetStep";
import BookingScheduleStep from "../components/booking/BookingScheduleStep";
import BookingReview from "../components/booking/BookingReview";
import BookingConfirmation from "../components/booking/BookingConfirmation";

const STEPS = ["Account", "Your pet", "Schedule", "Review"];

// The public booking flow. Each step hits the real API:
//   1 Account   — register or sign in (POST /auth/register, /auth/login)
//   2 Pet       — pick an existing pet or create one (POST /pets)
//   3 Schedule  — service + vet + a genuinely free slot (GET /vets/:id?date=)
//   4 Review    — POST /appointments, then a real confirmation
//
// A completed booking shows up in the owner's client portal AND in the
// admin dashboard — the demo loop is closed.
function BookAppointment() {
	const { user } = useAuth();
	const [step, setStep] = useState(1);
	const [pet, setPet] = useState(null);
	const [booking, setBooking] = useState({ service: "", vetId: "", date: "", time: "", notes: "" });
	const [confirmed, setConfirmed] = useState(null);

	const account = user?.role !== "vet" ? user : null;

	if (confirmed) {
		return <BookingConfirmation appointment={confirmed} />;
	}

	if (step === 4) {
		return (
			<BookingReview
				booking={booking}
				pet={pet}
				account={account}
				onBack={() => setStep(3)}
				onConfirm={(appointment) => {
					setConfirmed(appointment);
					window.scrollTo(0, 0);
				}}
			/>
		);
	}

	return (
		<div className="booking-page">
			<BookingHeader
				right={
					<a href="/" className="back-home">
						← Back to Home
					</a>
				}
			/>

			<main className="booking-main">
				<div className="booking-title">
					<span>MUTUALS PAWS</span>

					<h1>Book an Appointment</h1>

					<p>Schedule a visit for your pet with our veterinary team.</p>
				</div>

				{/* PROGRESS — 4 steps */}
				<div className="booking-progress booking-progress-4">
					{STEPS.map((label, i) => (
						<span key={label} style={{ display: "contents" }}>
							<div
								className={`progress-step ${step > i + 1 ? "done" : step === i + 1 ? "active" : ""}`}
							>
								<span>{step > i + 1 ? "✓" : i + 1}</span>
								<p>{label}</p>
							</div>

							{i < STEPS.length - 1 && <div className="progress-line" />}
						</span>
					))}
				</div>

				{step === 1 && <BookingAccountStep onDone={() => setStep(2)} />}

				{step === 2 && (
					<BookingPetStep
						onDone={(p) => {
							setPet(p);
							setStep(3);
						}}
						onBack={() => setStep(1)}
					/>
				)}

				{step === 3 && (
					<BookingScheduleStep
						onDone={(b) => {
							setBooking(b);
							setStep(4);
						}}
						onBack={() => setStep(2)}
					/>
				)}
			</main>
		</div>
	);
}

export default BookAppointment;
