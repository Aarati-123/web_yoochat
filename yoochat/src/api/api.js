import axios from "axios";

const API_URL = "http://localhost:3000"; // Backend URL

// Helper for requests with JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ================== User & Friend APIs ==================
export const searchUsers = async (query, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("searchUsers API Error:", err);
    return { users: [] };
  }
};

export const getFriends = async (username) => {
  try {
    const res = await fetch(`${API_URL}/friendship/list/${username}`, { headers: getAuthHeaders() });
    return res.json();
  } catch (err) {
    console.error("getFriends API Error:", err);
    return { friends: [] };
  }
};

export const getPendingRequests = async () => {
  try {
    const res = await fetch(`${API_URL}/friendship/pendingRequests`, { headers: getAuthHeaders() });
    return res.json();
  } catch (err) {
    console.error("getPendingRequests API Error:", err);
    return { pending_requests: [] };
  }
};

export const getSentRequests = async () => {
  try {
    const res = await fetch(`${API_URL}/friendship/sentRequests`, { headers: getAuthHeaders() });
    return res.json();
  } catch (err) {
    console.error("getSentRequests API Error:", err);
    return { sent_requests: [] };
  }
};

// ================== Friend Actions ==================
export const sendFriendRequest = async (receiver_id) => {
  try {
    const res = await fetch(`${API_URL}/friendship/sendRequest`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id }),
    });
    return res.json();
  } catch (err) {
    console.error("sendFriendRequest API Error:", err);
    return { success: false };
  }
};

export const acceptFriendRequest = async (sender_id) => {
  try {
    const res = await fetch(`${API_URL}/friendship/acceptRequest`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id }),
    });
    return res.json();
  } catch (err) {
    console.error("acceptFriendRequest API Error:", err);
    return { success: false };
  }
};

export const declineFriendRequest = async (sender_id) => {
  try {
    const res = await fetch(`${API_URL}/friendship/declineRequest`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id }),
    });
    return res.json();
  } catch (err) {
    console.error("declineFriendRequest API Error:", err);
    return { success: false };
  }
};

export const cancelFriendRequest = async (receiver_id) => {
  try {
    const res = await fetch(`${API_URL}/friendship/cancelRequest`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id }),
    });
    return res.json();
  } catch (err) {
    console.error("cancelFriendRequest API Error:", err);
    return { success: false };
  }
};

export const unfriend = async (user2_id) => {
  try {
    const res = await fetch(`${API_URL}/friendship/unfriend`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ user2_id }),
    });
    return res.json();
  } catch (err) {
    console.error("unfriend API Error:", err);
    return { success: false };
  }
};

// ================== Post APIs ==================
export const getMyPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/feed/myPosts`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  } catch (err) {
    console.error("getMyPosts API Error:", err);
    return { posts: [] };
  }
};

export const createPost = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/feed/createPost`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  } catch (err) {
    console.error("createPost API Error:", err);
    return { message: "Error creating post" };
  }
};

export const getFriendsPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/feed/posts`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch friends' posts");
    return res.json();
  } catch (err) {
    console.error("getFriendsPosts API Error:", err);
    return { posts: [] };
  }
};

// ================== Profile API ==================
export const getMyProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/users/me`, { headers: getAuthHeaders() });
    return res.json();
  } catch (err) {
    console.error("getMyProfile API Error:", err);
    return { username: "Unknown", profile_image: "/avatar2.png" };
  }
};

// ================== Notifications ==================
export const getNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    const data = await res.json();
    return data.notifications || [];
  } catch (err) {
    console.error("getNotifications API Error:", err);
    return [];
  }
};


export const sendMessageAPI = async (receiver_id, content) => {
  try {
    const res = await fetch(`http://localhost:3000/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ receiver_id, content }),
    });

    if (!res.ok) throw new Error("Send failed");

    const data = await res.json();
    return data.message_data; // ✅ CORRECT
  } catch (err) {
    console.error("sendMessageAPI Error:", err);
    return null;
  }
};


export const getMessages = async (friend_id) => {
  try {
    const res = await fetch(
      `http://localhost:3000/message/conversation/${friend_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    return data.conversation || [];
  } catch (err) {
    console.error("getMessages API Error:", err);
    return [];
  }
};

// ================== Saved Posts ==================
export const savePost = async (post_id) => {
  try {
    const res = await fetch(`${API_URL}/feed/savePost`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ post_id }),
    });
    return res.json();
  } catch (err) {
    console.error("savePost API Error:", err);
    return { success: false, message: "Failed to save post" };
  }
};

export const unsavePost = async (post_id) => {
  try {
    const res = await fetch(`${API_URL}/feed/unsavePost`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ post_id }),
    });
    return res.json();
  } catch (err) {
    console.error("unsavePost API Error:", err);
    return { success: false, message: "Failed to unsave post" };
  }
};

export const getSavedPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/feed/saved`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch saved posts");
    const data = await res.json();
    return data.savedPosts || [];
  } catch (err) {
    console.error("getSavedPosts API Error:", err);
    return [];
  }
};
