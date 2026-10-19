import { body, validationResult } from "express-validator";

// Philippine mobile — 11 digits, no more, no less:
//   0917 123 4567          (local)
//   +63 917 123 4567       (international; the 0 becomes nothing)
//   639171234567           (international, no plus)
// Blank (or absent) is allowed — it means "no phone" / "clear it".
const phPhone = body("phone")
	.optional({ values: "undefined" })
	.custom((v) => {
		const trimmed = String(v).trim();
		if (trimmed === "") return true; // blank → nothing to validate
		let s = trimmed;
		if (s[0] === "+") s = s.slice(1); // only symbol allowed, only up front
		const digits = s.replace(/[\s\-().]/g, "");
		return /^(09|639)\d{9}$/.test(digits);
	})
	.withMessage("phone must be an 11-digit PH mobile number (e.g. 0917 123 4567)");

// Modern password handling (NIST 800-63B style): length is the main
// factor; block short, over-long, and the most common/leaked passwords.
// `context` — optional email/name strings; the password must not contain
// them (checked via chained body fields, e.g. body("email")).
const MIN_PASSWORD = 8;
const COMMON_PASSWORDS = [
	"password", "passw0rd", "p@ssword", "qwerty", "abc123", "123456",
	"12345678", "iloveyou", "admin", "welcome", "monkey", "dragon",
	"letmein", "sunshine", "princess", "football", "baseball",
	"pinky paws", "pinkpaws",
];

const passwordRule = body("password")
	.isString()
	.custom((v) => {
		if (v.length < MIN_PASSWORD) return false;
		if (v.length > 72) return false;
		const lower = v.toLowerCase();
		if (COMMON_PASSWORDS.some((c) => lower.includes(c))) return false;
		if (!/[^a-zA-Z0-9]/.test(v)) return false; // require a symbol
		return true;
	})
	.withMessage(
		"password must be 8-72 characters, include a symbol, and not be a common password",
	);

// When email/name are in the payload, the password must not contain them.
const passwordNotPersonal = [
	body("password").custom((v, { req }) => {
		const personal = [req.body?.email, req.body?.name]
			.filter(Boolean)
			.map((s) => String(s).trim().toLowerCase())
			.flatMap((s) => [s, s.split(" ")[0]])
			.filter((s) => s.length >= 3);
		if (personal.some((p) => v.toLowerCase().includes(p))) return false;
		return true;
	}).withMessage("password must not contain your name or email"),
];

export const registerValidation = [
	body("name")
		.isString()
		.trim()
		.isLength({ min: 1 })
		.withMessage("name is required"),
	body("email")
		.isString()
		.trim()
		.isEmail()
		.withMessage("email must be valid"),
	passwordRule,
	passwordNotPersonal,
	phPhone,
];

export const profileValidation = [
	body("name")
		.optional({ values: "undefined" })
		.isString()
		.trim()
		.isLength({ min: 1 })
		.withMessage("name must not be empty"),
	body("email")
		.optional({ values: "undefined" })
		.isEmail()
		.withMessage("email must be valid"),
	phPhone,
];

export const loginValidation = [
	body("email")
		.isString()
		.trim()
		.isEmail()
		.withMessage("email must be valid"),
	body("password").isString().withMessage("password is required"),
];

export const verifyOtpValidation = [
	body("email")
		.isString()
		.trim()
		.isEmail()
		.withMessage("email must be valid"),
	body("otp")
		.isString()
		.trim()
		.isLength({ min: 6, max: 6 })
		.isNumeric()
		.withMessage("enter the 6-digit code from your email"),
];

export const emailOnlyValidation = [
	body("email")
		.isString()
		.trim()
		.isEmail()
		.withMessage("email must be valid"),
];

export const resetPasswordValidation = [
	body("token").isString().notEmpty().withMessage("reset token is required"),
	passwordRule,
];

export const changePasswordValidation = [
	body("currentPassword").isString().notEmpty().withMessage("current password is required"),
	passwordRule,
];

// Run after the validators above; sends 400 if any failed.
export function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res
			.status(400)
			.json({ message: errors.array()[0].msg, errors: errors.array().map((e) => e.msg) });
		return;
	}
	next();
}
