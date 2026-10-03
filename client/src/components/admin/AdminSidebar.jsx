import { NavLink } from "react-router-dom";
import { RxDashboard, RxCalendar, RxPeople, RxPerson } from "react-icons/rx";
import { CiMedicalCase, CiMedicalClipboard, CiSettings } from "react-icons/ci";
import { FaChartBar } from "react-icons/fa";
import logo from "../../assets/logo/happy-paws-logo.png";
import { useAuth } from "../../context/useAuth";

function AdminSidebar() {
	const { user, logout } = useAuth();
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
					<span className="admin-brand-subtitle">Veterinary Clinic</span>
				</div>
			</div>

			{/* NAVIGATION */}
			<nav className="admin-navigation">
				<div className="admin-nav-group">
					<p className="admin-nav-title">OVERVIEW</p>

					<NavLink to="/admin" end className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxDashboard />
						</span>
						<span>Dashboard</span>
					</NavLink>
				</div>

				<div className="admin-nav-group">
					<p className="admin-nav-title">CLINIC</p>

					<NavLink to="/admin/appointments" className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxCalendar />
						</span>
						<span>Appointments</span>
					</NavLink>

					<NavLink to="/admin/patients" className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxPeople />
						</span>
						<span>Patients</span>
					</NavLink>

					<NavLink to="/admin/pet-owners" className="admin-nav-link">
						<span className="admin-nav-icon">
							<RxPerson />
						</span>
						<span>Pet Owners</span>
					</NavLink>

					<NavLink to="/admin/veterinarians" className="admin-nav-link">
						<span className="admin-nav-icon">
							<CiMedicalCase />
						</span>
						<span>Veterinarians</span>
					</NavLink>
				</div>

				<div className="admin-nav-group">
					<p className="admin-nav-title">RECORDS</p>

					<NavLink to="/admin/medical-records" className="admin-nav-link">
						<span className="admin-nav-icon">
							<CiMedicalClipboard />
						</span>
						<span>Medical Records</span>
					</NavLink>

					<NavLink to="/admin/reports" className="admin-nav-link">
						<span className="admin-nav-icon">
							<FaChartBar />
						</span>
						<span>Reports</span>
					</NavLink>
				</div>
			</nav>

			{/* BOTTOM */}
			<div className="admin-sidebar-bottom">
				<NavLink to="/admin/settings" className="admin-nav-link">
					<span className="admin-nav-icon">
						<CiSettings />
					</span>
					<span>Settings</span>
				</NavLink>

				<div
					className="admin-user"
					onClick={() => {
						logout();
						navigate("/admin/login");
					}}
					title="Click to sign out"
				>
					<div className="admin-user-avatar">
						{user?.name?.[0]?.toUpperCase() || "?"}
					</div>

					<div className="admin-user-details">
						<strong>{user?.name || "Staff"}</strong>
						<span>
							{user?.role === "vet" ? "Veterinarian" : "Clinic Administrator"}
						</span>
					</div>

					<button className="admin-user-menu" type="button">
						•••
					</button>
				</div>
			</div>
		</aside>
	);
}

export default AdminSidebar;
