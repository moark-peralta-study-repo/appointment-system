// Role semantics for the staff portal.
//
//   user   — pet owner (client portal). Books their own pets, sees own data.
//   vet    — clinical staff. Manages appointments/patients, writes medical records.
//   staff  — non-vet clinic staff (reception / front desk). Handles appointments,
//            patients and pet owners, but no clinical medical records.
//   admin  — clinic owner. Everything, plus manages the vet & staff rosters.
//
// Kept as tiny pure helpers so controllers/services share one definition
// instead of re-spelling the role lists (drift is the usual bug here).

/** Roles that have the full staff portal (as opposed to the client portal). */
export const PORTAL_ROLES = ["vet", "staff", "admin"];

/** Roles that can manage appointments & patients on behalf of owners. */
export const OPERATIONAL_ROLES = ["vet", "staff", "admin"];

/** Roles that can write / view clinical medical records. */
export const CLINICAL_ROLES = ["vet", "admin"];

/** Roles that can manage the vet & staff rosters. */
export const MANAGER_ROLES = ["admin"];

export const isPortal = (role) => PORTAL_ROLES.includes(role);
export const isOperational = (role) => OPERATIONAL_ROLES.includes(role);
export const isClinical = (role) => CLINICAL_ROLES.includes(role);
export const isManager = (role) => MANAGER_ROLES.includes(role);

/**
 * Can this user act on (change status / cancel) this specific appointment?
 *   owner (user)  → only their own appointments
 *   vet           → only the ones they are assigned to (clinical decision)
 *   staff / admin → any appointment (they coordinate the schedule)
 * `appointment.vet` is the assigned vet User id (ObjectId), `appointment.owner`
 * the pet-owner User id.
 */
export const canActOnAppointment = (actor, appointment) => {
	// staff & admin coordinate the whole schedule → any appointment.
	if (actor.role === "staff" || actor.role === "admin") return true;
	// vet: only the ones they are assigned to (clinical decision).
	if (actor.role === "vet") {
		return appointment.vet && String(appointment.vet) === String(actor._id);
	}
	// owner (user): their own appointments only.
	return appointment.owner.equals
		? appointment.owner.equals(actor._id)
		: String(appointment.owner) === String(actor._id);
};
