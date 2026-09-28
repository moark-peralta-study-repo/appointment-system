import { Link } from "react-router-dom";

function QuickBooking() {
	return (
		<section className="booking">
			<div className="booking-inner">
				<div className="booking-heading">
					<h2>Find an appointment</h2>

					<p>
						Tell us what your pet needs and we'll help you find the right time.
					</p>
				</div>

				<div className="booking-fields">
					<div className="field">
						<label>Pet Type</label>

						<select defaultValue="">
							<option value="" disabled>
								Select pet type
							</option>

							<option>Dog</option>

							<option>Cat</option>

							<option>Other</option>
						</select>
					</div>

					<div className="field">
						<label>Reason for Visit</label>

						<select defaultValue="">
							<option value="" disabled>
								Select service
							</option>

							<option>Wellness Exam</option>

							<option>Vaccination</option>

							<option>Dental Care</option>

							<option>Diagnostic Testing</option>
						</select>
					</div>

					<div className="field">
						<label>Preferred Date</label>

						<input type="date" aria-label="Preferred appointment date" />
					</div>

					<Link to="/book-appointment" className="find-button">
						Find Times →
					</Link>
				</div>
			</div>
		</section>
	);
}

export default QuickBooking;
