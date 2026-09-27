import mongoose from "mongoose";

const vetSchema = new mongoose.Scheme({
	user: { type: mongoose.Types.ObjectId, ref: "User" },
	specialty: { type: String },
	bio: { type: String },
	schedule: [scheduleSchema],
});

const scheduleSchema = new mongoose.Schema(
	{
		day: { type: Number, required: true, min: 0, max: 6 },
		start: { type: String, required: true },
		end: { type: String, required: true },
		slotMinutes: { type: Number, required: true, min: 5 },
	},
	{ _id: false },
);

const Vet = mongoose.model("Vet", vetSchema);
export default Vet;
