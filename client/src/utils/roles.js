// Client-side role helpers. Mirror of server/src/utils/roles.js — kept in
// sync so the portal UI scopes pages the same way the API guards them.
//
//   user   — pet owner (client portal)
//   vet    — clinical staff
//   staff  — non-vet clinic staff (reception / front desk)
//   admin  — clinic owner

export const isPortal = (role) => ["vet", "staff", "admin"].includes(role);
export const isClinical = (role) => ["vet", "admin"].includes(role);
export const isManager = (role) => role === "admin";
