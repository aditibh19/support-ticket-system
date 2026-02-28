import React, { useState } from "react";
import { createTicket } from "../api/api";
import "../styles/TicketForm.css";

function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTicket = await createTicket({
        title,
        category,
        priority,
        status: "open",
        description,
      });

      onTicketCreated(newTicket);

      setTitle("");
      setCategory("technical");
      setPriority("medium");
      setDescription("");
    } catch (error) {
      console.error("Failed to create ticket", error);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="technical">Technical</option>
        <option value="billing">Billing</option>
        <option value="general">General</option>
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <button type="submit">Add Ticket</button>
    </form>
  );
}

export default TicketForm;