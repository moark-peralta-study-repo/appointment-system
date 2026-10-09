import { Router } from "express";
import {
	getUserProfile, updateMyProfile,
	loginUser,
	registerUser,
} from "../controllers/userController.js";
import { protectAuth } from "../middleware/authMiddleware.js";
import {
	registerValidation,
	loginValidation,
	handleValidation,
} from "../middleware/validation/userValidation.js";

const router = Router();

router.post("/register", registerValidation, handleValidation, registerUser);
router.post("/login", loginValidation, handleValidation, loginUser);
router.get("/profile", protectAuth, getUserProfile);
router.patch("/profile", protectAuth, updateMyProfile);

export default router;
