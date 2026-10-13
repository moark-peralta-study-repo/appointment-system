import * as appointmentService from "../services/appointmentService.js";
import { logAction, clientIp } from "../services/auditService.js";

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
		logAction({
			actor: req.user,
			action: "appointment_booked",
			entity: "appointment",
			entityId: String(appointment._id),
			details: {
				pet: appointment.pet?.name,
				vet: appointment.vet,
				date: appointment.date,
				time: appointment.time,
				reason: appointment.reason,
			},
			ip: clientIp(req),
		});
		res.status(201).json(appointment);
	} catch (err) {
		next(err);
	}
}

export async function updateStatus(req, res, next) {
	try {
		const { appointment, previousStatus } =
			await appointmentService.updateStatus(req.user, req.params.id, req.body);
		logAction({
			actor: req.user,
			action: "appointment_status_changed",
			entity: "appointment",
			entityId: String(appointment._id),
			details: { from: previousStatus, to: appointment.status },
			ip: clientIp(req),
		});
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
		logAction({
			actor: req.user,
			action: "appointment_cancelled",
			entity: "appointment",
			entityId: String(req.params.id),
			details: { by: req.user.role === "vet" ? "vet" : "owner" },
			ip: clientIp(req),
		});
		res.json(result);
	} catch (err) {
		next(err);
	}
}
