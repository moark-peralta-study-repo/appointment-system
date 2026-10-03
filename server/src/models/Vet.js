import mongoose from "mongoose";
import { TIME_REGEX } from "../utils/constants.js";

const scheduleSchema = new mongoose.Schema(
	{
		day: { type: Number, required: true, min: 0, max: 6 },
		start: {
			type: String,
			required: true,
		},
		end: {
			type: String,
			required: true,
		},
		slotMinutes: { type: Number, required: true, min: 5 },
	},
	{ _id: false },
);

const vetSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		specialty: { type: String },
		bio: { type: String },
		schedule: { type: [scheduleSchema], default: [] },
		active: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

scheduleSchema.path("start").match(TIME_REGEX, "start must be HH:MM (24h)");
scheduleSchema.path("end").match(TIME_REGEX, "end must be HH:MM (24h)");
const Vet = mongoose.model("Vet", vetSchema);
export default Vet;
