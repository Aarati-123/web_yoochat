import React, { useState, useEffect } from "react";
import { Home, Newspaper, Bell, MessageCircle, User, Settings, Plus } from "lucide-react";
import "./IconMenu.css";

function IconMenu({ onSelect }) {
  const [activeIcon, setActiveIcon] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const icons = [
    { id: "feed", Icon: Home },  
    { id: "home", Icon: Newspaper },
    { id: "notifications", Icon: Bell },
    { id: "chat", Icon: MessageCircle },
    { id: "profile", Icon: User },
    { id: "contribute", Icon: Plus },
  ];

  return (
    <div className={`iconMenu ${collapsed ? "collapsed" : ""}`}>
      <div className="logo">{collapsed ? "Y" : "यो"}</div>

      <div className="menuIcons">
        {icons.map((item) => {
          const IconComponent = item.Icon;
          return (
            <span
              key={item.id}
              className={activeIcon === item.id ? "activeIcon" : ""}
              onClick={() => {
                setActiveIcon(item.id);
                onSelect?.(item.id);
              }}
            >
              <IconComponent size={22} strokeWidth={2.5} />
            </span>
          );
        })}
      </div>

      <div
        className={`bottomIcon ${activeIcon === "settings" ? "activeSetting" : ""}`}
        onClick={() => {
          setActiveIcon("settings");
          onSelect?.("settings");
        }}
      >
        <Settings size={22} strokeWidth={2.5} />
      </div>
    </div>
  );
}

export default IconMenu;
