import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  PiLayout, 
  PiCalendarCheck, 
  PiPlusCircle, 
  PiUser, 
  PiSignOut 
} from "react-icons/pi";
import happyPawsLogo from "../../assets/logo/happy-paws-logo-2.png";

function ClientSidebar({ activePage, setActivePage }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <PiLayout size={20} /> },
    { name: "Appointments", path: "/appointments", icon: <PiCalendarCheck size={20} /> },
    { name: "Book Appointment", path: "/book-appointment", icon: <PiPlusCircle size={20} /> },
    { name: "Profile", path: "/profile", icon: <PiUser size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar" style={{
      width: "250px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "20px 16px"
    }}>
      <div>
        {/* Brand Header: Logo Image + Text Header */}
        <div className="sidebar-brand" style={{ padding: "0 12px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src={happyPawsLogo} 
            alt="Mutual Paws Logo" 
            style={{ 
              height: "28px", 
              width: "auto", 
              objectFit: "contain" 
            }} 
          />
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1f2937", margin: 0 }}>
            Mutual Paws<span style={{ color: "#2563eb" }}>.</span>
          </h2>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = activePage 
              ? activePage.toLowerCase() === item.name.toLowerCase()
              : location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActivePage && setActivePage(item.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  color: isActive ? "#2563eb" : "#4b5563",
                  backgroundColor: isActive ? "#eff6ff" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout Button */}
      <div style={{ paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "transparent",
            color: "#ef4444",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <PiSignOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;