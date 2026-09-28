import Vet from "../models/Vet.js";

export async function listVets() {
	const vets = await Vet.find({ active: true }).populate("user", "name");
	return vets.map((v) => ({
		_id: v._id,
		name: v.user.name,
		specialty: v.specialty,
		schedule: v.schedule,
	}));
}

export async function getVetDetails() {}
