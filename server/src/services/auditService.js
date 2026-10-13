// Audit trail (guidelines: log login attempts, data modifications, errors;
// keep an audit trail for sensitive changes).
//
// logAction is fire-and-forget: a failed insert must never break the main
// request, so it swallows its own errors (logged to stdout).
import AuditLog from "../models/AuditLog.js";

export function logAction({
	actor = null,
	action,
	entity = null,
	entityId = null,
	details = {},
	ip = null,
}) {
	AuditLog.create({ actor, action, entity, entityId, details, ip }).catch(
		(err) => console.error(`[audit] insert failed (${action}): ${err.message}`),
	);
}

/** Best-effort client IP (behind a proxy → first X-Forwarded-For hop). */
export function clientIp(req) {
	const fwd = req.headers["x-forwarded-for"];
	if (fwd) return String(fwd).split(",")[0].trim();
	return req.socket?.remoteAddress ?? null;
}

function escapeRegex(s) {
	return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Paginated, filterable listing for the admin Activity page.
 * search matches the action, entity, and common detail fields
 * (emails, names, from/to values) — case-insensitive substring.
 */
export async function listAuditLogs({ search, action, entity, page = 1, limit = 20 } = {}) {
	const q = {};
	if (action) q.action = action;
	if (entity) q.entity = entity;
	if (search && search.trim()) {
		const rx = new RegExp(escapeRegex(search.trim()), "i");
		q.$or = [
			{ action: rx },
			{ entity: rx },
			{ "details.email": rx },
			{ "details.name": rx },
			{ "details.from": rx },
			{ "details.to": rx },
		];
	}

	const lim = Math.min(Math.max(Number(limit) || 20, 1), 100);
	const pg = Math.max(Number(page) || 1, 1);

	const [rows, total] = await Promise.all([
		AuditLog.find(q)
			.sort({ createdAt: -1 })
			.skip((pg - 1) * lim)
			.limit(lim)
			.populate("actor", "name email role"),
		AuditLog.countDocuments(q),
	]);

	return { logs: rows, total, page: pg, limit: lim, pages: Math.max(Math.ceil(total / lim), 1) };
}

/** Distinct actions currently in the log — powers the filter dropdown. */
export async function distinctActions() {
	return AuditLog.distinct("action");
}
