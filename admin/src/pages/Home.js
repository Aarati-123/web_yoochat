import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [messagesToday, setMessagesToday] = useState(0);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Fetch total users and messages
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/dashboard");
        setRegisteredUsers(res.data.totalUsers);
        setMessagesToday(res.data.totalMessages);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    // Fetch last 7 days activity
    const fetchActivity = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/messages-activity");
        setActivityData(res.data);
      } catch (err) {
        console.error("Activity fetch error:", err);
      }
    };

    fetchDashboard();
    fetchActivity();
  }, []);

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
        <h2>Activity (Last 7 Days)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <Line type="monotone" dataKey="messages" stroke="#8884d8" />
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
