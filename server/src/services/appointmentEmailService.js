// Client-facing appointment status emails.
//
// The owner of an appointment gets notified when its status changes:
//   confirmed  → "your appointment is confirmed"
//   completed  → "visit finished" + the structured medical record (if any)
//   cancelled  → "your appointment was cancelled"
//
// Self-action suppression: an owner cancelling their own appointment already
// knows — no email. (Owners can't confirm/complete, so those always reach
// the client from a clinic-side action.)
//
// Delivery is fire-and-forget: the service never throws, it just logs
// (mailer already degrades to console output when no SMTP host is set —
// MailDev inbox in local dev). Callers should await it but not guard the
// request outcome on it.
import Appointment from "../models/Appointment.js";
import { sendMail } from "../config/mailer.js";
import { emailLayout } from "../utils/emailTemplates.js";

const fmtDate = (d) =>
	new Date(d).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
const fmtTime = (t) => {
	// stored 24h "HH:MM" → "2:30 PM"
	const [h, m] = t.split(":").map(Number);
	const ap = h >= 12 ? "PM" : "AM";
	const hr = h % 12 === 0 ? 12 : h % 12;
	return `${hr}:${String(m).padStart(2, "0")} ${ap}`;
};

/** Populate the pieces the email needs (owner email/name, pet, vet). */
async function describe(appointment) {
	const a = await Appointment.findById(appointment._id)
		.populate("owner", "name email")
		.populate("pet")
		.populate({ path: "vet", select: "name" });
	return a;
}

/**
 * Email the appointment owner about a status change.
 * @param {object} appointment - Mongoose doc (unpopulated is fine)
 * @param {string} previousStatus
 * @param {string} actorRole   - role of whoever performed the action
 * @param {object} [actor]     - actor doc, used to detect self-cancel
 */
export async function notifyClient(appointment, previousStatus, actor, actorRole) {
	try {
		if (!appointment || previousStatus === appointment.status) return { sent: false, reason: "no-change" };
		const status = appointment.status;
		if (!["confirmed", "completed", "cancelled"].includes(status)) return { sent: false, reason: "status" };

		// Owner cancelled their own booking → they already know.
		if (
			status === "cancelled" &&
			actorRole === "user" &&
			actor &&
			actor._id.equals(appointment.owner)
		) {
			return { sent: false, reason: "self-cancel" };
		}

		const a = await describe(appointment);
		if (!a?.owner?.email) return { sent: false, reason: "no-email" };
		const firstName = a.owner.name.split(" ")[0];
		const pet = a.pet?.name ?? "your pet";
		const vet = a.vet?.name ?? "your veterinarian";
		const when = `${fmtDate(a.date)}, ${fmtTime(a.time)}`;
		const record = a.medicalRecord;

		let subject, html;
		if (status === "confirmed") {
			subject = `Your appointment is confirmed — ${pet} · ${when}`;
			html = emailLayout({
				title: "Appointment confirmed",
				lines: [
					`Hi ${firstName}, your appointment for ${pet} with ${vet} is confirmed.`,
					`When: ${when}`,
					`For: ${a.reason ?? "a visit"}`,
					`Need to change it? You can cancel from your account — just sign in and pick the appointment.`,
				],
				footer:
					"You're receiving this because we manage your pet's appointment at Pink Paws Veterinary Clinic.",
			});
		} else if (status === "completed") {
			const lines = [
				`Hi ${firstName}, our visit for ${pet} on ${fmtDate(a.date)} is complete.`,
			];
			if (record?.findings) {
				lines.push(`Findings: ${record.findings}`);
				if (record.diagnosis) lines.push(`Diagnosis: ${record.diagnosis}`);
				if (record.treatment) lines.push(`Treatment: ${record.treatment}`);
				if (record.medications) lines.push(`Medications: ${record.medications}`);
				if (record.followUp) lines.push(`Follow-up: ${record.followUp}`);
			} else if (a.vetNotes) {
				lines.push(`Veterinarian notes: ${a.vetNotes}`);
			} else {
				lines.push("The full record is available anytime in your account under Medical Records.");
			}
			lines.push("Take care of your pet, and feel free to reach out with questions.");
			subject = `Visit complete — ${pet}'s summary from ${vet}`;
			html = emailLayout({
				title: "Your visit summary",
				lines,
				footer:
					"You're receiving this because a veterinarian completed a visit at Pink Paws Veterinary Clinic.",
			});
		} else {
			subject = `Your appointment was cancelled — ${pet} · ${when}`;
			const byClinic = actorRole !== "user";
			html = emailLayout({
				title: "Appointment cancelled",
				lines: [
					byClinic
						? `Hi ${firstName}, we're letting you know that the appointment for ${pet} with ${vet} on ${when} has been cancelled by the clinic.`
						: `Hi ${firstName}, your appointment for ${pet} on ${when} is cancelled.`,
					`If this wasn't expected, or you'd like to reschedule, sign in to your account or call us.`,
				],
				footer:
					"You're receiving this because an appointment changed at Pink Paws Veterinary Clinic.",
			});
		}

		const delivered = await sendMail({ to: a.owner.email, subject, html });
		return { sent: true, delivered };
	} catch (err) {
		// Never let an email failure take down the status change.
		console.warn(`[appointment-email] failed for ${appointment?._id}: ${err.message}`);
		return { sent: false, reason: "error" };
	}
}
