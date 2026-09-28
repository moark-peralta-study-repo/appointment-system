import { RxDashboard, RxPeople, RxPerson } from "react-icons/rx";
import logo from "../assets/logo/happy-paws-logo.png";
import { FaRegClock } from "react-icons/fa";
import { CiMedicalCase, CiMedicalClipboard } from "react-icons/ci";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          src={logo}
          alt="Mutuals Paws Veterinary Clinic"
          className="brand-logo"
        />

        <div className="brand-text">
          <span className="brand-name">Mutuals Paws</span>
          <span className="brand-subtitle">Veterinary Clinic</span>
        </div>
      </div>

      <nav className="sidebar-navigation">
        <div className="nav-group">
          <p className="nav-title">OVERVIEW</p>

          <a href="#" className="nav-link active">
            <span className="nav-icon">
              <RxDashboard />
            </span>
            <span>Dashboard</span>
          </a>
        </div>

        <div className="nav-group">
          <p className="nav-title">CLINIC</p>

          <a href="#" className="nav-link">
            <span className="nav-icon">
              <FaRegClock />
            </span>
            <span>Appointments</span>
          </a>

          <a href="#" className="nav-link">
            <span className="nav-icon">
              <RxPeople />
            </span>
            <span>Patients</span>
          </a>

          <a href="#" className="nav-link">
            <span className="nav-icon">
              <RxPerson />
            </span>
            <span>Pet Owners</span>
          </a>

          <a href="#" className="nav-link">
            <span className="nav-icon">
              <CiMedicalCase />
            </span>
            <span>Veterinarians</span>
          </a>
        </div>

        <div className="nav-group">
          <p className="nav-title">RECORDS</p>

          <a href="#" className="nav-link">
            <span className="nav-icon">
              <CiMedicalClipboard />
            </span>
            <span>Medical Records</span>
          </a>

          <a href="#" className="nav-link">
            <span className="nav-icon">▥</span>
            <span>Reports</span>
          </a>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <a href="#" className="nav-link settings-link">
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </a>

        <div className="clinic-user">
          <div className="user-avatar">A</div>

          <div className="user-details">
            <strong>Admin</strong>
            <span>Clinic Administrator</span>
          </div>

          <button className="user-menu" type="button">
            •••
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;