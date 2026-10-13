// Email verification + password reset.
//
// Flow:
//   register → sendOtp (6-digit, expires in 15 min)
//   verify   → POST the code → isVerified = true → JWT issued
//   login    → rejected (403) until isVerified
//   forgot   → email a reset token (1 h) → new password
//
// Codes are stored as SHA-256 hashes (utils/token.js), never plaintext.
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { sendMail } from "../config/mailer.js";
import { emailLayout } from "../utils/emailTemplates.js";
import { generateOtp, hashToken, tokenMatches } from "../utils/token.js";

export const OTP_TTL_MS = 15 * 60 * 1000; // guidelines: 15-minute OTP
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // one email per minute

const resetSign = (payload) =>
	jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

const resetUrl = (token) => `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;

/**
 * Issue (or re-issue) the email OTP for the account at `email` and deliver
 * it. Takes an email string so the resend endpoint (where the client only
 * knows the email) and register (which has the fresh doc) share one path.
 */
export async function sendOtp(email) {
	// otpHash is select:false — pull it explicitly.
	const user = await User.findOne({ email }).select("+otpHash");
	if (!user) throw new ApiError(404, "No account with this email — check the address or sign in.");
	if (user.isVerified) throw new ApiError(400, "Email is already verified");

	// Resend cooldown — check the last send time, not the expiry, so users
	// can't hammer "resend" every second.
	if (
		user.otpSentAt &&
		Date.now() - user.otpSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
	) {
		const wait = Math.ceil(
			(OTP_RESEND_COOLDOWN_MS - (Date.now() - user.otpSentAt.getTime())) / 1000,
		);
		throw new ApiError(429, `Please wait ${wait}s before requesting another code`);
	}

	const otp = generateOtp();
	user.otpHash = hashToken(otp);
	user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
	user.otpSentAt = new Date();
	await user.save();

	const delivered = await sendMail({
		to: user.email,
		subject: `Your Mutuals Paws verification code: ${otp}`,
		html: emailLayout({
			title: "Verify your email",
			code: otp,
			lines: [
				`Hi ${user.name.split(" ")[0]}, we're almost done setting up your account.`,
				`Enter this code on the confirmation page. It expires in 15 minutes.`,
			],
			footer:
				"If you didn't create this account, you can ignore this email — the code will simply expire.",
		}),
	});
	return { delivered };
}

/** Check a submitted OTP and mark the account verified. */
export async function verifyOtp(email, otp) {
	// otpHash is select:false — pull it explicitly.
	const user = await User.findOne({ email }).select("+otpHash");
	if (!user) throw new ApiError(404, "No account with this email");
	if (user.isVerified) return { isVerified: true };

	if (!user.otpHash || !user.otpExpiresAt) {
		throw new ApiError(400, "No verification code was requested");
	}
	if (user.otpExpiresAt.getTime() < Date.now()) {
		throw new ApiError(410, "That code has expired — request a new one");
	}
	if (!tokenMatches(user.otpHash, otp)) {
		throw new ApiError(400, "Incorrect code — check the 6 digits and try again");
	}

	user.isVerified = true;
	user.otpHash = undefined;
	user.otpExpiresAt = undefined;
	await user.save();
	return { isVerified: true };
}

/** Request a password reset: email a signed token (valid 1h). */
export async function requestPasswordReset(email) {
	const user = await User.findOne({ email });
	if (!user) {
		// Don't reveal whether the email exists — always "sent".
		return { sent: true };
	}

	const payload = { id: user._id, purpose: "password-reset" };
	const token = resetSign(payload);
	const delivered = await sendMail({
		to: user.email,
		subject: "Reset your Mutuals Paws password",
		html: emailLayout({
			title: "Password reset",
			button: { href: resetUrl(token), label: "Reset your password" },
			lines: [
				`Hi ${user.name.split(" ")[0]}, we received a request to reset your password.`,
				`The link expires in 1 hour. If it doesn't work, copy the full URL from your email client into your browser.`,
				`If you didn't request this, ignore this email — your password stays as is.`,
			],
			footer: "We never send your password. To keep your account safe, share this link with no one.",
		}),
	});

	// Store the full token's hash so resetPassword can validate it.
	user.resetTokenHash = hashToken(token);
	await user.save();
	return { sent: true, delivered };
}

/** Apply a new password for a valid, unexpired reset token. */
export async function resetPassword(token, newPassword) {
	const user = await User.findOne({ resetTokenHash: hashToken(token) }).select(
		"+password",
	);
	if (!user) throw new ApiError(400, "That reset code is invalid or has already been used");

	// The token is a signed JWT (1h) with purpose "password-reset"; verify
	// both the signature/expiry and the purpose before touching the password.
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new ApiError(410, "That reset code has expired — request a new one");
	}
	if (decoded.purpose !== "password-reset") {
		throw new ApiError(400, "That reset code is invalid or has already been used");
	}

	user.password = newPassword; // pre-save hook hashes it
	user.resetTokenHash = undefined;
	await user.save();
	return { reset: true };
}
