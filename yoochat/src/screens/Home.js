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
import SavedPostsFeed from "../components/savedPostsFeed";

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

  /* ================= LOAD PROFILE DATA ================= */
  useEffect(() => {
    if (activeSidebar !== "profile") return;

    async function loadData() {
      try {
        if (!username) return;

        // Load friends for Friends tab and Add Friend tab (used for filtering)
        if (activeTab === "Friends" || activeTab === "Add Friend") {
          const res = await getFriends(username);
          setFriends(res?.friends || []);
        }

        // Load pending/sent for Pending tab and Add Friend tab (filter & disable buttons)
        if (activeTab === "Pending" || activeTab === "Add Friend") {
          const received = await getPendingRequests();
          const sent = await getSentRequests();

          setReceivedRequests(received?.pending_requests || []);
          setSentRequests(sent?.sent_requests || []);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    }

    loadData();
  }, [activeSidebar, activeTab, username]);

  /* ================= SEARCH USERS ================= */
  useEffect(() => {
    if (activeSidebar !== "profile" || activeTab !== "Add Friend") return;

    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setUsers([]);
        return;
      }

      try {
        const res = await searchUsers(search, token);
        setUsers(res?.users || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, activeSidebar, activeTab, token]);

  // Friend suggestions removed

  /* ================= FRIEND ACTIONS ================= */
  const handleActionComplete = async (user, actionType) => {
    if (!user) return;

    if (actionType === "sent") {
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      setSentRequests((prev) => [...prev, user]);
    }

    if (actionType === "cancelled") {
      setSentRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
    }

    if (actionType === "accepted") {
      setReceivedRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
      const res = await getFriends(username);
      setFriends(res?.friends || []);
    }

    if (actionType === "declined") {
      setReceivedRequests((prev) =>
        prev.filter((u) => u.user_id !== user.user_id)
      );
    }
  };

  /* ================= SAFE SORT ================= */
  const sortBySearchMatch = (arr) => {
    if (!search) return arr;

    const searchText = search.toLowerCase();

    return [...arr].sort((a, b) => {
      const aName = (a?.username || "").toLowerCase();
      const bName = (b?.username || "").toLowerCase();

      return aName.indexOf(searchText) - bName.indexOf(searchText);
    });
  };

  /* ================= FILTERED DATA ================= */
  const filteredFriends =
    activeSidebar === "profile" && activeTab === "Friends"
      ? sortBySearchMatch(
          friends.filter((f) =>
            (f?.username || "")
              .toLowerCase()
              .includes(search.toLowerCase())
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

  // Suggestions removed

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
  <div className="homeMainPanel">
    <div className="homeLeft">
      <MyPostsFeed />
    </div>

    <div className="homeRight">
      <SavedPostsFeed />
    </div>
  </div>
)}

      {/* CONTRIBUTE */}
      {activeSidebar === "contribute" && (
        <div className="feedPanel">
          <ContributeFeed token={token} />
        </div>
      )}

      {/* CHAT */}
      {activeSidebar === "chat" && <ChatScreen />}

      {/* OTHER SCREENS */}
      {activeSidebar !== "feed" &&
        activeSidebar !== "home" &&
        activeSidebar !== "contribute" &&
        activeSidebar !== "chat" &&
        activeSidebar !== "notifications" &&
         (
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

                  {/* Friend suggestions removed */}

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

      {/* NOTIFICATIONS - TWO PANELS */}
      {activeSidebar === "notifications" && (
        <div className="notificationsContainer">
          {/* LEFT PANEL — FRIEND ACTIONS */}
          <div className="notificationPanel">
            <NotificationsPage type="friends" />
          </div>

          {/* RIGHT PANEL — POST NOTIFICATIONS */}
          <div className="notificationPanel">
            <NotificationsPage type="posts" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;