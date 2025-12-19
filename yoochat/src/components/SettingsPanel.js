import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./SettingsPanel.css";

function SettingsPanel({ onSelectSetting }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // Remove login info
    localStorage.removeItem("token");
    localStorage.removeItem("username");

  
    navigate("/login"); 
  };

  return (
    <div className="settingsPanel">
      <h2 className="settingsTitle">Settings ⚙️</h2>
      <ul className="settingsList">
        <li>
          <button onClick={toggleTheme} className="themeToggleBtn">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </li>
        <li>
          <button onClick={() => onSelectSetting("EditProfile")}>
            Edit Profile
          </button>
        </li>
        <li>
          <button onClick={() => onSelectSetting("BlockedUsers")}>
            Blocked Users
          </button>
        </li>
        <li>
          <button onClick={() => onSelectSetting("ArchivedChats")}>
            Archived Chats
          </button>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default SettingsPanel;
