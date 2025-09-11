import React from "react";
import "./css/chatlistBox.css";

const ChatlistBox = ({
  pfp,
  name,
  lastMessage,
  onClick,
  lastMessageTime,
  readStatus,
  isActive,
}) => {
  return (
    <div className={isActive ? "chatListBox active" : "chatListBox inactive"}>
      <div className="chatPfp"></div>
      <div className="chatInfo">
        <div className="chatName">John Doe</div>
        <div className="chatRecentMessage">Hey, how are you?</div>
      </div>
      <div className="chatMeta">
        <div className="chatTime">12:45 PM</div>
        <div className={readStatus ? "status read" : "status unread"}></div>
      </div>
    </div>
  );
};

export default ChatlistBox;
