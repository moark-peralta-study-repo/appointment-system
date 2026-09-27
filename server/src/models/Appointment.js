import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
	vet: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
