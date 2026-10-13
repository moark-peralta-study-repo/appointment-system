import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { login, register, updateProfile, changePassword } from "../services/userService.js";
import {
	sendOtp,
	verifyOtp,
	requestPasswordReset,
	resetPassword,
} from "../services/verificationService.js";
import { logAction, clientIp } from "../services/auditService.js";

export async function registerUser(req, res, next) {
	try {
		// If a Bearer token is present, the call came from the admin
		// dashboard (add-owner / add-vet forms). Those accounts are
		// pre-verified — no inbox round-trip needed.
		const isFromAdmin = Boolean(req.headers.authorization);
		// No protectAuth here (self-signup must be public), so decode the
		// admin's token manually to record WHO created the account.
		let adminActor = null;
		if (isFromAdmin) {
			try {
				const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
				adminActor = await User.findById(decoded.id);
			} catch {
				adminActor = null;
			}
		}
		const result = await register(req.body, { verified: isFromAdmin });
		// Self-signup: no token yet (OTP gate). Admin-created: returns token.
		logAction({
			actor: adminActor,
			action: isFromAdmin ? "user_created_admin" : "register",
			entity: "user",
			details: { email: req.body.email, name: req.body.name },
			ip: clientIp(req),
		});
		res.status(201).json(result);
	} catch (err) {
		next(err);
	}
}

export async function loginUser(req, res, next) {
	try {
		const { token, user } = await login(req.body);
		logAction({
			actor: user,
			action: "login",
			entity: "user",
			details: { email: user.email },
			ip: clientIp(req),
		});
		res.json({ token, user });
	} catch (err) {
		// Guidelines explicitly call out logging login ATTEMPTS — failures
		// included. No user object (or unverified account) → actor null.
		if (err.status === 401 || err.status === 403) {
			logAction({
				actor: null,
				action: "login_failed",
				entity: "user",
				details: { email: req.body.email, status: err.status, reason: err.message },
				ip: clientIp(req),
			});
		}
		next(err);
	}
}

/** POST /auth/verify-otp — confirm a just-registered account. */
export async function verifyOtpHandler(req, res, next) {
	try {
		const { email, otp } = req.body;
		const result = await verifyOtp(email, otp);
		logAction({
			actor: null, // actor is the user in result.user when a token is issued
			action: "email_verified",
			entity: "user",
			details: { email, ...(result.user ? { name: result.user.name } : {}) },
			ip: clientIp(req),
		});
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
		logAction({
			actor: null,
			action: "otp_resend",
			entity: "user",
			details: { email },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/** POST /auth/forgot-password — email a reset link. */
export async function forgotPasswordHandler(req, res, next) {
	try {
		await requestPasswordReset(req.body.email);
		logAction({
			actor: null,
			action: "password_reset_requested",
			entity: "user",
			details: { email: req.body.email },
			ip: clientIp(req),
		});
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
		logAction({
			actor: null, // token only; actor's id isn't decoded here
			action: "password_reset",
			entity: "user",
			details: { via: "email_token" },
			ip: clientIp(req),
		});
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
		logAction({
			actor: user,
			action: "profile_updated",
			entity: "user",
			details: {
				email: user.email,
				fields: [name !== undefined && "name", phone !== undefined && "phone", email !== undefined && "email"].filter(Boolean),
			},
			ip: clientIp(req),
		});
		res.json({ user });
	} catch (err) {
		next(err);
	}
}

export async function changePasswordHandler(req, res, next) {
	try {
		const { currentPassword, password } = req.body;
		const result = await changePassword(req.user, { currentPassword, password });
		logAction({
			actor: req.user,
			action: "password_changed",
			entity: "user",
			details: { email: req.user.email },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}
