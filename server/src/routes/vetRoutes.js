import { Router } from "express";
import {
	listVets,
	getVetDetails,
	createVet,
	updateVet,
	deactivateVet,
	listUsers,
	getStats,
} from "../controllers/vetController.js";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";
import {
	createVetValidation,
	idParamValidation,
	handleValidation,
} from "../middleware/validation/appointmentValidation.js";

const router = Router();

// Public
router.get("/", listVets);

// Staff — MUST be declared before "/:id", otherwise "users"/"stats"
// would be parsed as a vet id and hit getVetDetails
router.get("/users", protectAuth, authorize("vet", "staff", "admin"), listUsers);
router.get("/stats", protectAuth, authorize("vet", "staff", "admin"), getStats);

router.get("/:id", getVetDetails);

// Vet-directory management is the owner (admin)'s job.
router.post(
	"/",
	protectAuth,
	authorize("admin"),
	createVetValidation,
	handleValidation,
	createVet
);
router.put(
	"/:id",
	protectAuth,
	authorize("admin"),
	idParamValidation,
	handleValidation,
	updateVet
);
router.delete(
	"/:id",
	protectAuth,
	authorize("admin"),
	idParamValidation,
	handleValidation,
	deactivateVet
);

export default router;
