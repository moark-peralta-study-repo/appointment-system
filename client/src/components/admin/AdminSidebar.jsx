import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard, RxCalendar, RxPeople, RxPerson } from "react-icons/rx";
import {
	CiMedicalCase,
	CiMedicalClipboard,
	CiSettings,
	CiUser,
} from "react-icons/ci";
import { FaChartBar, FaSignOutAlt, FaStream, FaUserCog } from "react-icons/fa";
import logo from "../../assets/logo/pink-paws-full.png";
import { useAuth } from "../../context/useAuth";
import { isClinical, isManager } from "../../utils/roles";

function AdminSidebar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	// Close on outside click / Esc
	useEffect(() => {
		if (!menuOpen) return;
		const onClick = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target))
				setMenuOpen(false);
		};
		const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
		document.addEventListener("mousedown", onClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [menuOpen]);

	const go = (path) => {
		setMenuOpen(false);
		navigate(path);
	};

	// Role-scoped nav. All portal roles share the operational pages
	// (appointments / patients / pet owners). Clinical pages are vet +
	// admin only; roster management is the owner's job.
	const clinical = isClinical(user?.role);
	const manager = isManager(user?.role);

	return (
		<aside className="admin-sidebar">
			{/* BRAND */}
			<div className="admin-brand">
				<img
					src={logo}
					alt="Pink Paws Veterinary Clinic"
					className="admin-brand-logo"
				/>

				<div className="admin-brand-text">
					<span className="admin-brand-name">Pink Paws</span>
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

					{manager && (
						<NavLink to="/admin/veterinarians" className="admin-nav-link">
							<span className="admin-nav-icon">
								<CiMedicalCase />
							</span>
							<span>Veterinarians</span>
						</NavLink>
					)}

					{manager && (
						<NavLink to="/admin/staff" className="admin-nav-link">
							<span className="admin-nav-icon">
								<FaUserCog />
							</span>
							<span>Staff</span>
						</NavLink>
					)}
				</div>

				{clinical && (
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
				)}

				{/* ACTIVITY — all portal roles (vet/staff/admin) */}
				<div className="admin-nav-group">
					<p className="admin-nav-title">ACTIVITY</p>
						<NavLink to="/admin/activity" className="admin-nav-link">
							<span className="admin-nav-icon">
								<FaStream />
							</span>
							<span>Activity</span>
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

				<div className="admin-user" ref={menuRef}>
					<div className="admin-user-avatar">
						{user?.name?.[0]?.toUpperCase() || "?"}
					</div>

					<div className="admin-user-details">
						<strong>{user?.name || "Staff"}</strong>
						<span>
							{user?.role === "vet"
								? "Veterinarian"
								: user?.role === "staff"
									? "Clinic Staff"
									: "Clinic Administrator"}
						</span>
					</div>

					<div className="admin-user-menu-wrap">
						<button
							className="admin-user-menu"
							type="button"
							aria-label="Account menu"
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((o) => !o)}
						>
							•••
						</button>

						{menuOpen && (
							<div className="admin-user-dropdown" role="menu">
								<button
									role="menuitem"
									type="button"
									onClick={() => go("/admin/settings")}
								>
									<CiUser />
									<span>My Profile</span>
								</button>
								<button
									role="menuitem"
									type="button"
									onClick={() => go("/admin/settings?focus=schedule")}
								>
									<RxCalendar />
									<span>My Schedule</span>
								</button>
								<div className="admin-user-dropdown-divider" role="separator" />
								<button
									role="menuitem"
									type="button"
									className="danger"
									onClick={() => {
										setMenuOpen(false);
										// Clear the token; the route guard on /admin then
										// bounces to the login page (we don't navigate
										// here — calling both races the guard's redirect).
										logout();
									}}
								>
									<FaSignOutAlt />
									<span>Sign Out</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</aside>
	);
}

export default AdminSidebar;
