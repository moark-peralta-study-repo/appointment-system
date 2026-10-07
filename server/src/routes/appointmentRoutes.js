import { Router } from "express";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";
import {
	listAppointments,
	bookAppointment,
	updateStatus,
	cancelAppointment,
} from "../controllers/appointmentController.js";
import {
	bookAppointmentValidation,
	updateStatusValidation,
	idParamValidation,
	handleValidation,
} from "../middleware/validation/appointmentValidation.js";

const router = Router();

router.get("/", protectAuth, listAppointments);
router.post(
	"/",
	protectAuth,
	authorize("user", "vet"),
	bookAppointmentValidation,
	handleValidation,
	bookAppointment
);
router.patch(
	"/:id/status",
	protectAuth,
	[...idParamValidation, ...updateStatusValidation],
	handleValidation,
	updateStatus
);
router.delete(
	"/:id",
	protectAuth,
	idParamValidation,
	handleValidation,
	cancelAppointment
);

export default router;
