import { login, register, updateProfile, changePassword } from "../services/userService.js";

export async function registerUser(req, res, next) {
	try {
		const { token, user } = await register(req.body);
		res.status(201).json({ token, user });
	} catch (err) {
		next(err);
	}
}

export async function loginUser(req, res, next) {
	try {
		const { token, user } = await login(req.body);
		res.json({ token, user });
	} catch (err) {
		next(err);
	}
}

export async function getUserProfile(req, res) {
	res.json({ user: req.user });
}

export async function updateMyProfile(req, res, next) {
	try {
		const { name, phone, email } = req.body;
		const user = await updateProfile(req.user, { name, phone, email });
		res.json({ user });
	} catch (err) {
		next(err);
	}
}

export async function changePasswordHandler(req, res, next) {
	try {
		const { currentPassword, password } = req.body;
		const result = await changePassword(req.user, { currentPassword, password });
		res.json(result);
	} catch (err) {
		next(err);
	}
}
