import AdminPageHeader from "../../components/admin/AdminPageHeader";

function Settings() {
  return (
    <>
        <AdminPageHeader
      eyebrow="SYSTEM CONFIGURATION"
      title="Settings"
      description="Manage clinic information, account preferences, and system settings."
    />


    <div className="settings-layout">
      {/* Main Settings */}
      <div className="settings-content">
        {/* Clinic Profile */}
        <section className="admin-panel settings-panel">
          <div className="settings-panel-header">
            <div>
              <h2>Clinic Profile</h2>
              <p>
                Update the basic information displayed throughout the
                system.
              </p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="settings-field settings-full">
              <label>Clinic Name</label>
              <input
                type="text"
                defaultValue="Mutuals Paws Veterinary Clinic"
              />
            </div>

            <div className="settings-field">
              <label>Email Address</label>
              <input
                type="email"
                defaultValue="hello@mutualspaws.com"
              />
            </div>

            <div className="settings-field">
              <label>Phone Number</label>
              <input
                type="text"
                defaultValue="+63 917 123 4567"
              />
            </div>

            <div className="settings-field settings-full">
              <label>Clinic Address</label>
              <input
                type="text"
                defaultValue="123 Pet Care Avenue, Metro Manila"
              />
            </div>

            <div className="settings-field settings-full">
              <label>About the Clinic</label>
              <textarea
                rows="4"
                defaultValue="Mutuals Paws Veterinary Clinic provides compassionate and reliable veterinary care for pets and their families."
              ></textarea>
            </div>
          </div>

          <div className="settings-actions">
            <button className="admin-secondary-button" type="button">
              Cancel
            </button>

            <button className="admin-primary-button" type="button">
              Save Changes
            </button>
          </div>
        </section>

        {/* Clinic Hours */}
        <section className="admin-panel settings-panel">
          <div className="settings-panel-header">
            <div>
              <h2>Clinic Hours</h2>
              <p>
                Set the operating hours used for appointment scheduling.
              </p>
            </div>
          </div>

          <div className="settings-hours">
            <div className="settings-day-row">
              <div>
                <strong>Monday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="08:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="18:00" />
            </div>

            <div className="settings-day-row">
              <div>
                <strong>Tuesday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="08:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="18:00" />
            </div>

            <div className="settings-day-row">
              <div>
                <strong>Wednesday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="08:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="18:00" />
            </div>

            <div className="settings-day-row">
              <div>
                <strong>Thursday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="08:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="18:00" />
            </div>

            <div className="settings-day-row">
              <div>
                <strong>Friday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="08:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="18:00" />
            </div>

            <div className="settings-day-row">
              <div>
                <strong>Saturday</strong>
                <span>Open</span>
              </div>

              <input type="time" defaultValue="09:00" />
              <span className="settings-time-separator">to</span>
              <input type="time" defaultValue="16:00" />
            </div>

            <div className="settings-day-row closed">
              <div>
                <strong>Sunday</strong>
                <span>Closed</span>
              </div>

              <span className="settings-closed-label">
                Clinic Closed
              </span>
            </div>
          </div>

          <div className="settings-actions">
            <button className="admin-primary-button" type="button">
              Save Hours
            </button>
          </div>
        </section>

        {/* Appointment Settings */}
        <section className="admin-panel settings-panel">
          <div className="settings-panel-header">
            <div>
              <h2>Appointment Settings</h2>
              <p>
                Control how appointments are handled by the clinic.
              </p>
            </div>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <strong>Allow online bookings</strong>
                <span>
                  Let pet owners request appointments through the
                  client portal.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Require appointment confirmation</strong>
                <span>
                  New appointment requests must be confirmed by
                  clinic staff.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Send appointment reminders</strong>
                <span>
                  Send reminders to pet owners before their scheduled
                  appointment.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Allow same-day appointments</strong>
                <span>
                  Allow clients to request appointments on the same
                  day.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="admin-panel settings-panel">
          <div className="settings-panel-header">
            <div>
              <h2>Notifications</h2>
              <p>
                Choose which system notifications the administrator
                receives.
              </p>
            </div>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <strong>New appointment requests</strong>
                <span>
                  Receive a notification when a new booking is
                  submitted.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Appointment cancellations</strong>
                <span>
                  Get notified when an existing appointment is
                  cancelled.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="settings-option">
              <div>
                <strong>Low availability alerts</strong>
                <span>
                  Receive alerts when veterinarian availability is
                  limited.
                </span>
              </div>

              <label className="settings-toggle">
                <input type="checkbox" />
                <span></span>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Account Card */}
      <aside className="settings-sidebar-card">
        <div className="settings-profile-avatar">A</div>

        <h3>Admin</h3>

        <p>Clinic Administrator</p>

        <div className="settings-profile-divider"></div>

        <div className="settings-account-info">
          <div>
            <span>Email</span>
            <strong>admin@mutualspaws.com</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>Administrator</strong>
          </div>

          <div>
            <span>Last Login</span>
            <strong>Oct 2, 2026 · 8:42 AM</strong>
          </div>
        </div>

        <button className="settings-account-button" type="button">
          Edit Account
        </button>
      </aside>
    </div>
    </>
  );
}

export default Settings;
