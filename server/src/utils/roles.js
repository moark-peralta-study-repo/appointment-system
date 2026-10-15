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
