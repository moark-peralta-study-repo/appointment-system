import mongoose from "mongoose";
import { TIME_REGEX } from "../utils/constants.js";

const appointmentSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
		vet: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: Date, required: true },
		time: {
			type: String,
			required: true,
		},
		duration: { type: Number },
		reason: { type: String },
		// Free-text the pet owner adds on the public booking form
		// (allergies, behavior, etc.). Kept separate from `reason` so the
		// Reports "popular services" view can count `reason` cleanly.
		ownerNotes: { type: String },
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled"],
			default: "pending",
		},
		vetNotes: { type: String },
		// Structured medical record written by a clinical role (vet/admin)
		// when the visit is completed. A completed appointment IS the visit
		// record — per-pet history = that pet's completed appointments.
		// `findings` is the one required field; enforced in the service +
		// validation middleware (Mongoose `required` on a nested path would
		// fire on every save once the record exists, so we validate there).
		medicalRecord: {
			findings: { type: String },
			diagnosis: { type: String },
			treatment: { type: String },
			medications: { type: String },
			followUp: { type: String },
		},
	},
	{ timestamps: true },
);

appointmentSchema.path("time").match(TIME_REGEX, "time must be HH:MM (24h)");

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
