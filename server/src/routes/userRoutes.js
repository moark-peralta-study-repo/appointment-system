import { Router } from "express";
import {
	getUserProfile,
	updateMyProfile,
	loginUser,
	registerUser,
	changePasswordHandler,
	verifyOtpHandler,
	resendOtpHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
} from "../controllers/userController.js";
import { protectAuth } from "../middleware/authMiddleware.js";
import {
	registerValidation,
	loginValidation,
	verifyOtpValidation,
	emailOnlyValidation,
	resetPasswordValidation,
	profileValidation,
	changePasswordValidation,
	handleValidation,
} from "../middleware/validation/userValidation.js";

const router = Router();

router.post("/register", registerValidation, handleValidation, registerUser);
router.post("/login", loginValidation, handleValidation, loginUser);
// Email verification — no auth (the account isn't verified yet).
router.post(
	"/verify-otp",
	verifyOtpValidation,
	handleValidation,
	verifyOtpHandler,
);
router.post("/resend-otp", emailOnlyValidation, handleValidation, resendOtpHandler);
// Password reset — no auth (that's the point).
router.post(
	"/forgot-password",
	emailOnlyValidation,
	handleValidation,
	forgotPasswordHandler,
);
router.post(
	"/reset-password",
	resetPasswordValidation,
	handleValidation,
	resetPasswordHandler,
);
router.get("/profile", protectAuth, getUserProfile);
router.patch("/profile", protectAuth, profileValidation, handleValidation, updateMyProfile);
router.post("/password", protectAuth, changePasswordValidation, handleValidation, changePasswordHandler);

export default router;
