// Nodemailer setup — one config so register / OTP / password-reset all
// send through the same transport.
//
// Local dev: point SMTP_HOST/SMTP_PORT at MailDev (`npx maildev`) and
// emails land in its web inbox instead of the real world:
//   SMTP_HOST=localhost
//   SMTP_PORT=1025
//
// In production swap in any SMTP provider (Mailgun, SES, …) via env vars —
// no code changes. When SMTP_USER is absent we log the email to the
// server console instead, so the demo flow never hard-fails just because
// a mail server is missing.
import nodemailer from "nodemailer";

const FROM = process.env.MAIL_FROM || "Mutuals Paws Clinic <no-reply@mutualspaws.com>";

let transporter;
if (process.env.SMTP_HOST) {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT || 1025),
		secure: process.env.SMTP_SECURE === "true",
		...(process.env.SMTP_USER
			? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
			: {}),
	});
}

export const mailerReady = Boolean(process.env.SMTP_HOST);

/**
 * Send a plain-text/HTML email. Resolves true when delivered, false when
 * there is no SMTP transport configured (email was logged to console).
 */
export async function sendMail({ to, subject, html, text }) {
	if (!transporter) {
		console.log(`[mail:console] to=${to} subject="${subject}"`);
		console.log(text || html);
		return false;
	}
	await transporter.sendMail({ from: FROM, to, subject, html, text });
	return true;
}
