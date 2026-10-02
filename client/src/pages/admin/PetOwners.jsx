
import AdminSidebar from "../../components/AdminSidebar";

function PetOwners() {
  const owners = [
    {
      name: "Maria Lopez",
      email: "maria.lopez@email.com",
      phone: "+63 917 245 1832",
      pets: 2,
      lastAppointment: "Oct 2, 2026",
      status: "Active",
      initials: "ML",
    },
    {
      name: "James Reyes",
      email: "james.reyes@email.com",
      phone: "+63 918 562 9041",
      pets: 1,
      lastAppointment: "Oct 1, 2026",
      status: "Active",
      initials: "JR",
    },
    {
      name: "Sofia Cruz",
      email: "sofia.cruz@email.com",
      phone: "+63 905 731 4268",
      pets: 3,
      lastAppointment: "Sep 29, 2026",
      status: "Active",
      initials: "SC",
    },
    {
      name: "Anna Garcia",
      email: "anna.garcia@email.com",
      phone: "+63 917 843 2157",
      pets: 1,
      lastAppointment: "Sep 27, 2026",
      status: "Active",
      initials: "AG",
    },
    {
      name: "Daniel Santos",
      email: "daniel.santos@email.com",
      phone: "+63 919 325 6714",
      pets: 2,
      lastAppointment: "Sep 25, 2026",
      status: "Active",
      initials: "DS",
    },
    {
      name: "Rachel Tan",
      email: "rachel.tan@email.com",
      phone: "+63 906 482 1935",
      pets: 1,
      lastAppointment: "Sep 22, 2026",
      status: "Inactive",
      initials: "RT",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">CLINIC MANAGEMENT</p>

            <h1>Pet Owners</h1>

            <p>
              Manage client information and their registered pets.
            </p>
          </div>

          <button className="admin-primary-button" type="button">
            + Add Pet Owner
          </button>
        </header>

        {/* OWNER SUMMARY */}

        <section className="owner-summary">
          <div className="owner-summary-card">
            <div className="owner-summary-icon blue">
              👥
            </div>

            <div>
              <span>Total Pet Owners</span>
              <strong>142</strong>
            </div>
          </div>

          <div className="owner-summary-card">
            <div className="owner-summary-icon green">
              ✓
            </div>

            <div>
              <span>Active Owners</span>
              <strong>136</strong>
            </div>
          </div>

          <div className="owner-summary-card">
            <div className="owner-summary-icon yellow">
              ✦
            </div>

            <div>
              <span>New This Month</span>
              <strong>6</strong>
            </div>
          </div>

          <div className="owner-summary-card">
            <div className="owner-summary-icon soft-blue">
              🐾
            </div>

            <div>
              <span>Registered Pets</span>
              <strong>186</strong>
            </div>
          </div>
        </section>

        {/* OWNER TABLE */}

        <section className="admin-panel owners-page-panel">
          <div className="owners-toolbar">
            <div className="owner-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search owner, email, or phone..."
              />
            </div>

            <div className="owner-filters">
              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="owners-table-wrapper">
            <table className="owners-table">
              <thead>
                <tr>
                  <th>PET OWNER</th>
                  <th>CONTACT</th>
                  <th>PETS</th>
                  <th>LAST APPOINTMENT</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {owners.map((owner, index) => (
                  <tr key={index}>
                    <td>
                      <div className="owner-table-info">
                        <div className="owner-avatar">
                          {owner.initials}
                        </div>

                        <div>
                          <strong>{owner.name}</strong>
                          <span>{owner.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="owner-phone">
                        {owner.phone}
                      </span>
                    </td>

                    <td>
                      <span className="owner-pet-count">
                        🐾 {owner.pets}
                      </span>
                    </td>

                    <td>{owner.lastAppointment}</td>

                    <td>
                      <span
                        className={`owner-status ${
                          owner.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {owner.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="owner-view-button"
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

          {/* FOOTER */}

          <div className="owners-table-footer">
            <span>Showing 6 of 142 pet owners</span>

            <div className="owner-pagination">
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

export default PetOwners;

