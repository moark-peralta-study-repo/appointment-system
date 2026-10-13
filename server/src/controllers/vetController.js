import * as vetService from "../services/vetService.js";
import User from "../models/User.js";
import { logAction, clientIp } from "../services/auditService.js";

export async function listVets(req, res, next) {
	try {
		const vets = await vetService.listVets();
		res.json(vets);
	} catch (err) {
		next(err);
	}
}

export async function getVetDetails(req, res, next) {
	try {
		const detail = await vetService.getVetDetails(
			req.params.id,
			req.query.date,
		);
		res.json(detail);
	} catch (err) {
		next(err);
	}
}

export async function createVet(req, res, next) {
	try {
		const vet = await vetService.createVet(req.user, req.body);
		logAction({
			actor: req.user,
			action: "vet_created",
			entity: "vet",
			entityId: String(vet._id),
			details: { name: vet.user?.name, email: vet.user?.email, specialty: vet.specialty },
			ip: clientIp(req),
		});
		res.status(201).json(vet);
	} catch (err) {
		next(err);
	}
}

export async function updateVet(req, res, next) {
	try {
		const vet = await vetService.updateVet(req.user, req.params.id, req.body);
		logAction({
			actor: req.user,
			action: "vet_updated",
			entity: "vet",
			entityId: String(vet._id),
			details: {
				name: vet.user?.name,
				fields: Object.keys(req.body).filter((k) =>
					["specialty", "bio", "schedule", "active"].includes(k),
				),
			},
			ip: clientIp(req),
		});
		res.json(vet);
	} catch (err) {
		next(err);
	}
}

export async function deactivateVet(req, res, next) {
	try {
		const result = await vetService.deactivateVet(req.user, req.params.id);
		// The vet's name lives on the linked User, not the profile — fetch
		// it so the audit row is human-readable (soft delete: the record
		// stays, this is who deactivated it and when).
		const vetUser = await User.findById(result.vet?.user);
		logAction({
			actor: req.user,
			action: "vet_deactivated",
			entity: "vet",
			entityId: String(req.params.id),
			details: { name: vetUser?.name, email: vetUser?.email },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}

export async function listUsers(req, res, next) {
	try {
		const users = await vetService.listUsers();
		res.json(users);
	} catch (err) {
		next(err);
	}
}

export async function getStats(req, res, next) {
	try {
		const stats = await vetService.getStats();
		res.json(stats);
	} catch (err) {
		next(err);
	}
}
