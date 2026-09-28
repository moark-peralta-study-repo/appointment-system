
import { useState } from "react";

import mochi from "../assets/images/pets/mochi.jpeg";
import luna from "../assets/images/pets/luna.jpeg";

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="7" r="2.3" />
      <circle cx="17" cy="7" r="2.3" />
      <circle cx="5" cy="13" r="2.1" />
      <circle cx="19" cy="13" r="2.1" />
      <path d="M12 12c-3.2 0-5.5 2.3-5.5 5 0 2.3 1.8 3.5 5.5 3.5s5.5-1.2 5.5-3.5c0-2.7-2.3-5-5.5-5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function PetsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="5" cy="13" r="2" />
      <circle cx="19" cy="13" r="2" />
      <path d="M12 12c-3 0-5 2-5 5 0 2 2 3 5 3s5-1 5-3c0-3-2-5-5-5Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
    </svg>
  );
}

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: "Dashboard", icon: <HomeIcon /> },
    { name: "My Pets", icon: <PetsIcon /> },
    { name: "Appointments", icon: <CalendarIcon /> },
    { name: "Medical Records", icon: <FileIcon /> },
    { name: "Profile", icon: <UserIcon /> },
  ];

  return (
    <div className="client-app">

      {/* SIDEBAR */}
      <aside className="client-sidebar">

        <div className="brand">
          <div className="brand-icon">
            <PawIcon />
          </div>

          <div>
            <h2>Happy Paws</h2>
            <span>Veterinary Clinic</span>
          </div>
        </div>

        <nav className="client-navigation">
          <p className="nav-label">MENU</p>

          {navigation.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-help">
          <div className="help-icon">
            ?
          </div>

          <div>
            <strong>Need help?</strong>
            <span>Contact our clinic</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">JC</div>

          <div>
            <strong>Jamie Cruz</strong>
            <span>Pet Owner</span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="client-main">

        {/* TOP BAR */}
        <header className="client-topbar">

          <div className="mobile-brand">
            <strong>Happy Paws</strong>
          </div>

          <div className="topbar-actions">

            <button
              className="client-notification"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              aria-label="Notifications"
            >
              <BellIcon />
              <span></span>
            </button>

            <div className="profile-mini">
              <div className="user-avatar">JC</div>

              <div>
                <strong>Jamie Cruz</strong>
                <span>Pet Owner</span>
              </div>
            </div>

          </div>

          {showNotifications && (
            <div className="client-notifications">
              <div className="notification-title">
                <strong>Notifications</strong>
                <span>2 new</span>
              </div>

              <div className="client-notification-item">
                <div className="notification-dot"></div>

                <div>
                  <strong>Appointment reminder</strong>
                  <span>Mochi · Tomorrow at 9:00 AM</span>
                </div>
              </div>

              <div className="client-notification-item">
                <div className="notification-dot"></div>

                <div>
                  <strong>Vaccination reminder</strong>
                  <span>Luna · Due this week</span>
                </div>
              </div>
            </div>
          )}

        </header>

        <div className="client-content">

          {/* WELCOME */}
          <section className="client-welcome">

            <div>
              <p className="client-eyebrow">
                SUNDAY, SEPTEMBER 27, 2026
              </p>

              <h1>
                Good evening, Jamie! <span>🐾</span>
              </h1>

              <p>
                Welcome back! Here's what's happening
                with your pets today.
              </p>
            </div>

            <button className="book-button">
              <span>＋</span>
              Book an appointment
            </button>

          </section>

          {/* PETS */}
          <section>

            <div className="section-title">
              <div>
                <p className="client-eyebrow">YOUR PETS</p>
                <h2>My furry friends</h2>
              </div>

              <button className="text-button">
                View all →
              </button>
            </div>

            <div className="pet-cards">

              <div className="pet-card">

                <img
                  src={mochi}
                  alt="Mochi"
                />

                <div className="pet-card-info">
                  <div>
                    <h3>Mochi</h3>
                    <p>Golden Retriever · 3 yrs</p>
                  </div>

                  <span className="health-chip">
                    Healthy
                  </span>
                </div>

                <div className="pet-card-bottom">
                  <span>Last visit</span>
                  <strong>Sep 12, 2026</strong>
                </div>

              </div>

              <div className="pet-card">

                <img
                  src={luna}
                  alt="Luna"
                />

                <div className="pet-card-info">
                  <div>
                    <h3>Luna</h3>
                    <p>Persian Cat · 2 yrs</p>
                  </div>

                  <span className="health-chip">
                    Healthy
                  </span>
                </div>

                <div className="pet-card-bottom">
                  <span>Last visit</span>
                  <strong>Aug 28, 2026</strong>
                </div>

              </div>

              <button className="add-pet-card">

                <div className="add-pet-icon">
                  ＋
                </div>

                <strong>Add a pet</strong>
                <span>Register another furry friend</span>

              </button>

            </div>

          </section>

          {/* APPOINTMENT + QUICK ACTIONS */}
          <section className="client-main-grid">

            <div className="next-appointment">

              <div className="section-title">
                <div>
                  <p className="client-eyebrow">
                    NEXT APPOINTMENT
                  </p>

                  <h2>Upcoming visit</h2>
                </div>

                <span className="confirmed-chip">
                  Confirmed
                </span>
              </div>

              <div className="appointment-highlight">

                <div className="appointment-date">
                  <span>OCT</span>
                  <strong>02</strong>
                  <small>FRI</small>
                </div>

                <div className="appointment-details">

                  <div className="appointment-pet">
                    <img src={mochi} alt="Mochi" />

                    <div>
                      <h3>Mochi</h3>
                      <span>Golden Retriever</span>
                    </div>
                  </div>

                  <div className="appointment-info">
                    <div>
                      <CalendarIcon />
                      <span>09:00 AM</span>
                    </div>

                    <div>
                      <PawIcon />
                      <span>General Check-up</span>
                    </div>

                    <div>
                      <span className="doctor-icon">DR</span>
                      <span>Dr. Santos</span>
                    </div>
                  </div>

                </div>

              </div>

              <button className="appointment-link">
                View appointment details
                <ArrowIcon />
              </button>

            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions-card">

              <div className="section-title">
                <div>
                  <p className="client-eyebrow">SHORTCUTS</p>
                  <h2>Quick actions</h2>
                </div>
              </div>

              <button className="client-action">
                <span className="action-icon blue-action">
                  <CalendarIcon />
                </span>

                <span>
                  <strong>Book appointment</strong>
                  <small>Schedule a clinic visit</small>
                </span>

                <ArrowIcon />
              </button>

              <button className="client-action">
                <span className="action-icon yellow-action">
                  <PetsIcon />
                </span>

                <span>
                  <strong>Manage my pets</strong>
                  <small>View your pet profiles</small>
                </span>

                <ArrowIcon />
              </button>

              <button className="client-action">
                <span className="action-icon green-action">
                  <FileIcon />
                </span>

                <span>
                  <strong>Medical records</strong>
                  <small>View health history</small>
                </span>

                <ArrowIcon />
              </button>

            </div>

          </section>

          {/* HEALTH REMINDER */}
          <section className="health-reminder">

            <div className="reminder-icon">
              <PawIcon />
            </div>

            <div>
              <p className="client-eyebrow">
                PET HEALTH REMINDER
              </p>

              <h3>Luna's vaccination is coming up!</h3>

              <p>
                Luna is due for her next vaccination this month.
                Keep her protected and healthy.
              </p>
            </div>

            <button>
              Schedule visit →
            </button>

          </section>

          <footer className="client-footer">
            <span>Happy Paws Veterinary Clinic</span>
            <span>Care for every paw, every day. 🐾</span>
          </footer>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;

