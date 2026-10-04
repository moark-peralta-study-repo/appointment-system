import { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useVets, useAppointments } from "../../hooks/useAdminData";
import { isToday, initials } from "../../utils/admin";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Mon–Fri 09:00–17:00" from a vet's embedded schedule. */
function scheduleLabel(schedule = []) {
	if (!schedule.length) return "No schedule set";
	const days = [...new Set(schedule.map((s) => DAY_NAMES[s.day]))].join(", ");
	const first = schedule[0];
	return `${days} ${first.start}–${first.end}`;
}

function Veterinarians() {
	const { data: vets = [], isPending } = useVets();
	const { data: appointments = [] } = useAppointments();

	const [specialtyFilter, setSpecialtyFilter] = useState("all");

	// Active (pending/confirmed) appointments per vet, today — the API
	// flattens vet to a name string, so count by name.
	const todayByVet = {};
	for (const a of appointments) {
		if (!a.vet || !isToday(a.date)) continue;
		if (a.status !== "pending" && a.status !== "confirmed") continue;
		todayByVet[a.vet] = (todayByVet[a.vet] || 0) + 1;
	}

	const rows = vets
		.filter((v) => specialtyFilter === "all" || v.specialty === specialtyFilter)
		.map((v) => ({
			...v,
			todayCount: todayByVet[v.name] || 0,
			status: todayByVet[v.name] ? "In Consultation" : "Available",
			initials: initials(v.name),
		}));

	const specialties = [...new Set(vets.map((v) => v.specialty).filter(Boolean))];

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Veterinarians"
				description="Manage the veterinary team and monitor their availability."
				actions={
					<button className="admin-primary-button" type="button">
						+ Add Veterinarian
					</button>
				}
			/>

			{/* SUMMARY */}

			<section className="vet-summary">
				<div className="vet-summary-card">
					<div className="vet-summary-icon blue">
						🩺
					</div>

					<div>
						<span>Total Veterinarians</span>
						<strong>
						{isPending ? (
							<span className="mini-spinner" />
						) : (
							vets.length
						)}
					</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon green">
						✓
					</div>

					<div>
						<span>Available Now</span>
						<strong>{rows.filter((r) => r.status === "Available").length}</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon yellow">
						📅
					</div>

					<div>
						<span>Appointments Today</span>
						<strong>{Object.values(todayByVet).reduce((a, b) => a + b, 0)}</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon soft-blue">
						✦
					</div>

					<div>
						<span>Specialties</span>
						<strong>{specialties.length}</strong>
					</div>
				</div>
			</section>

			{/* TOOLBAR */}

			<section className="admin-panel veterinarians-panel">
				<div className="veterinarians-toolbar">
					<div className="vet-search">
						<span>⌕</span>

						<input
							type="text"
							placeholder="Search veterinarian or specialty..."
						/>
					</div>

					<div className="vet-filters">
						<select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
							<option value="all">All Specialties</option>
							{specialties.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>

						<select defaultValue="all">
							<option value="all">All Availability</option>
							<option value="available">Available</option>
							<option value="consultation">
								In Consultation
							</option>
						</select>
					</div>
				</div>

				{/* VETERINARIAN CARDS */}

				<div className="veterinarian-grid">
					{isPending && (
						<div className="admin-panel-empty" style={{ gridColumn: "1 / -1" }}>
							Loading veterinary team…
						</div>
					)}

					{rows.map((vet) => (
						<div className="veterinarian-card" key={vet._id}>
							<div className="vet-card-top">
								<div className="vet-avatar">
									{vet.initials}
								</div>

								<button
									className="vet-more-button"
									type="button"
									aria-label={`More options for ${vet.name}`}
								>
									•••
								</button>
							</div>

							<div className="vet-card-info">
								<h3>{vet.name}</h3>

								<p className="vet-specialty">
									{vet.specialty ?? "General"}
								</p>

								<p className="vet-experience">
									{scheduleLabel(vet.schedule)}
								</p>
							</div>

							<div className="vet-card-divider"></div>

							<div className="vet-card-bottom">
								<div>
									<span>Today's Appointments</span>
									<strong>{vet.todayCount}</strong>
								</div>

								<span
									className={`vet-status ${
										vet.status === "Available"
											? "available"
											: vet.status === "In Consultation"
											? "consultation"
											: "break"
									}`}
								>
									<span className="vet-status-dot"></span>
									{vet.status}
								</span>
							</div>

							<button
								className="vet-view-button"
								type="button"
							>
								View Profile
							</button>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

export default Veterinarians;
