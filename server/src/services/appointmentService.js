import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import Vet from "../models/Vet.js";
import ApiError from "../utils/ApiError.js";
import { getFreeSlots } from "../utils/slots.js";

const STATUS_FLOW = {
	pending: ["confirmed", "completed", "cancelled"],
	confirmed: ["completed", "cancelled"],
	completed: [],
	cancelled: [],
};

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

export async function listAppointments(user) {
	const filter = user.role === "vet" ? {} : { owner: user._id };

	const appointments = await Appointment.find(filter)
		.populate("pet")
		.populate({ path: "vet", select: "name" })
		.sort({ date: 1, time: 1 });

	return appointments.map((a) => ({
		...a.toObject(),
		vet: a.vet?.name ?? null,
	}));
}

export async function bookAppointment(user, { vetId, petId, date: dateParam, time, reason }) {
	if (!mongoose.isValidObjectId(vetId)) throw new ApiError(404, "Vet not found");
	if (!mongoose.isValidObjectId(petId)) throw new ApiError(404, "Pet not found");

	const date = parseDateParam(dateParam);

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (date < today) throw new ApiError(400, "Cannot book an appointment in the past");

	// vetId is the Vet profile id (what GET /api/vets returns)
	const vet = await Vet.findOne({ _id: vetId, active: true });
	if (!vet) throw new ApiError(404, "Vet not found or inactive");
	const vetUser = await User.findById(vet.user);
	if (!vetUser) throw new ApiError(404, "Vet not found");

	const pet = await Pet.findById(petId);
	if (!pet) throw new ApiError(404, "Pet not found");

	// A vet books on behalf of a patient — the owner stays the pet's owner.
	// An owner can only book their own pets.
	const isVet = user.role === "vet";
	if (!isVet && !pet.owner.equals(user._id)) throw new ApiError(403, "Not your pet");
	const ownerId = isVet ? pet.owner._id : user._id;

	const end = new Date(date);
	end.setDate(end.getDate() + 1);

	const bookings = await Appointment.find({
		vet: vetUser._id,
		date: { $gte: date, $lt: end },
		status: { $ne: "cancelled" },
	}).select("time");

	const freeSlots = getFreeSlots(vet.schedule, bookings.map((b) => b.time), date);
	if (!freeSlots.includes(time)) {
		throw new ApiError(409, "That time slot is not available");
	}

	const appointment = await Appointment.create({
		owner: ownerId,
		pet: pet._id,
		vet: vetUser._id,
		date,
		time,
		reason,
		duration: vet.schedule.find((e) => e.day === date.getDay())?.slotMinutes,
	});

	const populated = await Appointment.findById(appointment._id)
		.populate("pet")
		.populate({ path: "vet", select: "name" });

	return {
		...populated.toObject(),
		vet: populated.vet?.name ?? null,
	};
}

export async function updateStatus(actor, appointmentId, { status, vetNotes }) {
	if (!mongoose.isValidObjectId(appointmentId)) {
		throw new ApiError(404, "Appointment not found");
	}

	const appointment = await Appointment.findById(appointmentId);
	if (!appointment) throw new ApiError(404, "Appointment not found");

	if (
		actor.role !== "vet" &&
		!appointment.owner.equals(actor._id)
	) {
		throw new ApiError(403, "Not your appointment");
	}

	if (actor.role === "user" && status !== "cancelled") {
		throw new ApiError(400, "Owners can only cancel appointments");
	}

	const allowed = STATUS_FLOW[appointment.status];
	if (!allowed.includes(status)) {
		throw new ApiError(
			400,
			`Cannot change status from ${appointment.status} to ${status}`
		);
	}

	appointment.status = status;
	if (vetNotes !== undefined) appointment.vetNotes = vetNotes;

	await appointment.save();
	return appointment;
}

export async function cancelAppointment(actor, appointmentId) {
	if (!mongoose.isValidObjectId(appointmentId)) {
		throw new ApiError(404, "Appointment not found");
	}

	const appointment = await Appointment.findById(appointmentId);
	if (!appointment) throw new ApiError(404, "Appointment not found");

	if (
		actor.role !== "vet" &&
		!appointment.owner.equals(actor._id)
	) {
		throw new ApiError(403, "Not your appointment");
	}

	if (appointment.status === "completed" || appointment.status === "cancelled") {
		throw new ApiError(400, `Cannot cancel a ${appointment.status} appointment`);
	}

	appointment.status = "cancelled";
	await appointment.save();

	return { message: "Appointment cancelled", appointment };
}
