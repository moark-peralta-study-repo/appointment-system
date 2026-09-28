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
