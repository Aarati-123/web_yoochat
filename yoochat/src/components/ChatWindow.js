import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessageAPI } from "../api/api";
import {jwtDecode} from "jwt-decode"; // ✅ fixed import
import "./ChatWindow.css";

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Get logged-in user from token
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;

    // Fetch messages immediately
    const fetchMessages = async () => {
      const msgs = await getMessages(user.user_id);
      setMessages(msgs);
    };

    fetchMessages();

    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);

    // Cleanup interval on unmount or when user changes
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || !currentUser) return;

    // Temporary message for instant UI
    const tempMessage = {
      message_id: Date.now(), // temporary id
      content: input,
      sender_id: currentUser.user_id,
      sender_name: currentUser.username,
      timestamp: new Date().toISOString(),
      new: true, // trigger pop-in animation
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    // Remove 'new' class after animation
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.message_id === tempMessage.message_id ? { ...msg, new: false } : msg
        )
      );
    }, 300);

    try {
      const savedMessage = await sendMessageAPI(user.user_id, tempMessage.content);
      if (savedMessage) {
        // Replace temp message with backend message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.message_id === tempMessage.message_id ? savedMessage : msg
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!user) {
    return (
      <div className="chatWindowPlaceholder">
        Select a friend to start chatting 💬
      </div>
    );
  }

  return (
    <div className="chatWindowContainer">
      {/* Header */}
      <div className="chatWindowHeader">
        <img
          src={user.profile_image || "/avatar2.png"}
          alt={user.username}
          className="chatWindowAvatar"
        />
        <span>{user.username}</span>
      </div>

      {/* Messages */}
      <div className="chatWindowMessages">
        {messages.map((msg) => {
          const time = new Date(msg.timestamp || msg.message_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.message_id}
              className={`chatMessage ${
                msg.sender_id === currentUser?.user_id ? "sent" : "received"
              } ${msg.new ? "new" : ""}`}
            >
              <span className="messageContent">{msg.content}</span>
              <span className="messageTime">{time}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatWindowInput">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
