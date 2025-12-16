// src/screens/Home.js
import React, { useState, useEffect } from "react";
import IconMenu from "../components/IconMenu";
import TabNav from "../components/TabNav";
import UserList from "../components/UserList";
import SettingsPanel from "../components/SettingsPanel";
import EditProfile from "../components/EditProfile";
import ContributeFeed from "../components/ContributeFeed";
import FriendsFeed from "../components/FriendsFeed";
import NotificationsPage from "../components/NotificationsPage";
import MyPostsFeed from "../components/MyPostsFeed";
import ChatScreen from "./ChatScreen";

import "./Home.css";

import {
  getFriends,
  getPendingRequests,
  getSentRequests,
  searchUsers,
} from "../api/api";

function Home() {
  const [activeSidebar, setActiveSidebar] = useState("feed");
  const [activeTab, setActiveTab] = useState("Friends");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* ---------------- PROFILE DATA ---------------- */
  useEffect(() => {
    if (activeSidebar !== "profile") return;

    async function loadData() {
      try {
        if (activeTab === "Friends") {
          if (!username) return;
          const res = await getFriends(username);
          setFriends(res.friends || []);
        } else if (activeTab === "Pending") {
          const received = await getPendingRequests();
          const sent = await getSentRequests();
          setReceivedRequests(received.pending_requests || []);
          setSentRequests(sent.sent_requests || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [activeTab, activeSidebar, username]);

  /* ---------------- SEARCH USERS ---------------- */
  useEffect(() => {
    if (activeSidebar !== "profile" || activeTab !== "Add Friend") return;

    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setUsers([]);
        return;
      }
      try {
        const res = await searchUsers(search, token);
        setUsers(res.users || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, activeSidebar, activeTab, token]);

  /* ---------------- FRIEND ACTIONS ---------------- */
  const handleActionComplete = async (user, actionType) => {
    if (actionType === "sent") {
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      setSentRequests((prev) => [...prev, user]);
    } else if (actionType === "cancelled") {
      setSentRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
    } else if (actionType === "accepted") {
      setReceivedRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
      const res = await getFriends(username);
      setFriends(res.friends || []);
    } else if (actionType === "declined") {
      setReceivedRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
    }
  };

  /* ---------------- SORT / FILTER ---------------- */
  const sortBySearchMatch = (arr) => {
    if (!search) return arr;
    return [...arr].sort((a, b) =>
      a.username.toLowerCase().indexOf(search.toLowerCase()) -
      b.username.toLowerCase().indexOf(search.toLowerCase())
    );
  };

  const filteredFriends =
    activeSidebar === "profile" && activeTab === "Friends"
      ? sortBySearchMatch(
          friends.filter((f) =>
            f.username.toLowerCase().includes(search.toLowerCase())
          )
        )
      : [];

  const filteredUsers =
    activeSidebar === "profile" && activeTab === "Add Friend"
      ? users.filter(
          (u) =>
            !friends.some((f) => f.user_id === u.user_id) &&
            !sentRequests.some((s) => s.user_id === u.user_id) &&
            !receivedRequests.some((r) => r.user_id === u.user_id)
        )
      : [];

  const filteredPending =
    activeSidebar === "profile" && activeTab === "Pending"
      ? sortBySearchMatch([...receivedRequests, ...sentRequests])
      : [];

  /* ================= RENDER ================= */
  return (
    <div className="homeContainer">
      <div className="sidebar">
        <IconMenu onSelect={setActiveSidebar} />
      </div>

      {/* FEED */}
      {activeSidebar === "feed" && (
        <div className="feedPanel">
          <FriendsFeed token={token} />
        </div>
      )}

      {/* HOME */}
      {activeSidebar === "home" && (
        <div className="middlePanel">
          <MyPostsFeed />
        </div>
      )}

      {/* CHAT → SEPARATE SCREEN */}
      {activeSidebar === "chat" && <ChatScreen />}

      {/* ALL OTHER SCREENS */}
      {activeSidebar !== "feed" &&
        activeSidebar !== "home" &&
        activeSidebar !== "chat" && (
          <>
            <div className="middlePanel">
              {activeSidebar === "profile" && (
                <>
                  <TabNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  <input
                    className="searchInput"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {activeTab === "Friends" && (
                    <UserList
                      users={filteredFriends}
                      type="friends"
                      token={token}
                      onActionComplete={handleActionComplete}
                    />
                  )}

                  {activeTab === "Add Friend" && (
                    <UserList
                      users={filteredUsers}
                      type="add"
                      token={token}
                      onActionComplete={handleActionComplete}
                    />
                  )}

                  {activeTab === "Pending" && (
                    <UserList
                      users={filteredPending}
                      type="pending"
                      token={token}
                      onActionComplete={handleActionComplete}
                    />
                  )}
                </>
              )}

              {activeSidebar === "notifications" && <NotificationsPage />}
              {activeSidebar === "settings" && (
                <SettingsPanel onSelectSetting={setSelectedSetting} />
              )}
            </div>

            {/* SETTINGS RIGHT PANEL */}
            {activeSidebar === "settings" && (
              <div className="chatPanel">
                {selectedSetting === "EditProfile" && (
                  <EditProfile token={token} />
                )}
                {selectedSetting === "ContributeFeed" && (
                  <ContributeFeed token={token} />
                )}
                {selectedSetting === "ArchivedChats" && (
                  <p>Archived chats here.</p>
                )}
                {!selectedSetting && (
                  <p style={{ color: "#888" }}>
                    Select an option from settings 😎
                  </p>
                )}
              </div>
            )}
          </>
        )}
    </div>
  );
}

export default Home;
