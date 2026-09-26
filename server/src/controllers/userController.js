import { login, register } from "../services/userService";

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

export async function getuserProfile(req, res) {
	res.json({ user: req.user });
}
