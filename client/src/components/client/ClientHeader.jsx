import React from "react";
import { PiBell, PiUserCircle } from "react-icons/pi";

function ClientHeader({ title = "Dashboard" }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb"
    }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", margin: 0 }}>
        {title}
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#4b5563" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
          <PiBell size={22} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PiUserCircle size={28} />
          <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Client Portal</span>
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;