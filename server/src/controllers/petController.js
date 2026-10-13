import * as petService from "../services/petService.js";
import { logAction, clientIp } from "../services/auditService.js";

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
		logAction({
			actor: req.user,
			action: "pet_created",
			entity: "pet",
			entityId: String(pet._id),
			details: {
				name: pet.name,
				species: pet.species,
				onBehalfOf: req.user.role === "vet" ? "vet" : "owner",
			},
			ip: clientIp(req),
		});
		res.status(201).json(pet);
	} catch (err) {
		next(err);
	}
}

export async function updatePet(req, res, next) {
	try {
		const pet = await petService.updatePet(
			req.user,
			req.params.id,
			req.body,
		);
		logAction({
			actor: req.user,
			action: "pet_updated",
			entity: "pet",
			entityId: String(pet._id),
			details: {
				name: pet.name,
				fields: Object.keys(req.body).filter((k) =>
					["name", "species", "breed", "age", "gender", "notes"].includes(k),
				),
			},
			ip: clientIp(req),
		});
		res.json(pet);
	} catch (err) {
		next(err);
	}
}

export async function deletePet(req, res, next) {
	try {
		const result = await petService.deletePet(req.user, req.params.id);
		logAction({
			actor: req.user,
			action: "pet_deleted",
			entity: "pet",
			entityId: String(req.params.id),
			details: { name: result.pet?.name, species: result.pet?.species },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}
