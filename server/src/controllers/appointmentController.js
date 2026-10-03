import * as appointmentService from "../services/appointmentService.js";

export async function listAppointments(req, res, next) {
	try {
		const appointments = await appointmentService.listAppointments(req.user);
		res.json(appointments);
	} catch (err) {
		next(err);
	}
}

export async function bookAppointment(req, res, next) {
	try {
		const appointment = await appointmentService.bookAppointment(
			req.user,
			req.body
		);
		res.status(201).json(appointment);
	} catch (err) {
		next(err);
	}
}

export async function updateStatus(req, res, next) {
	try {
		const appointment = await appointmentService.updateStatus(
			req.user,
			req.params.id,
			req.body
		);
		res.json(appointment);
	} catch (err) {
		next(err);
	}
}

export async function cancelAppointment(req, res, next) {
	try {
		const result = await appointmentService.cancelAppointment(
			req.user,
			req.params.id
		);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
