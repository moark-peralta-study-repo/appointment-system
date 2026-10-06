import { useNavigate } from "react-router-dom";
import { useMyPets, useMyAppointments } from "../../hooks/useClientData";
import { isToday, isWithinDays, format12h, formatDate } from "../../utils/admin";
import { useAuth } from "../../context/useAuth";
import ClientHeader from "../../components/client/ClientHeader";
import DogLoader from "../../components/admin/DogLoader";

function ClientDashboard() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { data: pets = [], isPending: petsLoading } = useMyPets();
	const { data: appointments = [], isPending: apptsLoading } = useMyAppointments();

	// Upcoming = not completed/cancelled, within 14 days, sorted by date+time.
	const upcoming = appointments
		.filter((a) => a.status !== "completed" && a.status !== "cancelled")
		.filter((a) => isWithinDays(a.date, 14))
		.sort((x, y) => `${x.date} ${x.time}` > `${y.date} ${y.time}` ? 1 : -1);

	const todayList = upcoming.filter((a) => isToday(a.date));
	const nextAppt = upcoming[0] ?? null;

	const statCards = [
		{
			label: "Upcoming Appointments",
			value: upcoming.length,
			sub: "next two weeks",
			icon: "📅",
		},
		{
			label: "Today's Appointments",
			value: todayList.length,
			sub: todayList.length ? "see below for details" : "nothing scheduled today",
			icon: "⏰",
		},
		{
			label: "My Pets",
			value: pets.length,
			sub: "registered with the clinic",
			icon: "🐾",
		},
		{
			label: "Completed Visits",
			value: appointments.filter((a) => a.status === "completed").length,
			sub: "health records on file",
			icon: "📋",
		},
	];

	const loading = petsLoading || apptsLoading;
	const firstName = (user?.name ?? "").split(" ")[0] || "there";

	return (
		<>
			<ClientHeader
				title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${firstName}`}
				subtitle="Here's what's happening with your pets."
				actions={
					<>
						<button className="admin-notification" type="button" title="Notifications coming soon">🔔</button>
						<button
							className="admin-primary-button"
							type="button"
							onClick={() => navigate("/book-appointment")}
						>
							+ Book an appointment
						</button>
					</>
				}
			/>

			{loading ? (
				<div className="admin-loading" style={{ minHeight: "60vh" }}>
					<DogLoader />
					<p>Loading your dashboard…</p>
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

					{/* MAIN GRID: NEXT APPOINTMENT + MY PETS */}
					<section className="admin-dashboard-grid">
						{/* NEXT APPOINTMENT */}
						<div className="admin-panel">
							<div className="admin-panel-header">
								<div>
									<h2>Next Appointment</h2>
									<p>
										{nextAppt
											? `${formatDate(nextAppt.date)} • ${format12h(nextAppt.time)}`
											: "Nothing scheduled in the next two weeks"}
									</p>
								</div>
							</div>

							{!nextAppt ? (
								<p className="admin-panel-empty">
									No upcoming visits. Book one when your pet is due.
								</p>
							) : (
								<div className="appointment-list">
									<div className="admin-appointment">
										<div className="appointment-time">
											<strong>{format12h(nextAppt.time)}</strong>
											<span>{formatDate(nextAppt.date)}</span>
										</div>

										<div className="appointment-pet">
											<div className="appointment-avatar">
												{nextAppt.pet?.species === "cat" ? "🐱" : "🐶"}
											</div>

											<div>
												<strong>{nextAppt.pet?.name ?? "Unknown pet"}</strong>
												<span>
													{nextAppt.pet?.breed ?? nextAppt.pet?.species ?? "—"} • {nextAppt.reason}
												</span>
											</div>
										</div>

										<div className="appointment-vet">
											<span>Veterinarian</span>
											<strong>{nextAppt.vet ?? "—"}</strong>
										</div>

										<span
											className={`status ${nextAppt.status === "confirmed" ? "confirmed" : "pending"}`}
										>
											{nextAppt.status.charAt(0).toUpperCase() + nextAppt.status.slice(1)}
										</span>
									</div>
								</div>
							)}
						</div>

						{/* QUICK ACTIONS */}
						<div className="admin-panel quick-actions-panel">
							<div className="admin-panel-header">
								<div>
									<h2>Quick Actions</h2>
									<p>Manage your visits</p>
								</div>
							</div>

							<div className="quick-actions">
								<button
									type="button"
									onClick={() => navigate("/book-appointment")}
								>
									<span>📅</span>
									<div>
										<strong>Book appointment</strong>
										<small>Schedule a clinic visit</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() => navigate("/client/appointments")}
								>
									<span>🗓️</span>
									<div>
										<strong>My appointments</strong>
										<small>View or cancel upcoming visits</small>
									</div>
								</button>

								<button
									type="button"
									onClick={() => navigate("/client/medical-records")}
								>
									<span>📋</span>
									<div>
										<strong>Medical records</strong>
										<small>Completed visit notes</small>
									</div>
								</button>
							</div>
						</div>
					</section>

					{/* MY PETS */}
					<section className="admin-panel">
						<div className="admin-panel-header">
							<div>
								<h2>My Pets</h2>
								<p>{pets.length} registered pet{pets.length === 1 ? "" : "s"}</p>
							</div>
						</div>

						{pets.length === 0 ? (
							<p className="admin-panel-empty">
								No pets yet — add your first furry friend to book a visit.
							</p>
						) : (
							<div className="recent-patients">
								{pets.slice(0, 3).map((p) => (
									<div className="recent-patient" key={p._id}>
										<div className="recent-patient-avatar" role="img" aria-label={p.name}>
											{p.species === "cat" ? "🐱" : "🐶"}
										</div>

										<div>
											<strong>{p.name}</strong>
											<span>{p.breed ?? p.species ?? "—"}</span>
										</div>

										<small>{p.age} yr{p.age === 1 ? "" : "s"}</small>
									</div>
								))}
							</div>
						)}
					</section>
				</>
			)}
		</>
	);
}

export default ClientDashboard;
