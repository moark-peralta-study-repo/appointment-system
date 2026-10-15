import * as staffService from "../services/staffService.js";
import { logAction, clientIp } from "../services/auditService.js";

export async function listStaff(req, res, next) {
	try {
		const staff = await staffService.listStaff();
		res.json(staff);
	} catch (err) {
		next(err);
	}
}

export async function createStaff(req, res, next) {
	try {
		const member = await staffService.createStaff(req.body);
		logAction({
			actor: req.user,
			action: "staff_created",
			entity: "staff",
			entityId: String(member._id),
			details: { name: member.name, email: member.email },
			ip: clientIp(req),
		});
		res.status(201).json(member);
	} catch (err) {
		next(err);
	}
}

export async function updateStaff(req, res, next) {
	try {
		const { name, phone, password } = req.body;
		const member = await staffService.updateStaff(req.user, req.params.id, {
			name,
			phone,
			password,
		});
		logAction({
			actor: req.user,
			action: "staff_updated",
			entity: "staff",
			entityId: String(req.params.id),
			details: {
				name: member.name,
				fields: [name !== undefined && "name", phone !== undefined && "phone", password !== undefined && password !== "" && "password"].filter(Boolean),
			},
			ip: clientIp(req),
		});
		res.json(member);
	} catch (err) {
		next(err);
	}
}

export async function removeStaff(req, res, next) {
	try {
		const result = await staffService.removeStaff(req.params.id);
		logAction({
			actor: req.user,
			action: "staff_removed",
			entity: "staff",
			entityId: String(req.params.id),
			details: { name: result.user?.name, email: result.user?.email },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}
