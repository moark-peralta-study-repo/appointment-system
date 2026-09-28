import { useState } from "react";
import logo from "../assets/logo/happy-paws-logo.png";
import logo2 from "../assets/logo/happy-paws-logo-2.png";

function BookAppointment() {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    petName: "",
    petType: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });


  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


  function handleContinue(e) {
    e.preventDefault();

    if (
      !form.petName ||
      !form.petType ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      alert("Please complete all required fields.");
      return;
    }

    setStep(2);
  }


  function handleConfirm() {
    setStep(3);
  }


  /* ================= CONFIRMATION ================= */

  if (step === 3) {
    return (
      <div className="booking-page">

        <header className="booking-header">

          <a href="/" className="booking-logo">
            <img src={logo2} alt="Mutuals Paws" />
            </a>

        </header>


        <main className="booking-main">

          <div className="appointment-card confirmation-card">

            <div className="confirmation-icon">
              ✓
            </div>

            <span className="confirmation-label">
              APPOINTMENT REQUESTED
            </span>

            <h1>
              You're all set!
            </h1>

            <p>
              Your appointment request has been
              recorded. We look forward to seeing
              you and your pet.
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


            <a
              href="/"
              className="continue-button confirmation-home"
            >
              Back to Home
            </a>

          </div>

        </main>

      </div>
    );
  }


  /* ================= REVIEW ================= */

  if (step === 2) {
    return (
      <div className="booking-page">

        <header className="booking-header">

          <a href="/" className="booking-logo">
  <img src={logo2} alt="Mutuals Paws" />
</a>

          <button
            type="button"
            className="back-home"
            onClick={() => setStep(1)}
          >
            ← Edit Appointment
          </button>

        </header>


        <main className="booking-main">

          <div className="booking-title">

            <span>
              FINAL STEP
            </span>

            <h1>
              Review your appointment
            </h1>

            <p>
              Please check your information before
              submitting your appointment request.
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
                <strong>
                  {form.notes || "No additional notes"}
                </strong>
              </div>

            </div>


            <div className="appointment-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setStep(1)}
              >
                ← Edit
              </button>

              <button
                type="button"
                className="continue-button"
                onClick={handleConfirm}
              >
                Confirm Appointment →
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }


  /* ================= FORM ================= */

  return (
    <div className="booking-page">

      <header className="booking-header">

        <a href="/" className="booking-logo">
  <img src={logo2} alt="Mutuals Paws" />
</a>

        <a
          href="/"
          className="back-home"
        >
          ← Back to Home
        </a>

      </header>


      <main className="booking-main">

        <div className="booking-title">

          <span>
            MUTUALS PAWS
          </span>

          <h1>
            Book an Appointment
          </h1>

          <p>
            Schedule a visit for your pet with
            our veterinary team.
          </p>

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


        <form
          className="appointment-card"
          onSubmit={handleContinue}
        >

          {/* PET */}

          <section className="form-section">

            <h2>
              Tell us about your pet
            </h2>

            <p className="form-description">
              Enter the basic information about
              the pet visiting our clinic.
            </p>


            <div className="appointment-field">

              <label>
                Pet Name *
              </label>

              <input
                type="text"
                name="petName"
                value={form.petName}
                onChange={handleChange}
                placeholder="e.g. Mochi"
              />

            </div>


            <div className="appointment-field">

              <label>
                Pet Type *
              </label>

              <select
                name="petType"
                value={form.petType}
                onChange={handleChange}
              >

                <option value="">
                  Select pet type
                </option>

                <option value="Dog">
                  Dog
                </option>

                <option value="Cat">
                  Cat
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </section>


          {/* SERVICE */}

          <section className="form-section">

            <h2>
              Choose a service
            </h2>

            <p className="form-description">
              What does your pet need today?
            </p>


            <div className="appointment-field">

              <label>
                Service *
              </label>

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
              >

                <option value="">
                  Select a service
                </option>

                <option value="Wellness Exam">
                  Wellness Exam — ₱850+
                </option>

                <option value="Vaccination">
                  Vaccination — ₱550+
                </option>

                <option value="Dental Care">
                  Dental Care — ₱1,200+
                </option>

                <option value="Diagnostics">
                  Diagnostics
                </option>

                <option value="Surgery">
                  Surgery
                </option>

                <option value="Urgent Care">
                  Urgent Care
                </option>

              </select>

            </div>

          </section>


          {/* SCHEDULE */}

          <section className="form-section">

            <h2>
              Choose your schedule
            </h2>

            <p className="form-description">
              Select your preferred date and time.
            </p>


            <div className="date-time-form">

              <div className="appointment-field">

                <label>
                  Preferred Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>


              <div className="appointment-field">

                <label>
                  Preferred Time *
                </label>

                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                >

                  <option value="">
                    Select a time
                  </option>

                  <option value="8:00 AM">
                    8:00 AM
                  </option>

                  <option value="9:00 AM">
                    9:00 AM
                  </option>

                  <option value="10:00 AM">
                    10:00 AM
                  </option>

                  <option value="11:00 AM">
                    11:00 AM
                  </option>

                  <option value="1:00 PM">
                    1:00 PM
                  </option>

                  <option value="2:00 PM">
                    2:00 PM
                  </option>

                  <option value="3:00 PM">
                    3:00 PM
                  </option>

                  <option value="4:00 PM">
                    4:00 PM
                  </option>

                  <option value="5:00 PM">
                    5:00 PM
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* NOTES */}

          <section className="form-section">

            <h2>
              Additional notes
            </h2>

            <p className="form-description">
              Is there anything our veterinary team
              should know before the visit?
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

            <a
              href="/"
              className="cancel-button"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="continue-button"
            >
              Continue →
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default BookAppointment;
