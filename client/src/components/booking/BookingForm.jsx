import BookingHeader from "./BookingHeader";

function BookingForm({ form, handleChange, handleContinue }) {
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

				{/* PROGRESS */}
				<div className="booking-progress">
					<div className="progress-step active">
						<span>1</span>
						<p>Appointment Details</p>
					</div>

					<div className="progress-line"></div>

					<div className="progress-step">
						<span>2</span>
						<p>Review</p>
					</div>

					<div className="progress-line"></div>

					<div className="progress-step">
						<span>3</span>
						<p>Confirmation</p>
					</div>
				</div>

				<form className="appointment-card" onSubmit={handleContinue}>
					{/* PET */}
					<section className="form-section">
						<h2>Tell us about your pet</h2>

						<p className="form-description">
							Enter the basic information about the pet visiting our clinic.
						</p>

						<div className="appointment-field">
							<label>Pet Name *</label>

							<input
								type="text"
								name="petName"
								value={form.petName}
								onChange={handleChange}
								placeholder="e.g. Mochi"
							/>
						</div>

						<div className="appointment-field">
							<label>Pet Type *</label>

							<select
								name="petType"
								value={form.petType}
								onChange={handleChange}
							>
								<option value="">Select pet type</option>

								<option value="Dog">Dog</option>

								<option value="Cat">Cat</option>

								<option value="Other">Other</option>
							</select>
						</div>
					</section>

					{/* SERVICE */}
					<section className="form-section">
						<h2>Choose a service</h2>

						<p className="form-description">What does your pet need today?</p>

						<div className="appointment-field">
							<label>Service *</label>

							<select
								name="service"
								value={form.service}
								onChange={handleChange}
							>
								<option value="">Select a service</option>

								<option value="Wellness Exam">Wellness Exam — ₱850+</option>

								<option value="Vaccination">Vaccination — ₱550+</option>

								<option value="Dental Care">Dental Care — ₱1,200+</option>

								<option value="Diagnostics">Diagnostics</option>

								<option value="Surgery">Surgery</option>

								<option value="Urgent Care">Urgent Care</option>
							</select>
						</div>
					</section>

					{/* SCHEDULE */}
					<section className="form-section">
						<h2>Choose your schedule</h2>

						<p className="form-description">
							Select your preferred date and time.
						</p>

						<div className="date-time-form">
							<div className="appointment-field">
								<label>Preferred Date *</label>

								<input
									type="date"
									name="date"
									value={form.date}
									onChange={handleChange}
								/>
							</div>

							<div className="appointment-field">
								<label>Preferred Time *</label>

								<select name="time" value={form.time} onChange={handleChange}>
									<option value="">Select a time</option>

									<option value="8:00 AM">8:00 AM</option>

									<option value="9:00 AM">9:00 AM</option>

									<option value="10:00 AM">10:00 AM</option>

									<option value="11:00 AM">11:00 AM</option>

									<option value="1:00 PM">1:00 PM</option>

									<option value="2:00 PM">2:00 PM</option>

									<option value="3:00 PM">3:00 PM</option>

									<option value="4:00 PM">4:00 PM</option>

									<option value="5:00 PM">5:00 PM</option>
								</select>
							</div>
						</div>
					</section>

					{/* NOTES */}
					<section className="form-section">
						<h2>Additional notes</h2>

						<p className="form-description">
							Is there anything our veterinary team should know before the
							visit?
						</p>

						<textarea
							name="notes"
							value={form.notes}
							onChange={handleChange}
							rows="4"
							placeholder="Example: Mochi has been scratching his left ear..."
						/>
					</section>

					{/* ACTIONS */}
					<div className="appointment-actions">
						<a href="/" className="cancel-button">
							Cancel
						</a>

						<button type="submit" className="continue-button">
							Continue →
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}

export default BookingForm;
