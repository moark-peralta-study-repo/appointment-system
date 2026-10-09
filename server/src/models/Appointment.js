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
	},
	{ timestamps: true },
);

appointmentSchema.path("time").match(TIME_REGEX, "time must be HH:MM (24h)");

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
