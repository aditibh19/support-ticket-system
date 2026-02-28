import React from "react";
import { FaTicketAlt, FaClock, FaChartLine } from "react-icons/fa";

function StatsDashboard({ stats, loading }) {
  if (loading) return <p>Loading stats...</p>;

  const statsData = [
    {
      title: "Total Tickets",
      value: stats.total_tickets || 0,
      icon: <FaTicketAlt />,
      color: "indigo",
    },
    {
      title: "Open Tickets",
      value: stats.open_tickets || 0,
      icon: <FaClock />,
      color: "red",
    },
    {
      title: "Avg Per Day",
      value: stats.avg_tickets_per_day || 0,
      icon: <FaChartLine />,
      color: "green",
    },
  ];

  return (
    <div className="stats-grid">
      {statsData.map((s, idx) => (
        <div key={idx} className={`stat-card ${s.color}`}>
          <div className="stat-icon">{s.icon}</div>
          <div>
            <div className="stat-title">{s.title}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsDashboard;