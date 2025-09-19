import axios from "axios";
const API_URL = "http://localhost:3000"; // Backend URL



// Helper for requests with JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // or however you store it
  return { Authorization: `Bearer ${token}` };
};

export const searchUsers = async (query, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // return the full object { success, users, message, count }
  } catch (err) {
    console.error("Search API Error:", err);
    return { users: [] }; // ensure default is an object with array
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
