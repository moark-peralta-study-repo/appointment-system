import AdminPageHeader from "../../components/admin/AdminPageHeader";

function Veterinarians() {
  const veterinarians = [
    {
      name: "Dr. Evelyn Dane",
      specialty: "General Practice",
      experience: "8 years experience",
      appointments: 9,
      status: "Available",
      initials: "ED",
    },
    {
      name: "Dr. Alex Mercer",
      specialty: "Surgery & Diagnostics",
      experience: "10 years experience",
      appointments: 7,
      status: "In Consultation",
      initials: "AM",
    },
    {
      name: "Dr. Elena Rostova",
      specialty: "Internal Medicine",
      experience: "7 years experience",
      appointments: 6,
      status: "Available",
      initials: "ER",
    },
    {
      name: "Dr. Marcus Bennett",
      specialty: "Dermatology",
      experience: "6 years experience",
      appointments: 5,
      status: "Available",
      initials: "MB",
    },
    {
      name: "Dr. Claire Morgan",
      specialty: "Emergency Care",
      experience: "9 years experience",
      appointments: 8,
      status: "On Break",
      initials: "CM",
    },
    {
      name: "Dr. Noah Williams",
      specialty: "Preventive Care",
      experience: "5 years experience",
      appointments: 4,
      status: "Available",
      initials: "NW",
    },
  ];

  return (
    <>
        <AdminPageHeader
      eyebrow="CLINIC MANAGEMENT"
      title="Veterinarians"
      description="Manage the veterinary team and monitor their availability."
      actions={
        <button className="admin-primary-button" type="button">
          + Add Veterinarian
        </button>
      }
    />


    {/* SUMMARY */}

    <section className="vet-summary">
      <div className="vet-summary-card">
        <div className="vet-summary-icon blue">
          🩺
        </div>

        <div>
          <span>Total Veterinarians</span>
          <strong>12</strong>
        </div>
      </div>

      <div className="vet-summary-card">
        <div className="vet-summary-icon green">
          ✓
        </div>

        <div>
          <span>Available Now</span>
          <strong>8</strong>
        </div>
      </div>

      <div className="vet-summary-card">
        <div className="vet-summary-icon yellow">
          📅
        </div>

        <div>
          <span>Appointments Today</span>
          <strong>24</strong>
        </div>
      </div>

      <div className="vet-summary-card">
        <div className="vet-summary-icon soft-blue">
          ✦
        </div>

        <div>
          <span>Specialties</span>
          <strong>7</strong>
        </div>
      </div>
    </section>

    {/* TOOLBAR */}

    <section className="admin-panel veterinarians-panel">
      <div className="veterinarians-toolbar">
        <div className="vet-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search veterinarian or specialty..."
          />
        </div>

        <div className="vet-filters">
          <select defaultValue="all">
            <option value="all">All Specialties</option>
            <option value="general">General Practice</option>
            <option value="surgery">
              Surgery & Diagnostics
            </option>
            <option value="internal">
              Internal Medicine
            </option>
            <option value="dermatology">Dermatology</option>
            <option value="emergency">Emergency Care</option>
            <option value="preventive">Preventive Care</option>
          </select>

          <select defaultValue="all">
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="consultation">
              In Consultation
            </option>
            <option value="break">On Break</option>
          </select>
        </div>
      </div>

      {/* VETERINARIAN CARDS */}

      <div className="veterinarian-grid">
        {veterinarians.map((vet, index) => (
          <div className="veterinarian-card" key={index}>
            <div className="vet-card-top">
              <div className="vet-avatar">
                {vet.initials}
              </div>

              <button
                className="vet-more-button"
                type="button"
                aria-label={`More options for ${vet.name}`}
              >
                •••
              </button>
            </div>

            <div className="vet-card-info">
              <h3>{vet.name}</h3>

              <p className="vet-specialty">
                {vet.specialty}
              </p>

              <p className="vet-experience">
                {vet.experience}
              </p>
            </div>

            <div className="vet-card-divider"></div>

            <div className="vet-card-bottom">
              <div>
                <span>Today's Appointments</span>
                <strong>{vet.appointments}</strong>
              </div>

              <span
                className={`vet-status ${
                  vet.status === "Available"
                    ? "available"
                    : vet.status === "In Consultation"
                    ? "consultation"
                    : "break"
                }`}
              >
                <span className="vet-status-dot"></span>
                {vet.status}
              </span>
            </div>

            <button
              className="vet-view-button"
              type="button"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}

export default Veterinarians;
