import { useMemo, useState } from "react";
import {
	useAppointments,
	useUsers,
	useStats,
	useUpdateAppointmentStatus,
	useCancelAppointment,
} from "../../hooks/useAdminData";
import { format12h, isToday } from "../../utils/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import NewAppointmentModal from "../../components/admin/booking/NewAppointmentModal";
import { PiCat, PiDog } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";

function Appointments() {
	const { data: appointments = [], isPending } = useAppointments();
	const { data: users = [] } = useUsers();
	const { data: stats } = useStats();

	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("today");
	const [search, setSearch] = useState("");
	const [showNew, setShowNew] = useState(false);

	const updateStatus = useUpdateAppointmentStatus();
	const cancel = useCancelAppointment();

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	const todayCount = appointments.filter((a) => isToday(a.date)).length;

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return appointments
			.filter((a) => statusFilter === "all" || a.status === statusFilter)
			.filter((a) => {
				if (dateFilter === "today") return isToday(a.date);
				if (dateFilter === "week") {
					// Next 7 days: today → +6 days, local calendar days.
					const d = new Date(a.date);
					const start = new Date();
					start.setHours(0, 0, 0, 0);
					const end = new Date(start);
					end.setDate(end.getDate() + 6);
					end.setHours(23, 59, 59, 999);
					return d >= start && d <= end;
				}
				return true; // "all"
			})
			.filter((a) => {
				if (!q) return true;
				const hay =
					`${a.pet?.name ?? ""} ${ownersById[a.owner]?.name ?? ""} ${a.vet ?? ""} ${a.reason ?? ""}`.toLowerCase();
				return hay.includes(q);
			})
			.sort((x, y) => {
				const dx = new Date(x.date) - new Date(y.date);
				return dx !== 0 ? dx : x.time > y.time ? 1 : -1;
			});
	}, [appointments, statusFilter, dateFilter, search, ownersById]);

	const summary = [
		{ label: "Today's Appointments", value: todayCount },
		{ label: "Confirmed", value: stats?.byStatus?.confirmed ?? 0 },
		{ label: "Pending", value: stats?.byStatus?.pending ?? 0 },
		{ label: "Completed", value: stats?.byStatus?.completed ?? 0 },
	];

	function act(row, action) {
		if (action === "cancel") cancel.mutate(row._id);
		else updateStatus.mutate({ id: row._id, status: action });
	}

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Appointments"
				description="Manage and monitor all scheduled veterinary appointments."
				actions={
					<button
						className="admin-primary-button"
						type="button"
						onClick={() => setShowNew(true)}
					>
						+ New Appointment
					</button>
				}
			/>

			<section className="appointment-summary">
				{summary.map((s) => (
					<div className="appointment-summary-card" key={s.label}>
						<span>{s.label}</span>
						<strong>
							{isPending ? <span className="mini-spinner" /> : s.value}
						</strong>
					</div>
				))}
			</section>

			<section className="admin-panel appointments-page-panel">
				<div className="appointments-toolbar">
					<div className="appointment-search">
						<FiSearch size={15} />
						<input
							type="text"
							placeholder="Search pet, owner, or veterinarian..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="appointment-filters">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option value="all">All Status</option>
							<option value="confirmed">Confirmed</option>
							<option value="pending">Pending</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>

						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
						>
							<option value="today">Today</option>
							<option value="week">Next 7 Days</option>
							<option value="all">All Dates</option>
						</select>
					</div>
				</div>

				<div className="appointments-table-wrapper">
					<table className="appointments-table">
						<thead>
							<tr>
								<th>TIME</th>
								<th>PATIENT</th>
								<th>OWNER</th>
								<th>VETERINARIAN</th>
								<th>SERVICE</th>
								<th>STATUS</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										Loading appointments…
									</td>
								</tr>
							)}

							{rows.map((appointment) => {
								const owner = ownersById[appointment.owner];
								const active =
									appointment.status === "pending" ||
									appointment.status === "confirmed";
								return (
									<tr key={appointment._id}>
										<td>
											<strong>{format12h(appointment.time)}</strong>
											<span className="table-date-sub">
												{new Date(appointment.date).toLocaleDateString(
													"en-US",
													{ month: "short", day: "numeric" },
												)}
											</span>
										</td>

										<td>
											<div className="table-patient">
												<div className="table-patient-avatar">
													{appointment.pet?.species === "cat" ? (
														<PiCat size={18} />
													) : (
														<PiDog size={18} />
													)}
												</div>

												<div>
													<strong>{appointment.pet?.name ?? "Unknown"}</strong>
													<span>
														{appointment.pet?.breed ??
															appointment.pet?.species ??
															"—"}
													</span>
												</div>
											</div>
										</td>

										<td>{owner?.name ?? "—"}</td>

										<td>{appointment.vet ?? "—"}</td>

										<td>{appointment.reason ?? "—"}</td>

										<td>
											<span
												className={`appointment-status ${appointment.status.toLowerCase()}`}
											>
												{appointment.status.charAt(0).toUpperCase() +
													appointment.status.slice(1)}
											</span>
										</td>

										<td className="table-actions">
											{active ? (
												<div className="appointment-action-cell">
													{appointment.status === "pending" && (
														<button
															type="button"
															className="row-action confirm"
															onClick={() => act(appointment, "confirmed")}
														>
															Confirm
														</button>
													)}
													{appointment.status === "confirmed" && (
														<button
															type="button"
															className="row-action complete"
															onClick={() => act(appointment, "completed")}
														>
															Complete
														</button>
													)}
													<button
														type="button"
														className="row-action cancel"
														onClick={() => act(appointment, "cancel")}
													>
														Cancel
													</button>
												</div>
											) : (
												<span className="row-action-muted">—</span>
											)}
										</td>
									</tr>
								);
							})}

							{rows.length === 0 && !isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										No appointments match this filter.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			{showNew && <NewAppointmentModal onClose={() => setShowNew(false)} />}
		</>
	);
}

export default Appointments;
