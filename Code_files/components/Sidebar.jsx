import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▣",
    },
    {
      name: "My Accounts",
      path: "/accounts",
      icon: "▤",
    },
    {
      name: "Transfer Money",
      path: "/transfer",
      icon: "↔",
    },
    {
      name: "Deposit",
      path: "/deposit",
      icon: "↓",
    },
    {
      name: "Withdraw",
      path: "/withdraw",
      icon: "↑",
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: "☷",
    },
    {
      name: "Loans",
      path: "/loans",
      icon: "▥",
    },
    {
      name: "Investments",
      path: "/investments",
      icon: "◈",
    },
    {
      name: "Financial Health",
      path: "/financial-health",
      icon: "♥",
    },
  ];

  const supportItems = [
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔",
    },
    {
      name: "Security",
      path: "/security",
      icon: "🔒",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">AB</div>

        <div>
          <h2>AB Bank</h2>
          <p>Secure Banking</p>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              onClick={() => {
                document.body.classList.remove("sidebar-open");
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">SUPPORT & SECURITY</p>

        <nav>
          {supportItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              onClick={() => {
                document.body.classList.remove("sidebar-open");
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="security-box">
          <span className="security-icon">🛡️</span>

          <div>
            <strong>Bank Secure</strong>
            <p>Your account is protected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;