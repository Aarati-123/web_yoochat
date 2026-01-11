// ChatScreen.js
import React, { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { getFriends } from "../api/api";
import "./ChatScreen.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function ChatScreen() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const username = localStorage.getItem("username");

  // Load friends
  useEffect(() => {
    async function loadFriends() {
      try {
        if (!username) return;
        const res = await getFriends(username);
        const formatted = (res.friends || []).map((f) => ({
          ...f,
          profile_image: f.profile_image
            ? f.profile_image.startsWith("http")
              ? f.profile_image
              : `${API_URL}/${f.profile_image.replace(/\\/g, "/")}`
            : `${API_URL}/avatar2.png`,
        }));
        setFriends(formatted);
      } catch (err) {
        console.error("Failed to load friends:", err);
      }
    }
    loadFriends();
  }, [username]);

  // Filter friends by search
  const filteredFriends = friends.filter((friend) =>
    (friend.username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chatScreen">
      {/* LEFT PANEL: Friends List */}
      <div className="chatListPanel">
        <input
          className="chatSearchInput"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chatFriendList">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend.user_id}
                className={`chatFriendItem ${
                  selectedFriend?.user_id === friend.user_id ? "active" : ""
                }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <img
                  src={friend.profile_image}
                  alt={friend.username}
                  className="chatFriendAvatar"
                />
                <span className="chatFriendName">{friend.username}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: "10px", color: "#888" }}>
              No friends found.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Conversation */}
      <div
  className={`chatConversationPanel ${
    selectedFriend ? "chatWindowActive" : ""
  }`}
>
  {selectedFriend ? (
    <ChatWindow user={selectedFriend} />
  ) : (
    <div className="chatPlaceholder">
      <div className="bubblesContainer">
        <div className="bubble">💬</div>
        <div className="bubble">👋</div>
        <div className="bubble">😊</div>
        <div className="bubble">💌</div>
        <div className="bubble">💜</div>
      </div>
      <h2>Start chatting with your friends!</h2>
      <p>Pick a friend from the left to begin a conversation 💜</p>
    </div>
  )}
</div>

    </div>
  );
}

export default ChatScreen;
