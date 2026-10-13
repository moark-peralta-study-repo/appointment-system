import { body, validationResult } from "express-validator";

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
