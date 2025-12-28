import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/admin/users/${user_id}`);
      setUsers(users.filter((user) => user.user_id !== user_id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <div className="header">
        <h2>User Management</h2>
        <input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Joined Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No users found</td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>
                  {user.profile_image ? (
                    <img
                      src={`http://localhost:3000/uploads/${user.profile_image}`}
                      alt="profile"
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn">Edit</button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
