
import AdminSidebar from "../../components/AdminSidebar";

function Appointments() {
  const appointments = [
    {
      time: "09:00 AM",
      pet: "Mochi",
      type: "Golden Retriever",
      owner: "Maria Lopez",
      vet: "Dr. Evelyn Dane",
      service: "General Check-up",
      status: "Confirmed",
    },
    {
      time: "10:30 AM",
      pet: "Luna",
      type: "Persian Cat",
      owner: "James Reyes",
      vet: "Dr. Alex Mercer",
      service: "Vaccination",
      status: "Pending",
    },
    {
      time: "11:00 AM",
      pet: "Bruno",
      type: "Labrador",
      owner: "Sofia Cruz",
      vet: "Dr. Elena Rostova",
      service: "Consultation",
      status: "Confirmed",
    },
    {
      time: "01:30 PM",
      pet: "Cookie",
      type: "Shih Tzu",
      owner: "Anna Garcia",
      vet: "Dr. Evelyn Dane",
      service: "Dental Cleaning",
      status: "Completed",
    },
    {
      time: "03:00 PM",
      pet: "Milo",
      type: "Beagle",
      owner: "Daniel Santos",
      vet: "Dr. Alex Mercer",
      service: "Surgery Follow-up",
      status: "Pending",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">CLINIC MANAGEMENT</p>
            <h1>Appointments</h1>
            <p>
              Manage and monitor all scheduled veterinary appointments.
            </p>
          </div>

          <button className="admin-primary-button" type="button">
            + New Appointment
          </button>
        </header>

        <section className="appointment-summary">
          <div className="appointment-summary-card">
            <span>Today's Appointments</span>
            <strong>24</strong>
          </div>

          <div className="appointment-summary-card">
            <span>Confirmed</span>
            <strong>16</strong>
          </div>

          <div className="appointment-summary-card">
            <span>Pending</span>
            <strong>5</strong>
          </div>

          <div className="appointment-summary-card">
            <span>Completed</span>
            <strong>3</strong>
          </div>
        </section>

        <section className="admin-panel appointments-page-panel">
          <div className="appointments-toolbar">
            <div className="appointment-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search pet, owner, or veterinarian..."
              />
            </div>

            <div className="appointment-filters">
              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <select defaultValue="today">
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>PATIENT</th>
                  <th>OWNER</th>
                  <th>VETERINARIAN</th>
                  <th>SERVICE</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{appointment.time}</strong>
                    </td>

                    <td>
                      <div className="table-patient">
                        <div className="table-patient-avatar">🐾</div>

                        <div>
                          <strong>{appointment.pet}</strong>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </td>

                    <td>{appointment.owner}</td>

                    <td>{appointment.vet}</td>

                    <td>{appointment.service}</td>

                    <td>
                      <span
                        className={`appointment-status ${appointment.status.toLowerCase()}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="appointment-more"
                        type="button"
                        aria-label={`More options for ${appointment.pet}`}
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Appointments;

