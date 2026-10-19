import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiListChecks } from "react-icons/pi";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAuditLogs, useAuditActions } from "../../hooks/useAdminData";

const PAGE_SIZE = 25;

// Human labels for the machine-readable action verbs. Anything not listed
// falls back to the raw verb (new actions stay visible, just unpolished).
const ACTION_LABELS = {
	login: "Signed in",
	login_failed: "Sign-in failed",
	register: "Account created",
	user_created_admin: "Account created by staff",
	email_verified: "Email verified",
	otp_resend: "Verification code re-sent",
	password_reset_requested: "Password reset requested",
	password_reset: "Password reset via email",
	password_changed: "Password changed",
	profile_updated: "Profile updated",
	appointment_booked: "Appointment booked",
	appointment_status_changed: "Appointment status changed",
	appointment_cancelled: "Appointment cancelled",
	pet_created: "Pet registered",
	pet_updated: "Pet updated",
	pet_deleted: "Pet removed",
	vet_created: "Veterinarian added",
	vet_updated: "Veterinarian updated",
	vet_deactivated: "Veterinarian deactivated",
};

// Sensitivity tint for badges: auth events & deletions get attention.
const ACTION_TONE = {
	// Authentication
	login: "success",
	login_failed: "danger",
	register: "success",
	user_created_admin: "success",
	email_verified: "success",
	otp_resend: "accent",

	// Password & account security
	password_reset_requested: "accent",
	password_reset: "accent",
	password_changed: "accent",
	profile_updated: "default",

	// Appointments
	appointment_booked: "success",
	appointment_status_changed: "accent",
	appointment_cancelled: "warn",

	// Pets
	pet_created: "success",
	pet_updated: "default",
	pet_deleted: "danger",

	// Veterinarians
	vet_created: "success",
	vet_updated: "default",
	vet_deactivated: "warn",
};

function relativeTime(value) {
	const s = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	const days = Math.floor(s / 86400);
	if (days < 7) return `${days}d ago`;
	return new Date(value).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function fullTime(value) {
	return new Date(value).toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function ActionBadge({ action }) {
	const tone = ACTION_TONE[action] || "default";

	console.log({ action, tone });
	return (
		<span className={`audit-action ${tone}`}>
			{ACTION_LABELS[action] || action}
		</span>
	);
}

// "What happened" cell: verb + context (email, from→to, pet name…).
function ActionSummary({ action, details }) {
	const d = details || {};
	let context = "";
	if (d.email) context = d.email;
	if (d.from && d.to) context = `${d.from} → ${d.to}`;
	if (d.name) context = d.name;
	if (d.status) context = `${d.status} (${d.reason || "no details"})`;
	if (d.fields?.length) context = d.fields.join(", ");
	if (d.via) context = d.via;
	if (d.by) context = `by ${d.by}`;
	return (
		<>
			<ActionBadge action={action} />{" "}
			{context && <span className="audit-action-detail">{context}</span>}
		</>
	);
}

function Activity() {
	const [search, setSearch] = useState("");
	const [debounced, setDebounced] = useState("");
	const [action, setAction] = useState("");
	const [page, setPage] = useState(1);

	const { data, isPending, isError } = useAuditLogs({
		search: debounced,
		action,
		page,
		limit: PAGE_SIZE,
	});
	const { data: actionsData } = useAuditActions();

	// Debounce search so we're not round-tripping on every keystroke.
	useEffect(() => {
		const t = setTimeout(() => {
			setDebounced(search.trim());
			setPage(1);
		}, 300);
		return () => clearTimeout(t);
	}, [search]);

	useEffect(() => setPage(1), [action]);

	const logs = data?.logs ?? [];
	const total = data?.total ?? 0;
	const pages = data?.pages ?? 1;
	const availableActions = useMemo(
		() => (actionsData?.actions ?? []).filter((a) => a !== action),
		[actionsData, action],
	);

	return (
		<>
			<AdminPageHeader
				eyebrow="SYSTEM"
				title="Activity"
				description="Audit trail of sign-ins, account changes, and data modifications across the clinic."
				actions={
					<span className="admin-panel-meta">
						<PiListChecks size={15} /> {total} event{total === 1 ? "" : "s"}{" "}
						recorded
					</span>
				}
			/>

			<section className="admin-panel audit-panel">
				<div className="audit-toolbar">
					<div className="audit-search">
						<FiSearch size={15} />
						<input
							type="search"
							placeholder="Search who, what, or email…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<select
						className="audit-filter"
						value={action}
						onChange={(e) => setAction(e.target.value)}
					>
						<option value="">All actions</option>
						{Object.keys(ACTION_LABELS).map((a) => (
							<option key={a} value={a}>
								{ACTION_LABELS[a]}
							</option>
						))}
						{availableActions.map((a) => (
							<option key={a} value={a}>
								{ACTION_LABELS[a] || a}
							</option>
						))}
					</select>
				</div>

				{isPending ? (
					<p className="admin-panel-empty">Loading activity…</p>
				) : isError ? (
					<p className="admin-panel-empty">
						Could not load the activity trail — check the API and try again.
					</p>
				) : logs.length === 0 ? (
					<p className="admin-panel-empty">
						No events match your filters yet. Sign-ins, bookings, and data
						changes will appear here.
					</p>
				) : (
					<div className="audit-table-wrapper">
						<table className="audit-table">
							<thead>
								<tr>
									<th>WHEN</th>
									<th>WHO</th>
									<th>WHAT HAPPENED</th>
									<th>ENTITY</th>
									<th>IP</th>
								</tr>
							</thead>
							<tbody>
								{logs.map((log) => (
									<tr key={log._id}>
										<td>
											<span
												className="audit-time"
												title={fullTime(log.createdAt)}
											>
												{relativeTime(log.createdAt)}
											</span>
										</td>
										<td>
											{log.actor ? (
												<>
													<strong>{log.actor.name}</strong>
													<span className="audit-actor-sub">
														{log.actor.email} · {log.actor.role}
													</span>
												</>
											) : (
												<span className="audit-actor-anon">Not signed in</span>
											)}
										</td>
										<td>
											<ActionSummary
												action={log.action}
												details={log.details}
											/>
										</td>
										<td>
											<span className="audit-entity">
												{log.entity ? log.entity : "—"}
												{log.entityId ? ` · ${log.entityId.slice(-6)}` : ""}
											</span>
										</td>
										<td>
											<span className="audit-ip">{log.ip || "—"}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{pages > 1 && (
					<div className="audit-pagination">
						<button
							type="button"
							className="admin-secondary-button"
							disabled={page <= 1}
							onClick={() => setPage((p) => p - 1)}
						>
							Previous
						</button>
						<span>
							Page {page} of {pages}
						</span>
						<button
							type="button"
							className="admin-secondary-button"
							disabled={page >= pages}
							onClick={() => setPage((p) => p + 1)}
						>
							Next
						</button>
					</div>
				)}
			</section>
		</>
	);
}

export default Activity;
