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
			match: { value: TIME_REGEX, message: "time must be HH:MM (24h)" },
		},
		duration: { type: Number },
		reason: { type: String },
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
