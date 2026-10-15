import { Router } from "express";
import { getAuditLogs, getAuditActions } from "../controllers/auditController.js";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";

// Read-only activity trail. All portal roles may view it; only the
// admin gets the "Activity" sidebar entry (UI concern).
const router = Router();

router.get("/actions", protectAuth, authorize("vet", "staff", "admin"), getAuditActions);
router.get("/", protectAuth, authorize("vet", "staff", "admin"), getAuditLogs);

export default router;
