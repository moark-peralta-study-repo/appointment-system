import { body, param, validationResult } from "express-validator";

export const bookAppointmentValidation = [
	body("vetId")
		.isMongoId()
		.withMessage("vetId must be a valid id"),
	body("petId")
		.isMongoId()
		.withMessage("petId must be a valid id"),
	body("date")
		.matches(/^\d{4}-\d{2}-\d{2}$/)
		.withMessage("date must be YYYY-MM-DD"),
	body("time")
		.isString()
		.matches(/^([01]\d|2[0-3]):[0-5]\d$/)
		.withMessage("time must be HH:MM (24h)"),
	body("reason")
		.isString()
		.trim()
		.isLength({ min: 3 })
		.withMessage("reason is required (min 3 chars)"),
];

export const updateStatusValidation = [
	body("status")
		.isString()
		.isIn(["pending", "confirmed", "completed", "cancelled"])
		.withMessage("status must be pending, confirmed, completed or cancelled"),
	// Optional structured medical record (clinical roles). Findings are
	// mandatory whenever a record is provided; the rest are free-text.
	// Service layer re-checks + trims (empty string → 400).
	body("record").optional().isObject().withMessage("record must be an object"),
	body("record.findings")
		.if((v, { req }) => req.body.record !== undefined)
		.isString()
		.trim()
		.isLength({ min: 1 })
		.withMessage("record.findings is required"),
	body("record.diagnosis").optional().isString().trim(),
	body("record.treatment").optional().isString().trim(),
	body("record.medications").optional().isString().trim(),
	body("record.followUp").optional().isString().trim(),
];

export const createVetValidation = [
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

export const createStaffValidation = [
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

export const idParamValidation = [
	param("id").isMongoId().withMessage("id must be a valid id"),
];

// Run after the validators above; collects their results and sends 400 if any failed.
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
