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
         console.log("Fetched reports:", res.data);
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

  // +++++++++++++++ Helper Functions for Status Updating +++++++++++++++++

const updateStatus = async (reportId, newStatus) => {
  try {
    // Update DB
    await axios.patch(
      `http://localhost:3000/admin/reported-messages/${reportId}`,
      { status: newStatus }
    );

    // Update local state
    setReports((prev) => {
      const updated = prev.map((r) =>
        r.report_id === reportId ? { ...r, status: newStatus } : r
      );

      // Reorder rows
      let pending = updated.filter((r) => r.status === "Pending");
      let valid = updated.filter((r) => r.status === "Valid");
      let dismissed = updated.filter((r) => r.status === "Dismissed");

      if (newStatus === "Valid") {
        return [...pending, ...valid, ...dismissed];
      } else if (newStatus === "Dismissed") {
        return [...valid, ...dismissed, ...pending.filter(r => r.report_id !== reportId)];
      } else {
        return updated;
      }
    });
  } catch (err) {
    console.error("Failed to update status", err);
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Dismissed":
      return "status-dismissed";
    case "Valid":
      return "status-valid";
    default:
      return "";
  }
};


  return (
    <div className="reported-container">
      <h2>Reported Messages</h2>

      <table className="reported-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th> 
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
              <td colSpan="7" className="empty">
                No reports found
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <React.Fragment key={report.report_id}>
                {/* ================= MAIN ROW ================= */}
                <tr>
                  <td>{report.report_id}</td>
                  <td> 
                    <span className={getStatusClass(report.status)}> {report.status} </span> 
                  </td>
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
                    <td colSpan="7">
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
                           <div className="message-lis t">
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

                        <div className="user-stats">
                        <p> <strong>Warning Count:</strong> {report.warning_count} </p>
                        <p> <strong>Ban Count:</strong> {report.ban_count} </p>
                        </div>

                        <div className="admin-actions">
                          <button onClick={() => updateStatus(report.report_id, "Valid")}>Mark Valid</button>
                          <button onClick={() => updateStatus(report.report_id, "Dismissed")}>Dismiss</button>
                          <button
                         onClick={async () => {
                         try {
                         const res = await axios.post(
                           `http://localhost:3000/admin/users/${report.reported_about}/warn`
                              );

                          // update local state for immediate UI feedback
                            setReports((prev) =>
                              prev.map((r) =>
                                 r.report_id === report.report_id
                                   ? { ...r, warning_count: res.data.warning_count }
                                     : r
                                       )
                                      );
                               } catch (err) {
                              console.error("Failed to warn user", err);
                                }
                               }}
                                >
                                 Warn User
                            </button>
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
