import { body, validationResult } from "express-validator";

// Philippine mobile: 09xx xxx xxxx / +63 9xx xxx xxxx / bare 9xxxxxxxxx.
// Blank (or absent) is allowed — it means "no phone" / "clear it".
const phPhone = body("phone")
	.optional({ values: "undefined" })
	.custom((v) => {
		const trimmed = String(v).trim();
		if (trimmed === "") return true; // blank → nothing to validate
		const digits = trimmed.replace(/[\s\-().]/g, "");
		return /^(?:\+?63|0)?9\d{9}$/.test(digits);
	})
	.withMessage("phone must be a valid PH mobile number (e.g. 0917 123 4567)");

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
	body("password")
		.isString()
		.isLength({ min: 6 })
		.withMessage("password must be at least 6 chars"),
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
	body("password")
		.isString()
		.isLength({ min: 6 })
		.withMessage("password must be at least 6 chars"),
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
