import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Logo from "../assets/logo.png";
import arrow from "../assets/arrowbutton.svg";
import Homeicon from "../assets/homeicon.svg";
import usericon from "../assets/usericon.svg";
import chatbubble from "../assets/chatbubbleicon.svg";
import groupicon from "../assets/groupicon.svg";
import flagicon from "../assets/flagicon.svg";
import logouticon from "../assets/logouticon.svg";

import "./Navbar.css";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Homeicon, path: "/home" },
    { label: "User Management", icon: usericon, path: "/UserManagement" },
    { label: "Reported Messages", icon: flagicon, path: "/ReportedAccounts" },
    { label: "Banned Accounts", icon: chatbubble, path: "/BannedAccounts" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("LoggedIn");
    if (setIsLoggedIn) setIsLoggedIn(false);
    setTimeout(() => navigate("/"), 0); // delay to apply state first
  };

  return (
    <div className="navbar">
      <div className="topside">
        <button className="arrow-btn">
          <img src={arrow} alt="Toggle" />
        </button>
        <img src={Logo} alt="Logo" className="logo" />
      </div>

      <div className="bottomside">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`nav-button ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt={`${item.label} icon`} />
            <span>{item.label}</span>
          </button>
        ))}

        <button onClick={handleLogout} className="nav-button logout-button">
          <img src={logouticon} alt="Logout icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
