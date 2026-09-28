import mongoose from "mongoose";
import Pet from "../models/Pet.js";
import ApiError from "../utils/ApiError.js";

export async function listPets(user) {
	if (user.role === "vet") {
		return await Pet.find();
	}

	return await Pet.find({ owner: user._id });
}

export async function createPet(
	user,
	{ name, species, breed, age, gender, notes },
) {
	const pet = await Pet.create({
		owner: user._id,
		name,
		species,
		breed,
		age,
		gender,
		notes,
	});

	return pet;
}
export async function updatePet(user, petId, updates) {
	if (!mongoose.isValidObjectId(petId)) {
		throw new ApiError(404, "Pet not found");
	}

	const pet = await Pet.findById(petId);
	if (!pet) throw new ApiError(404, "Pet not found");
	if (!pet.owner.equals(user._id)) throw new ApiError(403, "Not your pet");

	const allowed = ["name", "species", "breed", "age", "gender", "notes"];
	for (const field of allowed) {
		if (updates[field] !== undefined) pet[field] = updates[field];
	}

	await pet.save();
	return pet;
}
export async function deletePet(user, petId) {
	if (!mongoose.isValidObjectId(petId)) {
		throw new ApiError(404, "Pet not found");
	}

	const pet = await Pet.findById(petId);
	if (!pet) throw new ApiError(404, "Pet not found");
	if (!pet.owner.equals(user._id)) throw new ApiError(403, "Not your pet");

	await pet.deleteOne();
	return { message: "Pet deleted" };
}
