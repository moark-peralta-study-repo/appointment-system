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
router.get("/users", protectAuth, authorize("vet"), listUsers);
router.get("/stats", protectAuth, authorize("vet"), getStats);

router.get("/:id", getVetDetails);

// Vet mutations
router.post(
	"/",
	protectAuth,
	authorize("vet"),
	createVetValidation,
	handleValidation,
	createVet
);
router.put(
	"/:id",
	protectAuth,
	authorize("vet"),
	idParamValidation,
	handleValidation,
	updateVet
);
router.delete(
	"/:id",
	protectAuth,
	authorize("vet"),
	idParamValidation,
	handleValidation,
	deactivateVet
);

export default router;
