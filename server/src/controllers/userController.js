import { login, register, updateProfile, changePassword } from "../services/userService.js";
import {
	sendOtp,
	verifyOtp,
	requestPasswordReset,
	resetPassword,
} from "../services/verificationService.js";

export async function registerUser(req, res, next) {
	try {
		// If a Bearer token is present, the call came from the admin
		// dashboard (add-owner / add-vet forms). Those accounts are
		// pre-verified — no inbox round-trip needed.
		const isFromAdmin = Boolean(req.headers.authorization);
		const result = await register(req.body, { verified: isFromAdmin });
		// Self-signup: no token yet (OTP gate). Admin-created: returns token.
		res.status(201).json(result);
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

/** POST /auth/verify-otp — confirm a just-registered account. */
export async function verifyOtpHandler(req, res, next) {
	try {
		const { email, otp } = req.body;
		const result = await verifyOtp(email, otp);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/** POST /auth/resend-otp — re-send a verification code. */
export async function resendOtpHandler(req, res, next) {
	try {
		const { email } = req.body;
		const result = await sendOtp(email);
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/** POST /auth/forgot-password — email a reset link. */
export async function forgotPasswordHandler(req, res, next) {
	try {
		await requestPasswordReset(req.body.email);
		// Always 200 — don't leak whether the email exists.
		res.json({ sent: true });
	} catch (err) {
		next(err);
	}
}

/** POST /auth/reset-password — apply a new password for a valid token. */
export async function resetPasswordHandler(req, res, next) {
	try {
		const { token, password } = req.body;
		const result = await resetPassword(token, password);
		res.json(result);
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
