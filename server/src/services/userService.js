import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export async function register({ name, email, password }) {
	const userExists = await User.findOne({ email });
	if (userExists) throw new ApiError(409, "User already exists");

	const user = await User.create({ name, email, password, role: "user" });
	const safeUser = await User.findById(user._id);

	return { token: generateToken(user._id), user: safeUser };
}

export async function login({ email, password }) {
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.matchPassword(password))) {
		throw new ApiError(401, "Invalid email or password");
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
