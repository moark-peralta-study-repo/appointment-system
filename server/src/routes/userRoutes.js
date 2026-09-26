import { Router } from "express";
import {
	getUserProfile,
	loginUser,
	registerUser,
} from "../controllers/userController.js";
import { protectAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protectAuth, getUserProfile);

export default router;
