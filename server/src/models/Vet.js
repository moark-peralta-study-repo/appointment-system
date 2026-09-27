import mongoose from "mongoose";
import {TIME_REGEX} from "../utils/constants.js";

const scheduleSchema = new mongoose.Schema(
	{
		day: { type: Number, required: true, min: 0, max: 6 },
		start: {
			type: String,
			required: true,
			match: { value: TIME_REGEX, message: "start must be HH:MM (24h)" },
		},
		end: {
			type: String,
			required: true,
			match: { value: TIME_REGEX, message: "end must be HH:MM (24h)" },
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
	},
	{ timestamps: true },
);

const Vet = mongoose.model("Vet", vetSchema);
export default Vet;
