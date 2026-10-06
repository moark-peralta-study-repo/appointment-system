import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard, RxCalendar, RxPerson } from "react-icons/rx";
import { CiMedicalClipboard, CiSettings } from "react-icons/ci";
import logo from "../../assets/logo/happy-paws-logo.png";
import { useAuth } from "../../context/useAuth";

// Pet owner sidebar. Mirrors the AdminSidebar structure 1:1 — same
// classes (admin-sidebar, admin-brand, admin-nav-*, admin-user) so the
// client portal renders with the exact admin chrome and only the nav
// items differ.
function ClientSidebar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/client/login");
	};

	return (
		<aside className="admin-sidebar">
			{/* BRAND */}
			<div className="admin-brand">
				<img
					src={logo}
					alt="Mutuals Paws Veterinary Clinic"
					className="admin-brand-logo"
				/>

				<div className="admin-brand-text">
					<span className="admin-brand-name">Mutuals Paws</span>
					<span className="admin-brand-subtitle">Pet Owner Portal</span>
				</div>
			</div>

			{/* NAVIGATION */}
			<nav className="admin-navigation">
				<div className="admin-nav-group">
					<p className="admin-nav-title">OVERVIEW</p>

					<NavLink to="/client/dashboard" end className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxDashboard />
						</span>
						<span>Dashboard</span>
					</NavLink>
				</div>

				<div className="admin-nav-group">
					<p className="admin-nav-title">MY PETS</p>

					<NavLink to="/client/appointments" className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxCalendar />
						</span>
						<span>Appointments</span>
					</NavLink>

					<NavLink to="/client/medical-records" className="admin-nav-link">
						<span className="admin-nav-icon">
							<CiMedicalClipboard />
						</span>
						<span>Medical Records</span>
					</NavLink>
				</div>
			</nav>

			{/* BOTTOM */}
			<div className="admin-sidebar-bottom">
				<NavLink to="/client/profile" className="admin-nav-link">
					<span className="admin-nav-icon">
						<RxPerson />
					</span>
					<span>Profile</span>
				</NavLink>

				<NavLink to="/client/settings" className="admin-nav-link">
					<span className="admin-nav-icon">
						<CiSettings />
					</span>
					<span>Settings</span>
				</NavLink>

				<div
					className="admin-user"
					onClick={handleLogout}
					title="Click to sign out"
				>
					<div className="admin-user-avatar">
						{user?.name?.[0]?.toUpperCase() || "?"}
					</div>

					<div className="admin-user-details">
						<strong>{user?.name || "Pet Owner"}</strong>
						<span>Client Account</span>
					</div>

					<button className="admin-user-menu" type="button">
						•••
					</button>
				</div>
			</div>
		</aside>
	);
}

export default ClientSidebar;
