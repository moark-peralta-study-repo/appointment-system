import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ClientPortal.css";

import ClientSidebar from "../../components/client/ClientSidebar";
import ClientHeader from "../../components/client/ClientHeader";

import mochi from "../../assets/images/pets/mochi.jpeg";
import luna from "../../assets/images/pets/luna.jpeg";

import { PiPawPrint } from "react-icons/pi";
import { CiCalendarDate, CiFileOn } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

function ClientDashboard() {
    const [activePage, setActivePage] = useState("Dashboard");
    const navigate = useNavigate();

    return (
        <div className="client-app">
            {/* GINAMIT ANG REUSABLE CLIENT SIDEBAR */}
            <ClientSidebar activePage={activePage} setActivePage={setActivePage} />

            <main className="client-main">
                {/* GINAMIT ANG REUSABLE CLIENT HEADER */}
                <ClientHeader />

                <div className="client-content">
                    {/* WELCOME BANNER */}
                    <section className="client-welcome">
                        <div>
                            <p className="client-eyebrow">SUNDAY, SEPTEMBER 27, 2026</p>
                            <h1>
                                Good evening, Jamie! <span>🐾</span>
                            </h1>
                            <p>Welcome back! Here's what's happening with your pets today.</p>
                        </div>

                        <button 
                            className="book-button"
                            onClick={() => navigate("/book-appointment")}
                        >
                            <IoAdd />
                            Book an appointment
                        </button>
                    </section>

                    {/* PETS SECTION */}
                    <section>
                        <div className="section-title">
                            <div>
                                <p className="client-eyebrow">YOUR PETS</p>
                                <h2>My furry friends</h2>
                            </div>

                            <button 
                                className="text-button"
                                onClick={() => navigate("/client/pets")}
                            >
                                View all <FaArrowRight />
                            </button>
                        </div>

                        <div className="pet-cards">
                            <div className="pet-card" onClick={() => navigate("/client/pets/mochi")}>
                                <img src={mochi} alt="Mochi" />
                                <div className="pet-card-info">
                                    <div>
                                        <h3>Mochi</h3>
                                        <p>Golden Retriever · 3 yrs</p>
                                    </div>
                                    <span className="health-chip">Healthy</span>
                                </div>
                                <div className="pet-card-bottom">
                                    <span>Last visit</span>
                                    <strong>Sep 12, 2026</strong>
                                </div>
                            </div>

                            <div className="pet-card" onClick={() => navigate("/client/pets/luna")}>
                                <img src={luna} alt="Luna" />
                                <div className="pet-card-info">
                                    <div>
                                        <h3>Luna</h3>
                                        <p>Persian Cat · 2 yrs</p>
                                    </div>
                                    <span className="health-chip">Healthy</span>
                                </div>
                                <div className="pet-card-bottom">
                                    <span>Last visit</span>
                                    <strong>Aug 28, 2026</strong>
                                </div>
                            </div>

                            <button 
                                className="add-pet-card"
                                onClick={() => alert("Add Pet modal coming soon!")}
                            >
                                <div className="add-pet-icon">＋</div>
                                <strong>Add a pet</strong>
                                <span>Register another furry friend</span>
                            </button>
                        </div>
                    </section>

                    {/* APPOINTMENT & SHORTCUTS */}
                    <section className="client-main-grid">
                        <div className="next-appointment">
                            <div className="section-title">
                                <div>
                                    <p className="client-eyebrow">NEXT APPOINTMENT</p>
                                    <h2>Upcoming visit</h2>
                                </div>
                                <span className="confirmed-chip">Confirmed</span>
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
                                            <CiCalendarDate />
                                            <span>09:00 AM</span>
                                        </div>
                                        <div>
                                            <PiPawPrint />
                                            <span>General Check-up</span>
                                        </div>
                                        <div>
                                            <span className="doctor-icon">DR</span>
                                            <span>Dr. Santos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="appointment-link"
                                onClick={() => navigate("/client/appointments")}
                            >
                                View appointment details
                                <FaArrowRight />
                            </button>
                        </div>

                        <div className="quick-actions-card">
                            <div className="section-title">
                                <div>
                                    <p className="client-eyebrow">SHORTCUTS</p>
                                    <h2>Quick actions</h2>
                                </div>
                            </div>

                            <button 
                                className="client-action"
                                onClick={() => navigate("/book-appointment")}
                            >
                                <span className="action-icon blue-action">
                                    <CiCalendarDate />
                                </span>
                                <span>
                                    <strong>Book appointment</strong>
                                    <small>Schedule a clinic visit</small>
                                </span>
                                <FaArrowRight />
                            </button>

                            <button 
                                className="client-action"
                                onClick={() => navigate("/client/pets")}
                            >
                                <span className="action-icon yellow-action">
                                    <PiPawPrint />
                                </span>
                                <span>
                                    <strong>Manage my pets</strong>
                                    <small>View your pet profiles</small>
                                </span>
                                <FaArrowRight />
                            </button>

                            <button 
                                className="client-action"
                                onClick={() => navigate("/client/records")}
                            >
                                <span className="action-icon green-action">
                                    <CiFileOn />
                                </span>
                                <span>
                                    <strong>Medical records</strong>
                                    <small>View health history</small>
                                </span>
                                <FaArrowRight />
                            </button>
                        </div>
                    </section>

                    {/* HEALTH REMINDER */}
                    <section className="health-reminder">
                        <div className="reminder-icon">
                            <PiPawPrint />
                        </div>
                        <div>
                            <p className="client-eyebrow">PET HEALTH REMINDER</p>
                            <h3>Luna's vaccination is coming up!</h3>
                            <p>
                                Luna is due for her next vaccination this month. Keep her protected and healthy.
                            </p>
                        </div>
                        <button onClick={() => navigate("/book-appointment")}>
                            Schedule visit <FaArrowRight />
                        </button>
                    </section>

                    <footer className="client-footer">
                        <span>Mutual Paws Veterinary Clinic</span>
                        <span>Care for every paw, every day. 🐾</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default ClientDashboard;