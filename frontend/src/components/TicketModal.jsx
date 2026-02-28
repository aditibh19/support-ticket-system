import React, { useState } from "react";
import { updateTicket, deleteTicket } from "../api/api";
import "../styles/TicketModal.css";

function TicketModal({ ticket, onClose, onEdit, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [category, setCategory] = useState(ticket.category);
  const [priority, setPriority] = useState(ticket.priority);
  const [status, setStatus] = useState(ticket.status);
  const [description, setDescription] = useState(ticket.description);

  const priorityColors = { high: "#dc2626", medium: "#facc15", low: "#16a34a" };
  const categoryColors = { technical: "#3b82f6", billing: "#f97316", general: "#6b7280" };

  const handleSave = async () => {
    try {
      const updated = await updateTicket(ticket.id, {
        title,
        category,
        priority,
        status,
        description,
      });

      onEdit(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket(ticket.id);
      onDelete(ticket.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {!editMode ? (
          <>
            <h3>{ticket.title}</h3>

            <div className="modal-badges">
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

            <p className={`status ${ticket.status}`}>
              Status: {ticket.status}
            </p>

            <p><strong>Description:</strong> {ticket.description}</p>

            <div className="modal-buttons">
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <button className="close-btn" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <input value={title} onChange={e => setTitle(e.target.value)} />

            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
            </select>

            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <textarea value={description} onChange={e => setDescription(e.target.value)} />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketModal;