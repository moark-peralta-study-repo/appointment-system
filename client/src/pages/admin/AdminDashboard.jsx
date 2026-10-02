import AdminSidebar from "../../components/AdminSidebar";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">MUTUALS PAWS VETERINARY CLINIC</p>
            <h1>Good morning, Admin!</h1>
            <p className="admin-header-text">
              Here's what's happening at the clinic today.
            </p>
          </div>

          <div className="admin-header-actions">
            <button className="admin-notification" type="button">
              🔔
            </button>

            <div className="admin-profile">
              <div className="admin-profile-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <span>Clinic Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Today's Appointments</span>
              <span className="admin-stat-icon">📅</span>
            </div>

            <strong>24</strong>
            <p>8 remaining today</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Patients</span>
              <span className="admin-stat-icon">🐾</span>
            </div>

            <strong>186</strong>
            <p>12 added this month</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Pet Owners</span>
              <span className="admin-stat-icon">👤</span>
            </div>

            <strong>142</strong>
            <p>6 new this month</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Veterinarians</span>
              <span className="admin-stat-icon">🩺</span>
            </div>

            <strong>12</strong>
            <p>8 currently available</p>
          </div>

        </section>

        {/* MAIN GRID */}
        <section className="admin-dashboard-grid">

          {/* APPOINTMENTS */}
          <div className="admin-panel appointments-panel">

            <div className="admin-panel-header">
              <div>
                <h2>Today's Appointments</h2>
                <p>Upcoming appointments for today</p>
              </div>

              <a href="/admin/appointments">
                View all
              </a>
            </div>

            <div className="appointment-list">

              <div className="admin-appointment">
                <div className="appointment-time">
                  <strong>09:00</strong>
                  <span>AM</span>
                </div>

                <div className="appointment-pet">
                  <div className="appointment-avatar">🐶</div>

                  <div>
                    <strong>Mochi</strong>
                    <span>Golden Retriever • Check-up</span>
                  </div>
                </div>

                <div className="appointment-vet">
                  <span>Veterinarian</span>
                  <strong>Dr. Evelyn Dane</strong>
                </div>

                <span className="status confirmed">
                  Confirmed
                </span>
              </div>

              <div className="admin-appointment">
                <div className="appointment-time">
                  <strong>10:30</strong>
                  <span>AM</span>
                </div>

                <div className="appointment-pet">
                  <div className="appointment-avatar">🐱</div>

                  <div>
                    <strong>Luna</strong>
                    <span>Persian • Vaccination</span>
                  </div>
                </div>

                <div className="appointment-vet">
                  <span>Veterinarian</span>
                  <strong>Dr. Alex Mercer</strong>
                </div>

                <span className="status pending">
                  Pending
                </span>
              </div>

              <div className="admin-appointment">
                <div className="appointment-time">
                  <strong>11:00</strong>
                  <span>AM</span>
                </div>

                <div className="appointment-pet">
                  <div className="appointment-avatar">🐶</div>

                  <div>
                    <strong>Bruno</strong>
                    <span>Labrador • Consultation</span>
                  </div>
                </div>

                <div className="appointment-vet">
                  <span>Veterinarian</span>
                  <strong>Dr. Elena Rostova</strong>
                </div>

                <span className="status confirmed">
                  Confirmed
                </span>
              </div>

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

              <button type="button">
                <span>📅</span>
                <div>
                  <strong>New Appointment</strong>
                  <small>Schedule a visit</small>
                </div>
              </button>

              <button type="button">
                <span>🐾</span>
                <div>
                  <strong>Add Patient</strong>
                  <small>Register a new pet</small>
                </div>
              </button>

              <button type="button">
                <span>📋</span>
                <div>
                  <strong>Medical Record</strong>
                  <small>Create a new record</small>
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

            <a href="/admin/patients">
              View all
            </a>
          </div>

          <div className="recent-patients">

            <div className="recent-patient">
              <img
                src="/src/assets/images/pets/mochi.jpeg"
                alt="Mochi"
              />

              <div>
                <strong>Mochi</strong>
                <span>Golden Retriever</span>
              </div>

              <small>Today</small>
            </div>

            <div className="recent-patient">
              <img
                src="/src/assets/images/pets/luna.jpeg"
                alt="Luna"
              />

              <div>
                <strong>Luna</strong>
                <span>Persian Cat</span>
              </div>

              <small>Yesterday</small>
            </div>

            <div className="recent-patient">
              <img
                src="/src/assets/images/pets/bruno.jpeg"
                alt="Bruno"
              />

              <div>
                <strong>Bruno</strong>
                <span>Labrador</span>
              </div>

              <small>2 days ago</small>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;