import React from "react";
import Sidebar from "./Sidebar";
import ChatScreenTest from "./ChatScreenTest";
import ChatList from "./ChatList";
import "./css/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <ChatList />
      <ChatScreenTest />
    </div>
  );
};

export default HomePage;
