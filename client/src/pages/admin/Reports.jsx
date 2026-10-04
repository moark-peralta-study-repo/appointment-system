import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useStats, useAppointments, usePets } from "../../hooks/useAdminData";
import { formatDate, initials } from "../../utils/admin";

function Reports() {
	const { data: stats, isPending: statsPending } = useStats();
	const { data: appointments = [] } = useAppointments();
	const { data: pets = [] } = usePets();

	const byStatus = stats?.byStatus ?? {};
	const total = stats?.appointments ?? appointments.length;
	const completed = byStatus.completed ?? 0;
	const completionRate = total ? Math.round((completed / total) * 100) : 0;

	// byDay: { "YYYY-MM-DD": count } over the last 14 days, newest first.
	const byDay = Object.entries(stats?.byDay ?? {})
		.sort((a, b) => (a[0] < b[0] ? 1 : -1))
		.slice(0, 14);
	const maxDay = Math.max(...byDay.map(([, n]) => n), 1);

	// New patients this month (pets created in the current month).
	const now = new Date();
	const newThisMonth = pets.filter((p) => {
		const d = new Date(p.createdAt);
		return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
	}).length;

	// Vet workload — appointments return `vet` as a name string.
	const byVet = {};
	for (const a of appointments) {
		if (a.vet) byVet[a.vet] = (byVet[a.vet] || 0) + 1;
	}
	const vetRows = Object.entries(byVet).sort((a, b) => b[1] - a[1]);
	const maxVet = Math.max(...vetRows.map(([, n]) => n), 1);

	// Popular services — count by `reason`.
	const byService = {};
	for (const a of appointments) {
		if (a.reason) byService[a.reason] = (byService[a.reason] || 0) + 1;
	}
	const serviceRows = Object.entries(byService)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4);
	const maxService = Math.max(...serviceRows.map(([, n]) => n), 1);

	const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC ANALYTICS"
				title="Reports"
				description="Monitor clinic activity, appointments, patients, and veterinarian performance."
				actions={
					<div className="reports-header-actions">
						<select className="reports-date-select" defaultValue="month">
							<option value="week">This Week</option>
							<option value="month">This Month</option>
							<option value="quarter">This Quarter</option>
							<option value="year">This Year</option>
						</select>

						<button className="admin-primary-button" type="button">
							Export Report
						</button>
					</div>
				}
			/>

			{/* Summary */}
			<section className="reports-summary">
				<div className="reports-summary-card">
					<div className="reports-summary-icon blue">▣</div>

					<div>
						<span>Total Appointments</span>
						<strong>
						{statsPending ? (
							<span className="mini-spinner" />
						) : (
							total
						)}
					</strong>
						<small>all time at the clinic</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon green">✓</div>

					<div>
						<span>Completed Visits</span>
						<strong>{completed}</strong>
						<small>{completionRate}% completion rate</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon yellow">◷</div>

					<div>
						<span>New Patients</span>
						<strong>{newThisMonth}</strong>
						<small>registered this month</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon soft-blue">₱</div>

					<div>
						<span>Active Patients</span>
						<strong>{pets.length}</strong>
						<small>pets on file</small>
					</div>
				</div>
			</section>

			{/* Main Reports */}
			<section className="reports-grid">
				{/* Appointment Overview */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Overview</h2>
							<p>Appointments recorded in the last 14 days.</p>
						</div>

						<span className="reports-panel-label">{monthLabel}</span>
					</div>

					<div className="reports-chart">
						{byDay.length === 0 && (
							<div className="admin-panel-empty">No appointment data yet.</div>
						)}

						{byDay.map(([day, count]) => (
							<div className="reports-chart-row" key={day}>
								<span>{formatDate(day)}</span>

								<div className="reports-bar-track">
									<div
										className="reports-bar"
										style={{ width: `${Math.round((count / maxDay) * 100)}%` }}
									/>
								</div>

								<strong>{count}</strong>
							</div>
						))}
					</div>

					<div className="reports-chart-footer">
						<span>Total appointments</span>
						<strong>{total}</strong>
					</div>
				</div>

				{/* Appointment Status */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Status</h2>
							<p>Current appointment distribution.</p>
						</div>
					</div>

					<div className="reports-status-list">
						{["confirmed", "pending", "completed", "cancelled"].map((s) => (
							<div className="reports-status-item" key={s}>
								<div className="reports-status-name">
									<span className={`reports-status-dot ${s}`}></span>
									<span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
								</div>

								<strong>{byStatus[s] ?? 0}</strong>
							</div>
						))}
					</div>

					<div className="reports-status-total">
						<span>Total</span>
						<strong>{total} appointments</strong>
					</div>
				</div>
			</section>

			{/* Veterinarian Workload */}
			<section className="admin-panel reports-panel reports-vet-panel">
				<div className="reports-panel-header">
					<div>
						<h2>Veterinarian Workload</h2>
						<p>Appointments handled by each veterinarian.</p>
					</div>
				</div>

				<div className="reports-vet-list">
					{vetRows.length === 0 && (
						<div className="admin-panel-empty">No appointments yet.</div>
					)}

					{vetRows.map(([name, count]) => (
						<div className="reports-vet-row" key={name}>
							<div className="reports-vet-info">
								<div className="reports-vet-avatar">{initials(name)}</div>

								<div>
									<strong>{name}</strong>
									<span>
										{count} appointment{count === 1 ? "" : "s"}
									</span>
								</div>
							</div>

							<div className="reports-vet-progress">
								<div className="reports-progress-track">
									<div
										className="reports-progress-bar"
										style={{ width: `${Math.round((count / maxVet) * 100)}%` }}
									/>
								</div>

								<strong>{count}</strong>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Popular Services */}
			<section className="admin-panel reports-panel">
				<div className="reports-panel-header">
					<div>
						<h2>Popular Services</h2>
						<p>Most requested services across all appointments.</p>
					</div>
				</div>

				<div className="reports-services-grid">
					{serviceRows.length === 0 && (
						<div className="admin-panel-empty">No service data yet.</div>
					)}

					{serviceRows.map(([service, count]) => (
						<div className="reports-service-item" key={service}>
							<div>
								<strong>{service}</strong>
								<span>
									{count} appointment{count === 1 ? "" : "s"}
								</span>
							</div>

							<b>{Math.round((count / maxService) * 100)}%</b>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

export default Reports;
