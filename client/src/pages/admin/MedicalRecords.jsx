
import AdminSidebar from "../../components/AdminSidebar";

function MedicalRecords() {
  const records = [
    {
      patient: "Mochi",
      species: "Golden Retriever",
      owner: "Maria Lopez",
      veterinarian: "Dr. Evelyn Dane",
      recordType: "General Check-up",
      date: "Oct 2, 2026",
      status: "Completed",
      initials: "M",
    },
    {
      patient: "Luna",
      species: "Persian Cat",
      owner: "James Reyes",
      veterinarian: "Dr. Alex Mercer",
      recordType: "Vaccination",
      date: "Oct 1, 2026",
      status: "Completed",
      initials: "L",
    },
    {
      patient: "Bruno",
      species: "Labrador Retriever",
      owner: "Sofia Cruz",
      veterinarian: "Dr. Elena Rostova",
      recordType: "Consultation",
      date: "Sep 29, 2026",
      status: "Follow-up",
      initials: "B",
    },
    {
      patient: "Cookie",
      species: "Shih Tzu",
      owner: "Anna Garcia",
      veterinarian: "Dr. Evelyn Dane",
      recordType: "Dental Cleaning",
      date: "Sep 27, 2026",
      status: "Completed",
      initials: "C",
    },
    {
      patient: "Milo",
      species: "Beagle",
      owner: "Daniel Santos",
      veterinarian: "Dr. Alex Mercer",
      recordType: "Surgery Follow-up",
      date: "Sep 25, 2026",
      status: "Follow-up",
      initials: "M",
    },
    {
      patient: "Nala",
      species: "Siamese Cat",
      owner: "Rachel Tan",
      veterinarian: "Dr. Elena Rostova",
      recordType: "Wellness Exam",
      date: "Sep 22, 2026",
      status: "Completed",
      initials: "N",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">PATIENT CARE</p>

            <h1>Medical Records</h1>

            <p>
              Review and manage medical records for registered patients.
            </p>
          </div>

          <button className="admin-primary-button" type="button">
            + New Medical Record
          </button>
        </header>

        {/* SUMMARY */}

        <section className="medical-summary">
          <div className="medical-summary-card">
            <div className="medical-summary-icon blue">
              📋
            </div>

            <div>
              <span>Total Records</span>
              <strong>428</strong>
            </div>
          </div>

          <div className="medical-summary-card">
            <div className="medical-summary-icon green">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>392</strong>
            </div>
          </div>

          <div className="medical-summary-card">
            <div className="medical-summary-icon yellow">
              ↻
            </div>

            <div>
              <span>Follow-ups</span>
              <strong>24</strong>
            </div>
          </div>

          <div className="medical-summary-card">
            <div className="medical-summary-icon soft-blue">
              ✦
            </div>

            <div>
              <span>This Month</span>
              <strong>36</strong>
            </div>
          </div>
        </section>

        {/* RECORDS PANEL */}

        <section className="admin-panel medical-records-panel">
          <div className="medical-toolbar">
            <div className="medical-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search patient, owner, or record..."
              />
            </div>

            <div className="medical-filters">
              <select defaultValue="all">
                <option value="all">All Record Types</option>
                <option value="checkup">General Check-up</option>
                <option value="vaccination">Vaccination</option>
                <option value="consultation">Consultation</option>
                <option value="dental">Dental Cleaning</option>
                <option value="surgery">Surgery Follow-up</option>
                <option value="wellness">Wellness Exam</option>
              </select>

              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="medical-table-wrapper">
            <table className="medical-table">
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>OWNER</th>
                  <th>VETERINARIAN</th>
                  <th>RECORD TYPE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <div className="medical-patient-info">
                        <div className="medical-patient-avatar">
                          {record.initials}
                        </div>

                        <div>
                          <strong>{record.patient}</strong>
                          <span>{record.species}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="medical-owner">
                        {record.owner}
                      </span>
                    </td>

                    <td>{record.veterinarian}</td>

                    <td>
                      <span className="medical-record-type">
                        {record.recordType}
                      </span>
                    </td>

                    <td>{record.date}</td>

                    <td>
                      <span
                        className={`medical-status ${
                          record.status === "Completed"
                            ? "completed"
                            : "followup"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="medical-view-button"
                        type="button"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="medical-table-footer">
            <span>Showing 6 of 428 medical records</span>

            <div className="medical-pagination">
              <button type="button">‹</button>

              <button className="active" type="button">
                1
              </button>

              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">4</button>

              <button type="button">›</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MedicalRecords;

