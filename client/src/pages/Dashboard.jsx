
import Sidebar from "../components/Sidebar";
import logoSecondary from "../assets/logo/happy-paws-logo-2.png";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
            <button className="notification-button" type="button">
              <span className="notification-icon">♢</span>
              <span className="notification-dot"></span>
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-container">
          <section className="page-header">
            <div>
              <p className="date-label">
                SUNDAY, SEPTEMBER 27, 2026
              </p>

              <h1>Good evening, Admin.</h1>

              <p className="page-description">
                Here's what's happening at Mutuals Paws today.
              </p>
            </div>

            <button
              className="new-appointment-button"
              type="button"
            >
              <span>＋</span>
              New Appointment
            </button>
          </section>

          <section className="overview-grid">
            <div className="appointments-card dashboard-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">TODAY</p>
                  <h2>Appointments</h2>
                </div>

                <a href="#" className="view-link">
                  View all →
                </a>
              </div>

              <div className="appointment-list">
                <div className="appointment-item">
                  <div className="appointment-time">
                    <strong>09:00</strong>
                    <span>AM</span>
                  </div>

                  <div className="appointment-pet">
                    <div className="pet-avatar dog-avatar">M</div>

                    <div>
                      <strong>Mochi</strong>
                      <span>Golden Retriever · 3 yrs</span>
                    </div>
                  </div>

                  <div className="appointment-service">
                    <strong>General Check-up</strong>
                    <span>Dr. Santos</span>
                  </div>

                  <span className="status status-confirmed">
                    Confirmed
                  </span>
                </div>

                <div className="appointment-item">
                  <div className="appointment-time">
                    <strong>10:30</strong>
                    <span>AM</span>
                  </div>

                  <div className="appointment-pet">
                    <div className="pet-avatar cat-avatar">L</div>

                    <div>
                      <strong>Luna</strong>
                      <span>Persian Cat · 2 yrs</span>
                    </div>
                  </div>

                  <div className="appointment-service">
                    <strong>Vaccination</strong>
                    <span>Dr. Reyes</span>
                  </div>

                  <span className="status status-upcoming">
                    Upcoming
                  </span>
                </div>

                <div className="appointment-item">
                  <div className="appointment-time">
                    <strong>01:00</strong>
                    <span>PM</span>
                  </div>

                  <div className="appointment-pet">
                    <div className="pet-avatar brown-avatar">B</div>

                    <div>
                      <strong>Bruno</strong>
                      <span>Shih Tzu · 5 yrs</span>
                    </div>
                  </div>

                  <div className="appointment-service">
                    <strong>Dental Cleaning</strong>
                    <span>Dr. Santos</span>
                  </div>

                  <span className="status status-pending">
                    Pending
                  </span>
                </div>

                <div className="appointment-item">
                  <div className="appointment-time">
                    <strong>03:30</strong>
                    <span>PM</span>
                  </div>

                  <div className="appointment-pet">
                    <div className="pet-avatar cream-avatar">C</div>

                    <div>
                      <strong>Cookie</strong>
                      <span>Beagle · 1 yr</span>
                    </div>
                  </div>

                  <div className="appointment-service">
                    <strong>Follow-up</strong>
                    <span>Dr. Reyes</span>
                  </div>

                  <span className="status status-confirmed">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            <aside className="clinic-overview dashboard-card">
              <div className="clinic-logo-wrapper">
                <img
                  src={logoSecondary}
                  alt="Mutuals Paws"
                  className="dashboard-logo"
                />
              </div>

              <p className="eyebrow">CLINIC OVERVIEW</p>
              <h2>Today's activity</h2>

              <div className="clinic-stat-list">
                <div className="clinic-stat">
                  <div>
                    <span>Appointments</span>
                    <strong>12</strong>
                  </div>

                  <span className="stat-mini-icon blue-icon">
                    01
                  </span>
                </div>

                <div className="clinic-stat">
                  <div>
                    <span>Registered Patients</span>
                    <strong>86</strong>
                  </div>

                  <span className="stat-mini-icon yellow-icon">
                    02
                  </span>
                </div>

                <div className="clinic-stat">
                  <div>
                    <span>Veterinarians</span>
                    <strong>4</strong>
                  </div>

                  <span className="stat-mini-icon green-icon">
                    03
                  </span>
                </div>
              </div>

              <div className="daily-progress">
                <div className="progress-header">
                  <span>Appointments completed</span>
                  <strong>7 / 12</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: "58%" }}
                  ></div>
                </div>

                <p>5 appointments remaining today</p>
              </div>
            </aside>
          </section>

          <section className="quick-actions-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SHORTCUTS</p>
                <h2>Quick actions</h2>
              </div>
            </div>

            <div className="quick-actions">
              <button className="quick-action" type="button">
                <span className="quick-action-icon blue-action">
                  ＋
                </span>

                <span>
                  <strong>New appointment</strong>
                  <small>Schedule a visit</small>
                </span>

                <span className="action-arrow">→</span>
              </button>

              <button className="quick-action" type="button">
                <span className="quick-action-icon yellow-action">
                  +
                </span>

                <span>
                  <strong>Add patient</strong>
                  <small>Register a new pet</small>
                </span>

                <span className="action-arrow">→</span>
              </button>

              <button className="quick-action" type="button">
                <span className="quick-action-icon green-action">
                  □
                </span>

                <span>
                  <strong>Medical records</strong>
                  <small>View patient records</small>
                </span>

                <span className="action-arrow">→</span>
              </button>
            </div>
          </section>

          <section className="lower-grid">
            <div className="recent-patients dashboard-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">PATIENTS</p>
                  <h2>Recent patients</h2>
                </div>

                <a href="#" className="view-link">
                  View all →
                </a>
              </div>

              <div className="patient-table">
                <div className="table-head">
                  <span>Patient</span>
                  <span>Owner</span>
                  <span>Last visit</span>
                  <span>Status</span>
                </div>

                <div className="patient-row">
                  <div className="patient-name">
                    <div className="small-pet-avatar">M</div>

                    <div>
                      <strong>Milo</strong>
                      <span>Shih Tzu</span>
                    </div>
                  </div>

                  <span>Jamie Cruz</span>
                  <span>Sep 26, 2026</span>

                  <span className="table-status active-status">
                    Active
                  </span>
                </div>

                <div className="patient-row">
                  <div className="patient-name">
                    <div className="small-pet-avatar">N</div>

                    <div>
                      <strong>Nala</strong>
                      <span>Domestic Cat</span>
                    </div>
                  </div>

                  <span>Sofia Tan</span>
                  <span>Sep 25, 2026</span>

                  <span className="table-status active-status">
                    Active
                  </span>
                </div>

                <div className="patient-row">
                  <div className="patient-name">
                    <div className="small-pet-avatar">M</div>

                    <div>
                      <strong>Max</strong>
                      <span>Labrador</span>
                    </div>
                  </div>

                  <span>Daniel Reyes</span>
                  <span>Sep 24, 2026</span>

                  <span className="table-status followup-status">
                    Follow-up
                  </span>
                </div>
              </div>
            </div>

            <div className="staff-card dashboard-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">STAFF</p>
                  <h2>Veterinarians</h2>
                </div>

                <a href="#" className="view-link">
                  Manage →
                </a>
              </div>

              <div className="vet-list">
                <div className="vet-item">
                  <div className="vet-avatar">JS</div>

                  <div>
                    <strong>Dr. Santos</strong>
                    <span>General Practice</span>
                  </div>

                  <span className="on-duty">
                    <i></i>
                    On duty
                  </span>
                </div>

                <div className="vet-item">
                  <div className="vet-avatar">AR</div>

                  <div>
                    <strong>Dr. Reyes</strong>
                    <span>Internal Medicine</span>
                  </div>

                  <span className="on-duty">
                    <i></i>
                    On duty
                  </span>
                </div>

                <div className="vet-item">
                  <div className="vet-avatar">MC</div>

                  <div>
                    <strong>Dr. Cruz</strong>
                    <span>Surgery</span>
                  </div>

                  <span className="off-duty">
                    Off duty
                  </span>
                </div>
              </div>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>Mutuals Paws Veterinary Clinic</span>
            <span>Clinic Management System</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
