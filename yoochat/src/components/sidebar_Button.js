import React from "react";
import "./css/sidebar_Button.css";
import logo from "../assets/logo.jpg";

const SidebarButton = ({ icon, onClick }) => {
  return (
    <div className="container">
      <button type="button" className="sidebar_Button">
        <img src={icon} className="buttonIcon" />
        {/* implement the icon and onclick later */}
      </button>
    </div>
  );
};

export default SidebarButton;
