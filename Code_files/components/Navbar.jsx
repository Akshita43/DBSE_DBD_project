import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => {
            document.body.classList.toggle("sidebar-open");
          }}
        >
          ☰
        </button>

        <div className="navbar-brand">
          <div className="brand-logo">AB</div>
          <div>
            <h2>AB Bank</h2>
            <span>Digital Banking</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="nav-icon-btn"
          onClick={() => navigate("/notifications")}
          title="Notifications"
        >
          🔔
        </button>

        <div className="navbar-user">
          <div className="user-avatar">AA</div>

          <div className="user-info">
            <strong>Anand Akshita</strong>
            <span>Customer</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          ↪
        </button>
      </div>
    </header>
  );
}

export default Navbar;