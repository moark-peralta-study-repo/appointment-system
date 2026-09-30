import Vet from "../models/Vet.js";
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { getFreeSlots } from "../utils/slots.js";

function parseDateParam(param) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(param)) {
		throw new ApiError(400, "date must be YYYY-MM-DD");
	}

	const [y, m, d] = param.split("-").map(Number);
	const date = new Date(y, m - 1, d);

	if (
		date.getFullYear() !== y ||
		date.getMonth() !== m - 1 ||
		date.getDate() !== d
	) {
		throw new ApiError(400, "date must be a real calendar date");
	}

	return date;
}

export async function listVets() {
	const vets = await Vet.find({ active: true }).populate("user", "name");
	return vets.map((v) => ({
		_id: v._id,
		name: v.user.name,
		specialty: v.specialty,
		schedule: v.schedule,
	}));
}

export async function getVetDetails(vetId, dateParam) {
	if (!mongoose.isValidObjectId(vetId)) {
		throw new ApiError(404, "Vet not found");
	}

	const date = parseDateParam(dateParam);

	const vet = await Vet.findOne({ _id: vetId, active: true }).populate(
		"user",
		"name",
	);

	if (!vet) throw new ApiError(404, "Vet not found");

	const end = new Date(date);
	end.setDate(end.getDate() + 1);

	const bookings = await Appointment.find({
		vet: vet.user,
		date: { $gte: date, $lt: end },
		status: { $ne: "cancelled" },
	}).select("time");

	const bookedTimes = bookings.map((b) => b.time);

	const freeSlots = getFreeSlots(vet.schedule, bookedTimes, date);

	return {
		_id: vet._id,
		name: vet.user.name,
		specialty: vet.specialty,
		schedule: vet.schedule,
		freeSlots,
	};
}
