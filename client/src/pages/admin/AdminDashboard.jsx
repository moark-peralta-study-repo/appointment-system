import {
	useAppointments,
	usePets,
	useUsers,
	useStats,
} from "../../hooks/useAdminData";
import { isToday, format12h } from "../../utils/admin";
import DogLoader from "../../components/admin/DogLoader";
import { FaBell, FaClipboardList, FaStethoscope, FaUser } from "react-icons/fa";
import { RxCalendar } from "react-icons/rx";
import { PiCat, PiDog, PiPawPrint } from "react-icons/pi";

function AdminDashboard() {
	const { data: appointments = [], isPending: apptsLoading } =
		useAppointments();
	const { data: pets = [], isPending: petsLoading } = usePets();
	const { data: users = [] } = useUsers();
	const { data: stats, isPending: statsLoading } = useStats();

	const todayList = appointments
		.filter((a) => isToday(a.date))
		.sort((x, y) => (x.time > y.time ? 1 : -1));

	const ownerCount = users.filter((u) => u.role === "user").length;
	const vetCount = users.filter((u) => u.role === "vet").length;

	const statCards = [
		{
			label: "Today's Appointments",
			value: todayList.length,
			sub: `${todayList.filter((a) => a.status === "confirmed").length} confirmed so far`,
			icon: <RxCalendar size={20} />,
		},
		{
			label: "Total Patients",
			value: pets.length,
			sub: "registered pets on file",
			icon: <PiPawPrint size={20} />,
		},
		{
			label: "Pet Owners",
			value: ownerCount,
			sub: "active client accounts",
			icon: <FaUser size={20} />,
		},
		{
			label: "Veterinarians",
			value: vetCount,
			sub: "staffed on the team",
			icon: <FaStethoscope size={20} />,
		},
	];

	// Recent patients = newest pets (createdAt desc).
	const recentPets = [...pets]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 3);

	const loading = apptsLoading || petsLoading || statsLoading;

	return (
		<>
			<header className="admin-header">
				<div>
					<p className="admin-eyebrow">MUTUALS PAWS VETERINARY CLINIC</p>
					<h1>Clinic Dashboard</h1>
					<p className="admin-header-text">
						{loading
							? "Loading today's activity…"
							: `Here's what's happening at the clinic today.`}
					</p>
				</div>

				<div className="admin-header-actions">
					<button
						className="admin-notification"
						type="button"
						aria-label="Notifications"
					>
						<FaBell size={16} />
					</button>
				</div>
			</header>

			{loading ? (
				<div className="admin-loading">
					<DogLoader />
					<p>Loading dashboard…</p>
				</div>
			) : (
				<>
					{/* STATISTICS */}
					<section className="admin-stats">
						{statCards.map((s) => (
							<div className="admin-stat-card" key={s.label}>
								<div className="admin-stat-top">
									<span>{s.label}</span>
									<span className="admin-stat-icon">{s.icon}</span>
								</div>

								<strong>{s.value}</strong>
								<p>{s.sub}</p>
							</div>
						))}
					</section>

					{/* MAIN GRID */}
					<section className="admin-dashboard-grid">
						{/* APPOINTMENTS */}
						<div className="admin-panel appointments-panel">
							<div className="admin-panel-header">
								<div>
									<h2>Today's Appointments</h2>
									<p>{todayList.length} scheduled for today</p>
								</div>

								<a href="/admin/appointments">View all</a>
							</div>

							<div className="appointment-list">
								{todayList.length === 0 && (
									<p className="admin-panel-empty">
										No appointments scheduled today.
									</p>
								)}

								{todayList.slice(0, 5).map((a) => (
									<div className="admin-appointment" key={a._id}>
										<div className="appointment-time">
											<strong>{format12h(a.time)}</strong>
										</div>

										<div className="appointment-pet">
											<div className="appointment-avatar">
												{a.pet?.species === "cat" ? (
													<PiCat size={20} />
												) : (
													<PiDog size={20} />
												)}
											</div>

											<div>
												<strong>{a.pet?.name ?? "Unknown pet"}</strong>
												<span>
													{a.pet?.breed ?? a.pet?.species ?? "—"} • {a.reason}
												</span>
											</div>
										</div>

										<div className="appointment-vet">
											<span>Veterinarian</span>
											<strong>{a.vet ?? "—"}</strong>
										</div>

										<span
											className={`status ${a.status === "confirmed" ? "confirmed" : "pending"}`}
										>
											{a.status.charAt(0).toUpperCase() + a.status.slice(1)}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* QUICK ACTIONS */}
						<div className="admin-panel quick-actions-panel">
							<div className="admin-panel-header">
								<div>
									<h2>Quick Actions</h2>
									<p>Common clinic tasks</p>
								</div>
							</div>

							<div className="quick-actions">
								<button
									type="button"
									onClick={() => (location.href = "/admin/appointments")}
								>
									<span className="quick-ic">
										<RxCalendar size={18} />
									</span>
									<div>
										<strong>Manage Appointments</strong>
										<small>Confirm, complete or cancel visits</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() => (location.href = "/admin/patients")}
								>
									<span className="quick-ic">
										<PiPawPrint size={18} />
									</span>
									<div>
										<strong>Patients</strong>
										<small>Browse the patient register</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() => (location.href = "/admin/medical-records")}
								>
									<span className="quick-ic">
										<FaClipboardList size={18} />
									</span>
									<div>
										<strong>Medical Records</strong>
										<small>Completed visit notes</small>
									</div>
								</button>
							</div>
						</div>
					</section>

					{/* RECENT PATIENTS */}
					<section className="admin-panel recent-patients-panel">
						<div className="admin-panel-header">
							<div>
								<h2>Recent Patients</h2>
								<p>Recently registered pets</p>
							</div>

							<a href="/admin/patients">View all</a>
						</div>

						<div className="recent-patients">
							{recentPets.map((p) => (
								<div className="recent-patient" key={p._id}>
									<div
										className="recent-patient-avatar"
										role="img"
										aria-label={p.name}
									>
										{p.species === "cat" ? (
											<PiCat size={20} />
										) : (
											<PiDog size={20} />
										)}
									</div>

									<div>
										<strong>{p.name}</strong>
										<span>{p.breed ?? p.species ?? "—"}</span>
									</div>

									<small>
										{new Date(p.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</small>
								</div>
							))}
						</div>
					</section>
				</>
			)}
		</>
	);
}

export default AdminDashboard;
