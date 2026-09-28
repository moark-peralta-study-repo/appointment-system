import { useState } from "react";

import BookingForm from "../components/booking/BookingForm";
import BookingReview from "../components/booking/BookingReview";
import BookingConfirmation from "../components/booking/BookingConfirmation";

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

	if (step === 3) {
		return <BookingConfirmation form={form} />;
	}

	if (step === 2) {
		return (
			<BookingReview
				form={form}
				onBack={() => setStep(1)}
				onConfirm={handleConfirm}
			/>
		);
	}

	return (
		<BookingForm
			form={form}
			handleChange={handleChange}
			handleContinue={handleContinue}
		/>
	);
}

export default BookAppointment;
