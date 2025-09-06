import React, { useState } from "react";
import "./UserManagement.css";

const Users = [
  { id: 1, name: "Avipsa", email: "avipsahamo@gmail.com", joinedDate: "2024-01-15" },
  { id: 2, name: "Avii", email: "akjhsdglhadg@gmail.com", joinedDate: "2024-02-10" },
  { id: 3, name: "Hamo", email: "Hamo@gmail.com", joinedDate: "2024-03-05" },
  // Add more dummy data as needed
];

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = Users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <th>Name</th>
            <th>Email</th>
            <th>Joined Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.joinedDate}</td>
                <td>
                  {/* Example actions */}
                  <button className="action-btn">Edit</button>
                  <button className="action-btn delete">Delete</button>
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
