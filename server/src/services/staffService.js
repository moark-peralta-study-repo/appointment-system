// Staff (non-vet clinic staff: reception / front desk) management.
//
// Staff are plain Users with role "staff" — no profile/schedule like the
// Vet model, because reception doesn't book clinical slots. The owner
// (role "admin") creates and removes them. Mirrors vetService's admin
// create pattern (pre-verified so the account works immediately).
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Appointment from "../models/Appointment.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export async function listStaff() {
	return User.find({ role: "staff" }, "name email phone role createdAt");
}

export async function createStaff({ name, email, password, phone }) {
	if (await User.findOne({ email })) {
		throw new ApiError(409, "A user with this email already exists");
	}
	const user = await User.create({
		name,
		email,
		password,
		phone,
		role: "staff",
	});
	const safeUser = await User.findById(user._id);
	return safeUser;
}

export async function updateStaff(actor, staffId, { name, phone, password }) {
	if (!mongoose.isValidObjectId(staffId)) {
		throw new ApiError(404, "Staff member not found");
	}
	const user = await User.findById(staffId);
	if (!user) throw new ApiError(404, "Staff member not found");
	if (user.role !== "staff") throw new ApiError(400, "Not a staff member");

	if (name !== undefined && name.trim()) user.name = name.trim();
	if (phone !== undefined) user.phone = phone.trim() || undefined;
	if (password !== undefined && password !== "") {
		if (password.length < 6) throw new ApiError(400, "Password must be at least 6 chars");
		user.password = password; // pre-save hook hashes it
	}

	await user.save();
	return user;
}

export async function removeStaff(staffId) {
	if (!mongoose.isValidObjectId(staffId)) {
		throw new ApiError(404, "Staff member not found");
	}
	const user = await User.findById(staffId);
	if (!user) throw new ApiError(404, "Staff member not found");
	if (user.role !== "staff") throw new ApiError(400, "Not a staff member");

	// Staff are plain users; if they've been tied into clinic data
	// (booked as an owner, or assigned as the vet on appointments) we
	// don't hard-delete — that would orphan those rows. Deactivate-style
	// removal isn't available for staff, so just block it with a clear
	// message. (Rare for reception staff; matches the app's "don't
	// orphan appointment history" convention.)
	const [pets, appointments] = await Promise.all([
		Pet.countDocuments({ owner: staffId }),
		Appointment.countDocuments({ $or: [{ owner: staffId }, { vet: staffId }] }),
	]);
	if (pets > 0 || appointments > 0) {
		throw new ApiError(
			409,
			`This staff member has ${appointments} appointment(s) and ${pets} pet(s) — reassign or remove those first.`,
		);
	}

	await user.deleteOne();
	return { message: "Staff member removed", user };
}
