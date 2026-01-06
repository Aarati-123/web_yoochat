import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessageAPI } from "../api/api";
import {jwtDecode} from "jwt-decode"; // ✅ fixed import
import axios from "axios"; // added for reporting
import "./ChatWindow.css";

function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

// ---------------- NEW STATES FOR REPORTING ----------------
  const [reportMode, setReportMode] = useState(false); // selecting messages
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [reportStep, setReportStep] = useState(0); // 0 = select messages, 1 = select reason, 2 = "other reason"
  const [otherReason, setOtherReason] = useState("");
  // ----------------------------------------------------------

  // Get logged-in user from token
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
    const messagesContainerRef = useRef(null); // scroll to bottom is forced so only if new message comes up
    const prevMessageCountRef = useRef(0);

    const isUserNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return false;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
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
  const newMessageArrived = messages.length > prevMessageCountRef.current;
  if (newMessageArrived && isUserNearBottom()) {
    scrollToBottom();
  }
  prevMessageCountRef.current = messages.length;
}, [messages]);

   // ------------------- MESSAGE REPORT HANDLERS -------------------
  const toggleSelectMessage = (message_id) => {
    setSelectedMessages((prev) =>
      prev.includes(message_id)
        ? prev.filter((id) => id !== message_id)
        : [...prev, message_id]
    );
  };

  const handleReportSubmit = async (reason) => {
  try {
    // Merge "Other" reason text
    const finalReason =
      reason === "Other" && otherReason.trim() !== ""
        ? `Other: ${otherReason}`
        : reason;

    if (selectedMessages.length === 0) {
      alert("Please select at least one message to report.");
      return;
    }

    await axios.post(
      "http://localhost:3000/report-message", 
      {
        reported_about: user.user_id,   // snake_case
        reason: finalReason,
        message_ids: selectedMessages,  // snake_case
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Reset states
    setReportMode(false);
    setSelectedMessages([]);
    setReportStep(0);
    setOtherReason("");

    alert("Report submitted successfully");
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Failed to submit report");
  }
  };


  // ---------------------------------------------------------------

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
    scrollToBottom();
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

        {/* 3-DOTS REPORT BUTTON */}
        <button
  className="moreBtn"
  title="More options"
  onClick={() => setReportMode(true)}
>
  <span className="dots">⋮</span>
</button>


      </div>

      {/* Messages */}
      <div className="chatWindowMessages" ref={messagesContainerRef}>
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
               {/*  SHOW CHECKBOX IN REPORT MODE  */}
              {reportMode && reportStep === 0 && (
                <input
                  type="checkbox"
                  className="reportCheckbox"
                  checked={selectedMessages.includes(msg.message_id)}
                  onChange={() => toggleSelectMessage(msg.message_id)}
                />
              )}

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
    {/* ---------------- REPORTING FOOTER BAR ---------------- */}
      {reportMode && reportStep === 0 && (
        <div className="reportBar">
          <button onClick={() => setReportStep(1)}>Report</button>
          <button onClick={() => { setReportMode(false); setSelectedMessages([]); }}>Cancel</button>
        </div>
      )}

      {reportMode && reportStep === 1 && (
        <div className={`reportBar ${reportStep === 1 ? "expanded" : ""}`}>
          {["Spam", "Impersonation", "Offensive language", "Others"].map((r) => (
            <button
              key={r}
              onClick={() => {
                if (r === "Others") {
                  setReportStep(2);
                } else {
                  handleReportSubmit(r);
                }
              }}
            >
              {r}
            </button>
          ))}
          <button onClick={() => { setReportMode(false); setSelectedMessages([]); setReportStep(0); }}>Cancel</button>
        </div>
      )}

      {reportMode && reportStep === 2 && (
        <div className="reportBar">
          <input
            type="text"
            placeholder="Enter reason..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
          <button onClick={() => handleReportSubmit(otherReason)}>Send</button>
          <button onClick={() => { setReportMode(false); setSelectedMessages([]); setReportStep(0); setOtherReason(""); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
