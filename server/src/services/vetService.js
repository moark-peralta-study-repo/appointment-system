import mongoose from "mongoose";
import Vet from "../models/Vet.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Appointment from "../models/Appointment.js";
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

export async function createVet(
	actor,
	{ name, email, password, specialty, bio, schedule },
) {
	if (await User.findOne({ email })) {
		throw new ApiError(409, "A user with this email already exists");
	}

	const user = await User.create({ name, email, password, role: "vet" });

	const vet = await Vet.create({
		user: user._id,
		specialty,
		bio,
		schedule: schedule ?? [],
	});

	const safeUser = await User.findById(user._id);

	return {
		_id: vet._id,
		user: safeUser,
		specialty: vet.specialty,
		bio: vet.bio,
		schedule: vet.schedule,
	};
}

export async function updateVet(
	actor,
	vetId,
	{ specialty, bio, schedule, active },
) {
	if (!mongoose.isValidObjectId(vetId)) {
		throw new ApiError(404, "Vet not found");
	}

	const vet = await Vet.findById(vetId);
	if (!vet) throw new ApiError(404, "Vet not found");

	if (specialty !== undefined) vet.specialty = specialty;
	if (bio !== undefined) vet.bio = bio;
	if (schedule !== undefined) vet.schedule = schedule;
	if (active !== undefined) vet.active = active;

	await vet.save();
	return vet;
}

export async function deactivateVet(actor, vetId) {
	if (!mongoose.isValidObjectId(vetId)) {
		throw new ApiError(404, "Vet not found");
	}

	const vet = await Vet.findById(vetId);
	if (!vet) throw new ApiError(404, "Vet not found");

	vet.active = false;
	await vet.save();

	return { message: "Vet deactivated", vet };
}

export async function listUsers() {
	return await User.find({}, "name email phone role createdAt");
}

export async function getStats() {
	// Dates are stored as local-midnight instants, so label the byDay
	// buckets with the server's local timezone too (UTC would show D-1).
	const off = -new Date().getTimezoneOffset();
	const sign = off >= 0 ? "+" : "-";
	const tz = `${sign}${String(Math.floor(Math.abs(off) / 60)).padStart(2, "0")}:${String(Math.abs(off) % 60).padStart(2, "0")}`;

	const [users, vets, pets, appointments, byStatus, byDay] = await Promise.all([
		User.countDocuments(),
		Vet.countDocuments({ active: true }),
		Pet.countDocuments(),
		Appointment.countDocuments(),
		Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
		Appointment.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: tz } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: -1 } },
			{ $limit: 14 },
		]),
	]);

	return {
		users,
		vets,
		pets,
		appointments,
		byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
		byDay: Object.fromEntries(byDay.map((d) => [d._id, d.count])),
	};
}
