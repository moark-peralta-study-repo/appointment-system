import { Router } from "express";
import {
	listStaff,
	createStaff,
	updateStaff,
	removeStaff,
} from "../controllers/staffController.js";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";
import {
	createStaffValidation,
	idParamValidation,
	handleValidation,
} from "../middleware/validation/appointmentValidation.js";

const router = Router();

// Owner (admin) manages the front-desk staff roster.
router.get("/", protectAuth, authorize("admin"), listStaff);
router.post(
	"/",
	protectAuth,
	authorize("admin"),
	createStaffValidation,
	handleValidation,
	createStaff,
);
router.put(
	"/:id",
	protectAuth,
	authorize("admin"),
	idParamValidation,
	handleValidation,
	updateStaff,
);
router.delete(
	"/:id",
	protectAuth,
	authorize("admin"),
	idParamValidation,
	handleValidation,
	removeStaff,
);

export default router;
