
import AdminSidebar from "../../components/AdminSidebar";

function Patients() {
  const patients = [
    {
      name: "Mochi",
      species: "Dog",
      breed: "Golden Retriever",
      owner: "Maria Lopez",
      age: "3 years",
      lastVisit: "Oct 2, 2026",
      status: "Healthy",
      emoji: "🐶",
    },
    {
      name: "Luna",
      species: "Cat",
      breed: "Persian",
      owner: "James Reyes",
      age: "2 years",
      lastVisit: "Oct 1, 2026",
      status: "Healthy",
      emoji: "🐱",
    },
    {
      name: "Bruno",
      species: "Dog",
      breed: "Labrador Retriever",
      owner: "Sofia Cruz",
      age: "5 years",
      lastVisit: "Sep 29, 2026",
      status: "Under Observation",
      emoji: "🐶",
    },
    {
      name: "Cookie",
      species: "Dog",
      breed: "Shih Tzu",
      owner: "Anna Garcia",
      age: "4 years",
      lastVisit: "Sep 27, 2026",
      status: "Healthy",
      emoji: "🐶",
    },
    {
      name: "Milo",
      species: "Dog",
      breed: "Beagle",
      owner: "Daniel Santos",
      age: "6 years",
      lastVisit: "Sep 25, 2026",
      status: "Under Observation",
      emoji: "🐶",
    },
    {
      name: "Nala",
      species: "Cat",
      breed: "Siamese",
      owner: "Rachel Tan",
      age: "1 year",
      lastVisit: "Sep 22, 2026",
      status: "Healthy",
      emoji: "🐱",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">CLINIC MANAGEMENT</p>

            <h1>Patients</h1>

            <p>
              View and manage all pets registered at Mutuals Paws.
            </p>
          </div>

          <button className="admin-primary-button" type="button">
            + Add Patient
          </button>
        </header>

        {/* PATIENT SUMMARY */}

        <section className="patient-summary">
          <div className="patient-summary-card">
            <div className="patient-summary-icon blue">
              🐾
            </div>

            <div>
              <span>Total Patients</span>
              <strong>186</strong>
            </div>
          </div>

          <div className="patient-summary-card">
            <div className="patient-summary-icon yellow">
              🐶
            </div>

            <div>
              <span>Dogs</span>
              <strong>124</strong>
            </div>
          </div>

          <div className="patient-summary-card">
            <div className="patient-summary-icon green">
              🐱
            </div>

            <div>
              <span>Cats</span>
              <strong>62</strong>
            </div>
          </div>

          <div className="patient-summary-card">
            <div className="patient-summary-icon soft-blue">
              ✚
            </div>

            <div>
              <span>New This Month</span>
              <strong>12</strong>
            </div>
          </div>
        </section>

        {/* PATIENT TABLE */}

        <section className="admin-panel patients-page-panel">
          <div className="patients-toolbar">
            <div className="patient-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search patient or owner..."
              />
            </div>

            <div className="patient-filters">
              <select defaultValue="all">
                <option value="all">All Species</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
              </select>

              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="observation">
                  Under Observation
                </option>
              </select>
            </div>
          </div>

          <div className="patients-table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>OWNER</th>
                  <th>AGE</th>
                  <th>LAST VISIT</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index}>
                    <td>
                      <div className="patient-table-info">
                        <div className="patient-table-avatar">
                          {patient.emoji}
                        </div>

                        <div>
                          <strong>{patient.name}</strong>

                          <span>
                            {patient.species} • {patient.breed}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="patient-owner">
                        {patient.owner}
                      </span>
                    </td>

                    <td>{patient.age}</td>

                    <td>{patient.lastVisit}</td>

                    <td>
                      <span
                        className={`patient-status ${
                          patient.status === "Healthy"
                            ? "healthy"
                            : "observation"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="patient-view-button"
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

          {/* TABLE FOOTER */}

          <div className="patients-table-footer">
            <span>Showing 6 of 186 patients</span>

            <div className="patient-pagination">
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

export default Patients;

