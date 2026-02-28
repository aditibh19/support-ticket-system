// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { getTickets, updateTicket, deleteTicket } from "../api/api";
import { toast } from "react-toastify";

function AdminPanel({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data.results || data);
    } catch {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle ticket update (inline edit)
  const handleUpdate = async (id, field, value) => {
    try {
      await updateTicket(id, { [field]: value });
      // Update local state immediately
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
    } catch {
      toast.error("Failed to update ticket");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        setTickets((prev) => prev.filter((t) => t.id !== id));
        toast.success("Ticket deleted successfully");
      } catch {
        toast.error("Failed to delete ticket");
      }
    }
  };

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="admin-panel" style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Admin Panel</h2>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table
          style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{ticket.title}</td>
                <td>
                  <select
                    value={ticket.category}
                    onChange={(e) =>
                      handleUpdate(ticket.id, "category", e.target.value)
                    }
                  >
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="support">Support</option>
                    <option value="general">General</option>
                  </select>
                </td>
                <td>
                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      handleUpdate(ticket.id, "priority", e.target.value)
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </td>
                <td>
                  <select
                    value={ticket.status.toLowerCase()}
                    onChange={(e) =>
                      handleUpdate(ticket.id, "status", e.target.value)
                    }
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    style={{
                      color: "white",
                      background: "#ef4444",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;