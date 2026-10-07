import mongoose from "mongoose";
import Pet from "../models/Pet.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export async function listPets(user) {
	if (user.role === "vet") {
		return await Pet.find();
	}

	return await Pet.find({ owner: user._id });
}

export async function createPet(
	user,
	{ name, species, breed, age, gender, notes, ownerId },
) {
	// Vets register patients on behalf of owners — pass the owner id in.
	// Owners always register for themselves.
	const owner = user.role === "vet" && ownerId ? await User.findById(ownerId) : user;
	if (!owner) throw new ApiError(404, "Owner not found");
	if (owner.role !== "user") throw new ApiError(400, "Owner must be a pet owner account");

	const pet = await Pet.create({
		owner: owner._id,
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
	if (user.role !== "vet" && !pet.owner.equals(user._id)) {
		throw new ApiError(403, "Not your pet");
	}

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
	if (user.role !== "vet" && !pet.owner.equals(user._id)) {
		throw new ApiError(403, "Not your pet");
	}

	await pet.deleteOne();
	return { message: "Pet deleted" };
}
