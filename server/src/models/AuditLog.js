import mongoose from "mongoose";

// Append-only audit trail (guidelines: "log user activities such as login
// attempts, data modifications, and errors; provide an audit trail for
// sensitive data changes").
//
// actor is the acting user (null = anonymous, e.g. a failed login where we
// only know the email — that goes in details). Rows are never updated or
// deleted by the app; "deletions" elsewhere are soft, so this trail stays
// the system of record for who did what.
const auditLogSchema = new mongoose.Schema(
	{
		// Who — null for anonymous actions (unverified logins, failed logins).
		actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
		// What — stable machine-readable verb: "login", "login_failed",
		// "appointment_booked", "vet_deactivated"…
		action: { type: String, required: true, index: true },
		// On which entity: "user" | "appointment" | "pet" | "vet".
		entity: { type: String, default: null },
		// The affected record's id (if any) — lets a future drill-down page
		// jump from a log row to the record.
		entityId: { type: String, default: null },
		// Free-form context: { email } on failed logins, { from, to } on
		// status changes, { reason, date } on bookings…
		details: { type: mongoose.Schema.Types.Mixed, default: {} },
		// Where — captured at the controller (behind the dev proxy this is
		// the client's IP).
		ip: { type: String, default: null },
	},
	{ timestamps: true },
);

// Newest-first listing is the common query.
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
