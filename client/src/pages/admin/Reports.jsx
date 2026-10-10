import { useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useStats, useAppointments, usePets, useUsers } from "../../hooks/useAdminData";
import { FaClock, FaDownload, FaPaw, FaThLarge } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";

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

// Recharts renders raw SVG, so it can't read CSS vars — these are the light
// theme values (the app's running mode), matched to the palette tokens.
const C = {
	primary: "#0091fd",
	success: "#7cb342",
	warning: "#f4a63a",
	danger: "#e0635a",
	grid: "#e4e9dc",
	axis: "#7b8577",
	surface: "#ffffff",
};

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

// Bucketing for the trend charts depends on how wide the range is.
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

const AXIS_TICK = { fontSize: 11, fill: C.axis };

// Styled tooltip used by every chart on this page.
function ChartTip({ active, payload, label, formatter }) {
	if (!active || !payload?.length) return null;
	return (
		<div style={{
			background: C.surface,
			border: `1px solid ${C.grid}`,
			borderRadius: 10,
			padding: "8px 12px",
			fontSize: 12,
			boxShadow: "0 4px 14px rgba(4,30,48,.10)",
		}}>
			{label != null && (
				<div style={{ color: C.axis, marginBottom: 5, fontSize: 11 }}>{label}</div>
			)}
			{payload.map((p, i) => (
				<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: i ? 3 : 0 }}>
					<span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
					<span style={{ color: C.axis }}>{formatter ? formatter(p, i) : p.name}</span>
					<strong>{p.value}</strong>
				</div>
			))}
		</div>
	);
}

function CenterLabel({ value, sub }) {
	return (
		<div style={{
			position: "absolute", inset: 0,
			display: "flex", flexDirection: "column",
			alignItems: "center", justifyContent: "center",
			pointerEvents: "none",
		}}>
			<span style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{value}</span>
			<span style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>{sub}</span>
		</div>
	);
}

const STATUS_META = [
	{ key: "confirmed", color: C.primary },
	{ key: "pending", color: C.warning },
	{ key: "completed", color: C.success },
	{ key: "cancelled", color: C.danger },
];

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
	const rangeTotal = inRange.length;

	// New patients registered in each bucket (for the overview line).
	const newPetsByBucket = useMemo(() => {
		const counts = Object.fromEntries(buckets.map((b) => [b.key, 0]));
		for (const p of pets) {
			if (!p.createdAt) continue;
			const d = new Date(p.createdAt);
			if (d < start) continue;
			const key =
				range === "week" || range === "month"
					? toDayKey(d)
					: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			if (key in counts) counts[key] += 1;
		}
		return buckets.map((b) => ({ ...b, newPatients: counts[b.key] }));
	}, [buckets, pets, range, start]);

	// ---- status breakdown (in range) ---------------------------------
	const byStatus = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
	for (const a of inRange) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
	const statusData = STATUS_META
		.map((m) => ({ name: m.key, value: byStatus[m.key] ?? 0, color: m.color }))
		.filter((d) => d.value > 0);
	const newPets = pets.filter((p) => new Date(p.createdAt) >= start).length;

	// ---- vet workload (in range) --------------------------------------
	const byVet = {};
	for (const a of inRange) {
		if (a.vet) byVet[a.vet] = (byVet[a.vet] || 0) + 1;
	}
	const vetRows = Object.entries(byVet).sort((a, b) => b[1] - a[1]);
	const vetData = vetRows.map(([name, count]) => ({ name, count }));

	// ---- popular services (in range) -----------------------------------
	const byService = {};
	for (const a of inRange) {
		if (a.reason) byService[a.reason] = (byService[a.reason] || 0) + 1;
	}
	const serviceRows = Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 5);
	const serviceData = serviceRows.map(([name, count]) => ({ name, count }));

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
							<FaDownload size={13} /> Export CSV
						</button>
					</div>
				}
			/>

			{/* Summary — range-aware where it makes sense */}
			<section className="reports-summary">
				<div className="reports-summary-card">
					<div className="reports-summary-icon blue"><FaThLarge size={20} /></div>

					<div>
						<span>Appointments ({label.toLowerCase()})</span>
						<strong>{rangeTotal}</strong>
						<small>{allTime} all time</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon green"><FiCheck size={20} /></div>

					<div>
						<span>Completed Visits (all time)</span>
						<strong>{completedAll}</strong>
						<small>{completionRate}% completion rate</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon yellow"><FaClock size={20} /></div>

					<div>
						<span>New Patients</span>
						<strong>{newPets}</strong>
						<small>registered {label.toLowerCase()}</small>
					</div>
				</div>

				<div className="reports-summary-card">
					<div className="reports-summary-icon soft-blue"><FaPaw size={20} /></div>

					<div>
						<span>Active Patients</span>
						<strong>{pets.length}</strong>
						<small>pets on file</small>
					</div>
				</div>
			</section>

			{/* Main Reports */}
			<section className="reports-grid">
				{/* Appointment Overview — appointments + new patients trend */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Overview</h2>
							<p>Appointments and new patients in {label.toLowerCase()}.</p>
						</div>

						<span className="reports-panel-label">{label}</span>
					</div>

					{rangeTotal === 0 ? (
						<div className="admin-panel-empty">No appointments in this range yet.</div>
					) : (
						<>
							<div className="reports-chart-block">
								<div className="reports-chart" style={{ height: 240 }}>
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={newPetsByBucket} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
											<defs>
												<linearGradient id="gradAppointments" x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor={C.primary} stopOpacity={0.32} />
													<stop offset="100%" stopColor={C.primary} stopOpacity={0.03} />
												</linearGradient>
											</defs>
											<XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
											<YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
											<Tooltip
												content={<ChartTip formatter={(p) => (p.dataKey === "count" ? "Appointments" : "New patients")} />}
											/>
											<Area
												type="monotone"
												dataKey="count"
												name="Appointments"
												stroke={C.primary}
												strokeWidth={2.5}
												fill="url(#gradAppointments)"
												dot={false}
												activeDot={{ r: 4, strokeWidth: 0 }}
											/>
											<Line
												type="monotone"
												dataKey="newPatients"
												name="New patients"
												stroke={C.success}
												strokeWidth={2}
												strokeDasharray="5 4"
												dot={false}
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="reports-chart-footer">
								<span>Total in range</span>
								<strong>{rangeTotal} appointments · {newPets} new patients</strong>
							</div>
						</>
					)}
				</div>

				{/* Appointment Status — donut for the selected range */}
				<div className="admin-panel reports-panel">
					<div className="reports-panel-header">
						<div>
							<h2>Appointment Status</h2>
							<p>Distribution for {label.toLowerCase()}.</p>
						</div>
					</div>

					{rangeTotal === 0 ? (
						<div className="admin-panel-empty">No appointments in this range.</div>
					) : (
						<div className="reports-status-chart">
							<div className="reports-pie-wrap" style={{ height: 220, width: 220 }}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Tooltip
											content={<ChartTip formatter={(p) => p.name.charAt(0).toUpperCase() + p.name.slice(1)} />}
										/>
										<Pie
											data={statusData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											innerRadius={68}
											outerRadius={92}
											paddingAngle={2}
											stroke={C.surface}
											strokeWidth={3}
										>
											{statusData.map((s) => (
												<Cell key={s.name} fill={s.color} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
								<CenterLabel value={rangeTotal} sub="appointments" />
							</div>

							<div className="reports-status-legend">
								{STATUS_META.map(({ key, color }) => {
									const n = byStatus[key] ?? 0;
									return (
										<div className="reports-status-item" key={key}>
											<div className="reports-status-name">
												<span className="reports-status-dot" style={{ background: color }} />
												<span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
											</div>
											<strong>{n}</strong>
											<span className="reports-status-pct">{rangeTotal ? Math.round((n / rangeTotal) * 100) : 0}%</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
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

				{vetData.length === 0 ? (
					<div className="admin-panel-empty">No appointments in this range.</div>
				) : (
					<div className="reports-chart" style={{ height: Math.max(180, vetData.length * 64) }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={vetData} layout="vertical" margin={{ top: 4, right: 24, left: 12, bottom: 0 }}>
								<XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} />
								<YAxis
									type="category"
									dataKey="name"
									tick={{ fontSize: 12, fill: "var(--text)" }}
									tickLine={false}
									axisLine={false}
									width={150}
								/>
								<Tooltip
									content={<ChartTip formatter={(p) => p.payload.name} />}
								/>
								<Bar dataKey="count" name="Appointments" fill={C.primary} radius={[0, 8, 8, 0]} barSize={26} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</section>

			{/* Popular Services — in range */}
			<section className="admin-panel reports-panel">
				<div className="reports-panel-header">
					<div>
						<h2>Popular Services</h2>
						<p>Most requested services, {label.toLowerCase()}.</p>
					</div>
				</div>

				{serviceData.length === 0 ? (
					<div className="admin-panel-empty">No service data in this range.</div>
				) : (
					<div className="reports-chart" style={{ height: 260 }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={serviceData} margin={{ top: 4, right: 8, left: -18, bottom: 4 }}>
								<XAxis
									dataKey="name"
									tick={{ fontSize: 10, fill: C.axis }}
									tickLine={false}
									axisLine={false}
									interval={0}
									angle={-24}
									textAnchor="end"
									height={64}
								/>
								<YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
								<Tooltip
									content={<ChartTip formatter={(p) => p.payload.name} />}
								/>
								<Bar dataKey="count" name="Appointments" fill={C.primary} radius={[8, 8, 0, 0]} barSize={30} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</section>
		</>
	);
}

export default Reports;
