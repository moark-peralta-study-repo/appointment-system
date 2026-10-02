import {
  RxDashboard,
  RxCalendar,
  RxPeople,
  RxPerson,
} from "react-icons/rx";
import { CiMedicalCase, CiMedicalClipboard, CiSettings } from "react-icons/ci";
import { FaChartBar } from "react-icons/fa";
import logo from "../assets/logo/happy-paws-logo.png";

function AdminSidebar() {
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
          <span className="admin-brand-subtitle">
            Veterinary Clinic
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="admin-navigation">

        <div className="admin-nav-group">
          <p className="admin-nav-title">OVERVIEW</p>

          <a href="/admin" className="admin-nav-link active">
            <span className="admin-nav-icon">
              <RxDashboard />
            </span>
            <span>Dashboard</span>
          </a>
        </div>

        <div className="admin-nav-group">
          <p className="admin-nav-title">CLINIC</p>

          <a href="/admin/appointments" className="admin-nav-link">
            <span className="admin-nav-icon">
              <RxCalendar />
            </span>
            <span>Appointments</span>
          </a>

          <a href="/admin/patients" className="admin-nav-link">
            <span className="admin-nav-icon">
              <RxPeople />
            </span>
            <span>Patients</span>
          </a>

          <a href="/admin/pet-owners" className="admin-nav-link">
            <span className="admin-nav-icon">
              <RxPerson />
            </span>
            <span>Pet Owners</span>
          </a>

          <a href="/admin/veterinarians" className="admin-nav-link">
            <span className="admin-nav-icon">
              <CiMedicalCase />
            </span>
            <span>Veterinarians</span>
          </a>
        </div>

        <div className="admin-nav-group">
          <p className="admin-nav-title">RECORDS</p>

          <a href="/admin/medical-records" className="admin-nav-link">
            <span className="admin-nav-icon">
              <CiMedicalClipboard />
            </span>
            <span>Medical Records</span>
          </a>

          <a href="/admin/reports" className="admin-nav-link">
            <span className="admin-nav-icon">
              <FaChartBar />
            </span>
            <span>Reports</span>
          </a>
        </div>
      </nav>

      {/* BOTTOM */}
      <div className="admin-sidebar-bottom">
        <a href="/admin/settings" className="admin-nav-link">
          <span className="admin-nav-icon">
            <CiSettings />
          </span>
          <span>Settings</span>
        </a>

        <div className="admin-user">
          <div className="admin-user-avatar">A</div>

          <div className="admin-user-details">
            <strong>Admin</strong>
            <span>Clinic Administrator</span>
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