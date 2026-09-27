import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String, required: true },
		species: {
			type: String,
			enum: ["dog", "cat", "bird", "rabbit", "other"],
			required: true,
		},
		breed: { type: String },
		age: { type: Number },
		gender: { type: String },
		notes: { type: String },
	},
	{ timestamps: true },
);

const Pet = mongoose.model("Pet", petSchema);
export default Pet;
