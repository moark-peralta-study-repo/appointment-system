import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import Vet from "../models/Vet.js";
import ApiError from "../utils/ApiError.js";
import { getFreeSlots } from "../utils/slots.js";
import { isOperational, isClinical, canActOnAppointment } from "../utils/roles.js";

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
	// Pet owners → their own appointments. Every portal role (vet,
	// front-desk staff, admin) → the whole clinic book. Preserves the
	// original behaviour exactly; role only ever added new portal roles.
	const filter = user.role === "user" ? { owner: user._id } : {};

	const appointments = await Appointment.find(filter)
		.populate("pet")
		.populate({ path: "vet", select: "name" })
		.sort({ date: 1, time: 1 });

	return appointments.map((a) => ({
		...a.toObject(),
		vet: a.vet?.name ?? null,
	}));
}

export async function bookAppointment(user, { vetId, petId, date: dateParam, time, reason, ownerNotes }) {
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

	// Staff (vet, front-desk, admin) book on behalf of a patient — the
	// owner stays the pet's owner. An owner can only book their own pets.
	const isOper = isOperational(user.role);
	if (!isOper && !pet.owner.equals(user._id)) throw new ApiError(403, "Not your pet");
	const ownerId = isOper ? pet.owner._id : user._id;

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
		ownerNotes: ownerNotes?.trim() || undefined,
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

export async function updateStatus(actor, appointmentId, { status, vetNotes, record }) {
	if (!mongoose.isValidObjectId(appointmentId)) {
		throw new ApiError(404, "Appointment not found");
	}

	const appointment = await Appointment.findById(appointmentId);
	if (!appointment) throw new ApiError(404, "Appointment not found");

	const previousStatus = appointment.status;

	if (!canActOnAppointment(actor, appointment)) {
		throw new ApiError(403, "Not your appointment");
	}

	if (actor.role === "user" && status !== "cancelled") {
		throw new ApiError(400, "Owners can only cancel appointments");
	}

	const allowed = STATUS_FLOW[appointment.status];
	if (!allowed.includes(status)) {
		throw new ApiError(
			400,
			`Cannot change status from ${appointment.status} to ${status}`,
		);
	}

	// Structured medical record — clinical roles only, written with (or after)
	// completing the visit. `findings` is the one required field; the rest are
	// optional. Plain-text vetNotes remain the short summary used in email and
	// list previews.
	const canWriteRecord =
		isClinical(actor.role) && record !== undefined;
	if (canWriteRecord) {
		const findings = (record.findings ?? "").trim();
		if (!findings) {
			throw new ApiError(400, "Medical record findings are required");
		}
		appointment.medicalRecord = {
			findings,
			diagnosis: (record.diagnosis ?? "").trim() || undefined,
			treatment: (record.treatment ?? "").trim() || undefined,
			medications: (record.medications ?? "").trim() || undefined,
			followUp: (record.followUp ?? "").trim() || undefined,
		};
	}

	appointment.status = status;
	// vetNotes are clinical — only vets / admin write them, not front desk.
	if (vetNotes !== undefined && isClinical(actor.role)) {
		appointment.vetNotes = vetNotes;
	}

	await appointment.save();
	return { appointment, previousStatus };
}

export async function cancelAppointment(actor, appointmentId) {
	if (!mongoose.isValidObjectId(appointmentId)) {
		throw new ApiError(404, "Appointment not found");
	}

	const appointment = await Appointment.findById(appointmentId);
	if (!appointment) throw new ApiError(404, "Appointment not found");

	const previousStatus = appointment.status;

	if (!canActOnAppointment(actor, appointment)) {
		throw new ApiError(403, "Not your appointment");
	}

	if (appointment.status === "completed" || appointment.status === "cancelled") {
		throw new ApiError(400, `Cannot cancel a ${appointment.status} appointment`);
	}

	appointment.status = "cancelled";
	await appointment.save();

	return { message: "Appointment cancelled", appointment, previousStatus };
}
