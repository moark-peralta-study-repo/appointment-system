import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { sendOtp } from "./verificationService.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export async function register({ name, email, password, phone }, { verified = false } = {}) {
	const userExists = await User.findOne({ email });
	if (userExists) throw new ApiError(409, "User already exists");

	const user = await User.create({ name, email, phone, password, role: "user", isVerified: verified });

	// Self-service signup → email OTP activates the account. Accounts
	// created BY the clinic (admin) skip verification — they were created
	// deliberately, no inbox round-trip needed.
	if (verified) {
		const safeUser = await User.findById(user._id);
		return { token: generateToken(user._id), user: safeUser };
	}

	// No JWT yet — the account is activated by the email OTP. sendOtp
	// swallows mail failures so a missing SMTP server can't block signup;
	// the user can request a new code on the verify screen.
	await sendOtp(user.email).catch(() => {});

	return { email: user.email, message: "Account created — check your email for a 6-digit verification code." };
}

export async function login({ email, password }) {
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.matchPassword(password))) {
		throw new ApiError(401, "Invalid email or password");
	}

	// Guidelines: no CRUD/logins until the email is verified.
	// (Checked AFTER the password so the usual "invalid credentials"
	// still hides whether the account exists.)
	if (!user.isVerified) {
		throw new ApiError(403, "Please verify your email first — check your inbox for the 6-digit code.");
	}

	const safeUser = await User.findById(user._id);

	return { token: generateToken(user._id), user: safeUser };
}

export async function updateProfile(user, { name, phone, email }) {
	const updates = {};
	if (name !== undefined) updates.name = name.trim();
	if (phone !== undefined) updates.phone = phone.trim() || undefined;

	if (email !== undefined && email.trim().toLowerCase() !== user.email.toLowerCase()) {
		const taken = await User.findOne({ email: email.trim().toLowerCase() });
		if (taken) throw new ApiError(409, "That email is already in use");
		updates.email = email.trim().toLowerCase();
	}

	Object.assign(user, updates);
	await user.save();
	return user;
}

export async function changePassword(user, { currentPassword, password }) {
	if (typeof currentPassword !== "string" || currentPassword.length === 0) {
		throw new ApiError(400, "currentPassword is required");
	}
	if (typeof password !== "string" || password.length < 6) {
		throw new ApiError(400, "password must be at least 6 chars");
	}

	// protectAuth loads req.user without +password (select: false), so
	// re-fetch the hashed field to verify the current one.
	const account = await User.findById(user._id).select("+password");
	if (!account || !(await account.matchPassword(currentPassword))) {
		throw new ApiError(400, "Current password is incorrect");
	}

	account.password = password;
	await account.save();
	return { message: "Password updated" };
}
