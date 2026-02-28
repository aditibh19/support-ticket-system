import React from "react";
import "../styles/TicketList.css";

function TicketList({ tickets, onTicketSelect }) {
  if (!tickets.length) return <p className="no-tickets">No tickets found.</p>;

  // Badge color mapping
  const priorityColors = { high: "#dc2626", medium: "#facc15", low: "#16a34a" };
const categoryColors = { technical: "#3b82f6", billing: "#f97316", general: "#6b7280" };
  return (
    <div className="tickets-container">
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          className="ticket-card"
          onClick={() => onTicketSelect(ticket)}
        >
          <h4>{ticket.title}</h4>
          <div className="ticket-badges">
            <span
              className="badge category-badge"
              style={{ backgroundColor: categoryColors[ticket.category] || "#6b7280" }}
            >
              {ticket.category}
            </span>
            <span
              className="badge priority-badge"
              style={{ backgroundColor: priorityColors[ticket.priority] || "#6b7280" }}
            >
              {ticket.priority}
            </span>
          </div>
          <p className={`status ${ticket.status.toLowerCase()}`}>Status: {ticket.status}</p>
        </div>
      ))}
    </div>
  );
}

export default TicketList;