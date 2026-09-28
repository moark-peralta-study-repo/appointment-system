import { Router } from "express";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";
import {
	getPets,
	createPet,
	updatePet,
	deletePet,
} from "../controllers/petController.js";

const router = Router();

router.get("/", protectAuth, getPets);
router.post("/", protectAuth, authorize("user"), createPet);
router.put("/:id", protectAuth, updatePet);
router.delete("/:id", protectAuth, deletePet);

export default router;
