import { listAuditLogs, distinctActions } from "../services/auditService.js";

/** GET /api/audit — paginated, filterable activity trail (staff-only). */
export async function getAuditLogs(req, res, next) {
	try {
		const { search, action, entity } = req.query;
		const page = Number(req.query.page);
		const limit = Number(req.query.limit);
		const result = await listAuditLogs({ search, action, entity, page, limit });
		res.json(result);
	} catch (err) {
		next(err);
	}
}

/** GET /api/audit/actions — distinct actions for the filter dropdown. */
export async function getAuditActions(req, res, next) {
	try {
		const actions = await distinctActions();
		res.json({ actions });
	} catch (err) {
		next(err);
	}
}
