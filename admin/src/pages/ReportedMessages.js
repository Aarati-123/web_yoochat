import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReportedMessages.css";

function ReportedMessages() {
  const [reports, setReports] = useState([]);
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/reported-messages"
        );
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      }
    };
    fetchReports();
  }, []);

  const toggleExpand = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  return (
    <div className="reported-container">
      <h2>Reported Messages</h2>

      <table className="reported-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reported By</th>
            <th>Reported About</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                No reports found
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <React.Fragment key={report.report_id}>
                {/* ================= MAIN ROW ================= */}
                <tr>
                  <td>{report.report_id}</td>
                  <td>{report.reported_by_username}</td>
                  <td>{report.reported_about_username}</td>
                  <td>
                    <span className="reason-tag">{report.reason}</span>
                  </td>
                  <td>{new Date(report.report_date).toLocaleString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => toggleExpand(report.report_id)}
                    >
                      {expandedReports[report.report_id]
                        ? "View less"
                        : "View more"}
                    </button>
                  </td>
                </tr>

                {/* ================= EXPANDED ROW ================= */}
                {expandedReports[report.report_id] && (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="expanded-content">
                        {/* <p>
                          <strong>Reported By:</strong>{" "}
                          {report.reported_by_username}
                        </p>
                        <p>
                          <strong>Reported About:</strong>{" "}
                          {report.reported_about_username}
                        </p>
                        <p>
                          <strong>Reason:</strong> {report.reason}
                        </p> */}

                        <div className="message-contents">
                          <strong>Messages:</strong>
                           <div className="message-list">
                            {Array.isArray(report.messages) && report.messages.length > 0 ? (
                            report.messages.map(msg => (
                            <p key={msg.message_id}>
                            <strong>{msg.sender_username}:</strong> {msg.content}
                            </p>
                            ))
                            ) : (
                            <p className="no-messages">No messages found</p>
                            )}
                          </div>
                        </div>

                        <div className="admin-actions">
                          <button disabled>Mark Valid</button>
                          <button disabled>Dismiss</button>
                          <button disabled>Warn User</button>
                          <button disabled>Ban User</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportedMessages;
