// src/components/NotificationsPage.js
import React, { useEffect, useState } from "react";
import { getNotifications } from "../api/api";
import "./NotificationsPage.css";

const API_URL = "http://localhost:3000";

const NotificationsPage = ({ type }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();

        const formatted = data.map((n) => ({
          ...n,
          sender_profile_image: n.sender_profile_image
            ? n.sender_profile_image.startsWith("http")
              ? n.sender_profile_image
              : `${API_URL}/${n.sender_profile_image.replace(/\\/g, "/")}`
            : `${API_URL}/avatar2.png`,
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading notifications...</p>;
  }

  const filteredNotifications =
    type === "friends"
      ? notifications.filter(
          (n) =>
            n.type === "friend_request" ||
            n.type === "friend_accept" ||
            n.type === "friend_decline"
        )
      : notifications.filter(
        (n) => 
          n.type === "like" || 
          n.type === "admin_warning"
        );

  if (!filteredNotifications.length) {
    return (
      <p style={{ textAlign: "center", color: "#777" }}>
        No notifications yet.
      </p>
    );
  }

  return (
    <div className="notificationsSinglePanel">
      <h2 className="panelTitle">
        {type === "friends" ? "Friend Actions" : "Post Notifications"}
      </h2>

      {filteredNotifications.map((n) => (
        <div
            key={n.notification_id}
            className={`notificationCard ${n.type === "admin_warning" ? "adminNotification" : ""}`}
          >

          {n.type !== "admin_warning" && (
            <img
              src={n.sender_profile_image}
              alt={n.sender_username || "User"}
              className="notificationAvatar"
            />
          )}

          <div className="notificationContent">
            <p
            className={`notificationMessage ${
              n.type === "warning" ? "warningNotification" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html:
                n.type === "admin_warning"
                  ? n.message
                  : type === "friends"
                  ? n.type === "friend_request"
                    ? `${n.sender_username} sent you a friend request`
                    : n.type === "friend_accept"
                    ? `${n.sender_username} accepted your friend request`
                    : `${n.sender_username} declined your friend request`
                  : `${n.sender_username} reacted 💜 to your post`,
            }}
          ></p>


            {type === "posts" && n.post_thumbnail && (
              <img
                src={
                  n.post_thumbnail.startsWith("http")
                    ? n.post_thumbnail
                    : `${API_URL}/${n.post_thumbnail.replace(/\\/g, "/")}`
                }
                alt="Post"
                className="notificationPostThumbnail"
              />
            )}

            <span className="notificationTime">
              {new Date(n.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
