import * as vetService from "../services/vetService.js";

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
		res.status(201).json(vet);
	} catch (err) {
		next(err);
	}
}

export async function updateVet(req, res, next) {
	try {
		const vet = await vetService.updateVet(req.user, req.params.id, req.body);
		res.json(vet);
	} catch (err) {
		next(err);
	}
}

export async function deactivateVet(req, res, next) {
	try {
		const result = await vetService.deactivateVet(req.user, req.params.id);
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
