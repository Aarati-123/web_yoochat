import "./css/ChatList.css";
import ChatlistBox from "../components/chatlistBox";

const ChatList = () => {
  return (
    <div className="container">
      <div className="heading">Chat</div>
      <div className="searchContainer">
        <input className="seachchat" placeholder="Search...." />
      </div>
      <div className="chatList">
        <ChatlistBox />
        <ChatlistBox />
      </div>
    </div>
  );
};
export default ChatList;
