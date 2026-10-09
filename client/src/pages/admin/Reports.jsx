import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useStats, useAppointments, usePets, useUsers } from "../../hooks/useAdminData";
import { initials } from "../../utils/admin";

// Ranges the header selector offers. All filtering is client-side over the
// full /appointments list (small dataset), so the select actually works —
// the "all-time" summary card keeps the real totals from /vets/stats.
const RANGES = [
	{ id: "week", label: "This Week" },
	{ id: "month", label: "This Month" },
	{ id: "quarter", label: "This Quarter" },
	{ id: "year", label: "This Year" },
	{ id: "all", label: "All Time" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];

function rangeStart(id) {
	const now = new Date();
	const y = now.getFullYear();
	const m = now.getMonth();
	switch (id) {
		case "week": {
			const d = new Date(now);
			d.setDate(now.getDate() - now.getDay()); // Sunday
			d.setHours(0, 0, 0, 0);
			return d;
		}
		case "month":
			return new Date(y, m, 1);
		case "quarter":
			return new Date(y, Math.floor(m / 3) * 3, 1);
		case "year":
			return new Date(y, 0, 1);
		default:
			return new Date(1990, 0, 1);
	}
}

function rangeLabel(id) {
	const now = new Date();
	switch (id) {
		case "week":
			return `Week of ${MONTHS[now.getMonth()]} ${now.getDate() - now.getDay()}, ${now.getFullYear()}`;
		case "month":
			return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
		case "quarter":
			return `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
		case "year":
			return `Year ${now.getFullYear()}`;
		default:
			return "All Time";
	}
}

function toDayKey(v) {
	const d = new Date(v);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Bucketing for the trend chart depends on how wide the range is.
function buildBuckets(appts, rangeId) {
	const start = rangeStart(rangeId);
	const now = new Date();
	const buckets = [];

	if (rangeId === "week") {
		// 7 daily buckets
		for (let i = 0; i < 7; i++) {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			buckets.push({ key: toDayKey(d), label: d.toLocaleDateString("en-US", { weekday: "short" }) });
		}
	} else if (rangeId === "month") {
		// daily buckets for the current month
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		for (let i = 1; i <= daysInMonth; i++) {
			const d = new Date(now.getFullYear(), now.getMonth(), i);
			buckets.push({ key: toDayKey(d), label: String(i) });
		}
	} else {
		// monthly buckets over the range (quarter≈3, year=12, all=full history)
		let first = new Date(now.getFullYear(), now.getMonth(), 1);
		if (appts.length) {
			const oldest = new Date(Math.min(...appts.map((a) => new Date(a.date).getTime())));
			oldest.setDate(1);
			if (oldest < first) first = oldest;
		}
		const cur = new Date(Math.min(start, first));
		const end = new Date(Math.max(start, first));
		cur.setDate(1);
		while (cur <= end) {
			buckets.push({
				key: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`,
				label: cur.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
			});
			cur.setMonth(cur.getMonth() + 1);
		}
		if (buckets.length > 24) buckets.splice(0, buckets.length - 24);
	}

	const counts = Object.fromEntries(buckets.map((b) => [b.key, 0]));
	for (const a of appts) {
		const d = new Date(a.date);
		if (d < start) continue;
		const key =
			rangeId === "week" || rangeId === "month"
				? toDayKey(d)
				: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		if (key in counts) counts[key] += 1;
	}

	return buckets.map((b) => ({ ...b, count: counts[b.key] }));
}

function csvEscape(v) {
	const s = v == null ? "" : String(v);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function Reports() {
	const { data: stats } = useStats();
	const { data: appointments = [] } = useAppointments();
	const { data: pets = [] } = usePets();
	const { data: users = [] } = useUsers();
	const [range, setRange] = useState("month");

	const start = rangeStart(range);
	const label = rangeLabel(range);

	const ownersById = useMemo(
		() => Object.fromEntries(users.map((u) => [u._id, u.name])),
		[users],
	);

	const inRange = useMemo(
		() => appointments.filter((a) => new Date(a.date) >= start),
		[appointments, start],
	);

	// ---- trend buckets ------------------------------------------------
	const buckets = useMemo(() => buildBuckets(appointments, range), [appointments, range]);
	const maxBucket = Math.max(...buckets.map((b) => b.count), 1);
	const rangeTotal = inRange.length;

	// ---- status breakdown (in range) ---------------------------------
	const byStatus = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
	for (const a of inRange) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;

	// ---- new patients (in range) -------------------------------------
	const newPets = pets.filter((p) => new Date(p.createdAt) >= start).length;

	// ---- vet workload (in range) ---------------------------------------
	const byVet = {};
	for (const a of inRange) {
		if (a.vet) byVet[a.vet] = (byVet[a.vet] || 0) + 1;
	}
	const vetRows = Object.entries(byVet).sort((a, b) => b[1] - a[1]);
	const maxVet = Math.max(...vetRows.map(([, n]) => n), 1);

	// ---- popular services (in range) ------------------------------------
	const byService = {};
	for (const a of inRange) {
		if (a.reason) byService[a.reason] = (byService[a.reason] || 0) + 1;
	}
	const serviceRows = Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 5);
	const maxService = Math.max(...serviceRows.map(([, n]) => n), 1);

	// ---- CSV export ------------------------------------------------------
	const exportCSV = () => {
		const header = [
			"Date",
			"Time",
			"Pet",
			"Owner",
			"Service",
			"Veterinarian",
			"Status",
			"Owner Notes",
			"Vet Notes",
		];
		const rows = inRange
			.slice()
			.sort((a, b) => new Date(a.date) - new Date(b.date))
			.map((a) => [
				toDayKey(a.date),
				a.time,
				a.pet?.name ?? "",
				ownersById[a.owner] ?? "",
				a.reason ?? "",
				a.vet ?? "",
				a.status,
				a.ownerNotes ?? "",
				a.vetNotes ?? "",
			]);
		const csv = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
		const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `appointments-${range}-${toDayKey(new Date())}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	const allTime = stats?.appointments ?? appointments.length;
	const completedAll = stats?.byStatus?.completed ?? 0;
	const completionRate = allTime ? Math.round((completedAll / allTime) * 100) : 0;

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC ANALYTICS"
				title="Reports"
				description="Monitor clinic activity, appointments, patients, and veterinarian performance."
				actions={
					<div className="reports-header-actions">
						<select
							className="reports-date-select"
							value={range}
							onChange={(e) => setRange(e.target.value)}
							aria-label="Report date range"
						>
							{RANGES.map((r) => (
								<option key={r.id} value={r.id}>
									{r.label}
								</option>
							))}
						</select>

						<button
							className="admin-primary-button"
							type="button"
							onClick={exportCSV}
							disabled={inRange.length === 0}
							title={inRange.length === 0 ? "No appointments in this range" : "Download CSV"}
						>
							⬇ Export CSV
						</button>
					</div>
				}
			/>

			{/* Summary — range-aware where it makes sense */}
			<section className="reports-summary">
				<div className="reports-summary-card">
					<div className="reports-summary-icon blue">▣</div>

					<div>
						<span>Appointments ({label.toLowerCase()})</span>
						<strong>{rangeTotal}</strong>
						<small>{allTime} all time</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon green">✓</div>

					<div>
						<span>Completed Visits (all time)</span>
						<strong>{completedAll}</strong>
						<small>{completionRate}% completion rate</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon yellow">◷</div>

					<div>
						<span>New Patients</span>
						<strong>{newPets}</strong>
						<small>registered {label.toLowerCase()}</small>
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
				{/* Appointment Overview — trend for the selected range */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Overview</h2>
							<p>Appointments recorded in {label.toLowerCase()}.</p>
						</div>

						<span className="reports-panel-label">{label}</span>
					</div>

					<div className="reports-chart">
						{rangeTotal === 0 && (
							<div className="admin-panel-empty">No appointments in this range yet.</div>
						)}

						{rangeTotal > 0 &&
							buckets.map((b) => (
								<div className="reports-chart-row" key={b.key}>
									<span>{b.label}</span>

									<div className="reports-bar-track">
										<div
											className="reports-bar"
											style={{ width: `${Math.round((b.count / maxBucket) * 100)}%` }}
										/>
									</div>

									<strong>{b.count}</strong>
								</div>
							))}
					</div>

					<div className="reports-chart-footer">
						<span>Total in range</span>
						<strong>{rangeTotal}</strong>
					</div>
				</div>

				{/* Appointment Status — in range */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Status</h2>
							<p>Distribution for {label.toLowerCase()}.</p>
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
						<strong>{rangeTotal} appointments</strong>
					</div>
				</div>
			</section>

			{/* Veterinarian Workload — in range */}
			<section className="admin-panel reports-panel reports-vet-panel">
				<div className="reports-panel-header">
					<div>
						<h2>Veterinarian Workload</h2>
						<p>Appointments handled by each veterinarian, {label.toLowerCase()}.</p>
					</div>
				</div>

				<div className="reports-vet-list">
					{vetRows.length === 0 && (
						<div className="admin-panel-empty">No appointments in this range.</div>
					)}

					{vetRows.map(([name, count]) => (
						<div className="reports-vet-row" key={name}>
							<div className="reports-vet-info">
								<div className="reports-vet-avatar">{initials(name)}</div>

								<div>
									<strong>{name}</strong>
									<span>{count} appointment{count === 1 ? "" : "s"}</span>
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

			{/* Popular Services — in range */}
			<section className="admin-panel reports-panel">
				<div className="reports-panel-header">
					<div>
						<h2>Popular Services</h2>
						<p>Most requested services, {label.toLowerCase()}.</p>
					</div>
				</div>

				<div className="reports-services-grid">
					{serviceRows.length === 0 && (
						<div className="admin-panel-empty">No service data in this range.</div>
					)}

					{serviceRows.map(([service, count]) => (
						<div className="reports-service-item" key={service}>
							<div>
								<strong>{service}</strong>
								<span>{count} appointment{count === 1 ? "" : "s"}</span>
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
