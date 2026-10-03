import { useState } from "react";

import mochi from "../assets/images/pets/mochi.jpeg";
import luna from "../assets/images/pets/luna.jpeg";
import { PiBellSimple, PiPawPrint } from "react-icons/pi";
import { GrHomeRounded } from "react-icons/gr";
import { CiCalendarDate, CiFileOn, CiUser } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

function Dashboard() {
	const [activePage, setActivePage] = useState("Dashboard");
	const [showNotifications, setShowNotifications] = useState(false);

	const navigation = [
		{ name: "Dashboard", icon: <GrHomeRounded /> },
		{ name: "My Pets", icon: <PiPawPrint /> },
		{ name: "Appointments", icon: <CiCalendarDate /> },
		{ name: "Medical Records", icon: <CiFileOn /> },
		{ name: "Profile", icon: <CiUser /> },
	];

	return (
		<div className="client-app">
			{/* SIDEBAR */}
			<aside className="client-sidebar">
				<div className="brand">
					<div className="brand-icon">
						<PiPawPrint />
					</div>

					<div>
						<h2>Happy Paws</h2>
						<span>Veterinary Clinic</span>
					</div>
				</div>

				<nav className="client-navigation">
					<p className="nav-label">MENU</p>

					{navigation.map((item) => (
						<button
							key={item.name}
							className={`nav-item ${activePage === item.name ? "active" : ""}`}
							onClick={() => setActivePage(item.name)}
						>
							<span className="nav-icon">{item.icon}</span>
							<span>{item.name}</span>
						</button>
					))}
				</nav>

				<div className="sidebar-help">
					<div className="help-icon">?</div>

					<div>
						<strong>Need help?</strong>
						<span>Contact our clinic</span>
					</div>
				</div>

				<div className="sidebar-user">
					<div className="user-avatar">JC</div>

					<div>
						<strong>Jamie Cruz</strong>
						<span>Pet Owner</span>
					</div>
				</div>
			</aside>

			{/* MAIN CONTENT */}
			<main className="client-main">
				{/* TOP BAR */}
				<header className="client-topbar">
					<div className="mobile-brand">
						<strong>Happy Paws</strong>
					</div>

					<div className="topbar-actions">
						<button
							className="client-notification"
							onClick={() => setShowNotifications(!showNotifications)}
							aria-label="Notifications"
						>
							<PiBellSimple />
							<span></span>
						</button>

						<div className="profile-mini">
							<div className="user-avatar">JC</div>

							<div>
								<strong>Jamie Cruz</strong>
								<span>Pet Owner</span>
							</div>
						</div>
					</div>

					{showNotifications && (
						<div className="client-notifications">
							<div className="notification-title">
								<strong>Notifications</strong>
								<span>2 new</span>
							</div>

							<div className="client-notification-item">
								<div className="notification-dot"></div>

								<div>
									<strong>Appointment reminder</strong>
									<span>Mochi · Tomorrow at 9:00 AM</span>
								</div>
							</div>

							<div className="client-notification-item">
								<div className="notification-dot"></div>

								<div>
									<strong>Vaccination reminder</strong>
									<span>Luna · Due this week</span>
								</div>
							</div>
						</div>
					)}
				</header>

				<div className="client-content">
					{/* WELCOME */}
					<section className="client-welcome">
						<div>
							<p className="client-eyebrow">SUNDAY, SEPTEMBER 27, 2026</p>

							<h1>
								Good evening, Jamie! <span>🐾</span>
							</h1>

							<p>Welcome back! Here's what's happening with your pets today.</p>
						</div>

						<button className="book-button">
							<span>
								<IoAdd />
							</span>
							Book an appointment
						</button>
					</section>

					{/* PETS */}
					<section>
						<div className="section-title">
							<div>
								<p className="client-eyebrow">YOUR PETS</p>
								<h2>My furry friends</h2>
							</div>

							<button className="text-button">
								View all <FaArrowRight />
							</button>
						</div>

						<div className="pet-cards">
							<div className="pet-card">
								<img src={mochi} alt="Mochi" />

								<div className="pet-card-info">
									<div>
										<h3>Mochi</h3>
										<p>Golden Retriever · 3 yrs</p>
									</div>

									<span className="health-chip">Healthy</span>
								</div>

								<div className="pet-card-bottom">
									<span>Last visit</span>
									<strong>Sep 12, 2026</strong>
								</div>
							</div>

							<div className="pet-card">
								<img src={luna} alt="Luna" />

								<div className="pet-card-info">
									<div>
										<h3>Luna</h3>
										<p>Persian Cat · 2 yrs</p>
									</div>

									<span className="health-chip">Healthy</span>
								</div>

								<div className="pet-card-bottom">
									<span>Last visit</span>
									<strong>Aug 28, 2026</strong>
								</div>
							</div>

							<button className="add-pet-card">
								<div className="add-pet-icon">＋</div>

								<strong>Add a pet</strong>
								<span>Register another furry friend</span>
							</button>
						</div>
					</section>

					{/* APPOINTMENT + QUICK ACTIONS */}
					<section className="client-main-grid">
						<div className="next-appointment">
							<div className="section-title">
								<div>
									<p className="client-eyebrow">NEXT APPOINTMENT</p>

									<h2>Upcoming visit</h2>
								</div>

								<span className="confirmed-chip">Confirmed</span>
							</div>

							<div className="appointment-highlight">
								<div className="appointment-date">
									<span>OCT</span>
									<strong>02</strong>
									<small>FRI</small>
								</div>

								<div className="appointment-details">
									<div className="appointment-pet">
										<img src={mochi} alt="Mochi" />

										<div>
											<h3>Mochi</h3>
											<span>Golden Retriever</span>
										</div>
									</div>

									<div className="appointment-info">
										<div>
											<CiCalendarDate />
											<span>09:00 AM</span>
										</div>

										<div>
											<PiPawPrint />
											<span>General Check-up</span>
										</div>

										<div>
											<span className="doctor-icon">DR</span>
											<span>Dr. Santos</span>
										</div>
									</div>
								</div>
							</div>

							<button className="appointment-link">
								View appointment details
								<FaArrowRight />
							</button>
						</div>

						{/* QUICK ACTIONS */}
						<div className="quick-actions-card">
							<div className="section-title">
								<div>
									<p className="client-eyebrow">SHORTCUTS</p>
									<h2>Quick actions</h2>
								</div>
							</div>

							<button className="client-action">
								<span className="action-icon blue-action">
									<CiCalendarDate />
								</span>

								<span>
									<strong>Book appointment</strong>
									<small>Schedule a clinic visit</small>
								</span>

								<FaArrowRight />
							</button>

							<button className="client-action">
								<span className="action-icon yellow-action">
									<PiPawPrint />
								</span>

								<span>
									<strong>Manage my pets</strong>
									<small>View your pet profiles</small>
								</span>

								<FaArrowRight />
							</button>

							<button className="client-action">
								<span className="action-icon green-action">
									<CiFileOn />
								</span>

								<span>
									<strong>Medical records</strong>
									<small>View health history</small>
								</span>

								<FaArrowRight />
							</button>
						</div>
					</section>

					{/* HEALTH REMINDER */}
					<section className="health-reminder">
						<div className="reminder-icon">
							<PiPawPrint />
						</div>

						<div>
							<p className="client-eyebrow">PET HEALTH REMINDER</p>

							<h3>Luna's vaccination is coming up!</h3>

							<p>
								Luna is due for her next vaccination this month. Keep her
								protected and healthy.
							</p>
						</div>

						<button>
							Schedule visit <FaArrowRight />
						</button>
					</section>

					<footer className="client-footer">
						<span>Happy Paws Veterinary Clinic</span>
						<span>Care for every paw, every day. 🐾</span>
					</footer>
				</div>
			</main>
		</div>
	);
}

export default Dashboard;
