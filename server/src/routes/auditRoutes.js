import { Router } from "express";
import { getAuditLogs, getAuditActions } from "../controllers/auditController.js";
import { protectAuth, authorize } from "../middleware/authMiddleware.js";

// Read-only activity trail. Staff (vet) accounts may view it; only the
// admin will get the "Activity" sidebar entry (UI concern).
const router = Router();

router.get("/actions", protectAuth, authorize("vet"), getAuditActions);
router.get("/", protectAuth, authorize("vet"), getAuditLogs);

export default router;
