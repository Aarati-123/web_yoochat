import React from "react";
import "./Home.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  // Sample data (replace with actual data from backend)
  const registeredUsers = 1200;
  const messagesToday = 356;

  const activityData = [
    { day: "Mon", users: 110 },
    { day: "Tue", users: 150 },
    { day: "Wed", users: 130 },
    { day: "Thu", users: 90 },
    { day: "Fri", users: 170 },
    { day: "Sat", users: 200 },
    { day: "Sun", users: 140 },
  ];

  return (
    <div className="home-container">
      {/* Registration Section */}
      <div className="section">
        <h2>Registration</h2>
        <div className="registration-boxes">
          <div className="info-box">
            <h3>Registered Users</h3>
            <p className="number">{registeredUsers}</p>
          </div>
          <div className="info-box">
            <h3>Total Messages Sent</h3>
            <p className="number">{messagesToday}</p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="section">
        <h2>Activity</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
