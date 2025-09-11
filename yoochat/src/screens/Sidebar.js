import "./css/SideBar.css";
import SidebarButton from "../components/sidebar_Button";
import logo from "../assets/logo.jpg";
import chat from "../assets/chat.png";
import notification from "../assets/notification.png";
import msgReq from "../assets/msgReq.png";
import userIcon from "../assets/user.png";

const Sidebar = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className="sidebar-container">
      <div className="Upper">
        <SidebarButton icon={logo} />
        <SidebarButton icon={chat} />
        <SidebarButton icon={notification} />
        <SidebarButton icon={msgReq} />
        <SidebarButton icon={userIcon} />
      </div>
      <div className="Lower">
        <SidebarButton />
      </div>
    </div>
  );
};
export default Sidebar;
