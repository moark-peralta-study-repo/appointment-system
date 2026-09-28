import * as vetService from "../services/vetService.js";

export async function listVets(req, res, next) {
	try {
		const vets = await vetService.listVets();
		res.json(vets);
	} catch (err) {
		next(err);
	}
}
