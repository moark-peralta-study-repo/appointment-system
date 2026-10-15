import * as staffService from "../services/staffService.js";

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
		res.json(member);
	} catch (err) {
		next(err);
	}
}

export async function removeStaff(req, res, next) {
	try {
		const result = await staffService.removeStaff(req.params.id);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
