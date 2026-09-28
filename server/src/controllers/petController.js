import * as petService from "../services/petService.js";

export async function getPets(req, res, next) {
	try {
		const pets = await petService.listPets(req.user);
		res.json(pets);
	} catch (err) {
		next(err);
	}
}

export async function createPet(req, res, next) {
	try {
		const pet = await petService.createPet(req.user, req.body);
		res.status(201).json(pet);
	} catch (err) {
		next(err);
	}
}

export async function updatePet(req, res, next) {
	try {
		const pet = await petService.updatePet(
			req.user,
			req.params.petId,
			req.body,
		);
		res.json(pet);
	} catch (err) {
		next(err);
	}
}

export async function deletePet(req, res, next) {
	try {
		const result = await petService.deletePet(req.user, req.params.petId);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
