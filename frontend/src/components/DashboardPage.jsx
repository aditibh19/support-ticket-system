// DashboardPage.jsx
import React, { useState, useEffect } from "react";
import StatsDashboard from "./StatsDashboard";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import TicketModal from "./TicketModal";
import AnalyticsPage from "./AnalyticsPage";
import AdminPanel from "./AdminPanel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/DashboardPage.css";
import { getTickets, createTicket, updateTicket, classifyTicket, getStats } from "../api/api";

function DashboardPage({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard"); // dashboard / tickets / analytics / admin

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data.results || data);
    } catch {
      toast.error("Failed to load tickets");
    }
  };

  // Fetch stats with fallback
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      // fallback: compute simple stats locally if API fails
      const total = tickets.length;
      const open = tickets.filter(t => t.status === "Open").length;
      setStats({ totalTickets: total, openTickets: open, avgPerDay: (total / 30).toFixed(1) });
      // optional: don't spam toast here
      console.warn("Stats API failed, using fallback stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { fetchStats(); }, [tickets]);

  // Ticket handlers
  const handleAddTicket = async (ticket) => {
    try {
      if (!ticket.category || !ticket.priority) {
        const classification = await classifyTicket(ticket.description);
        ticket.category = ticket.category || classification.suggested_category;
        ticket.priority = ticket.priority || classification.suggested_priority;
      }
      const created = await createTicket(ticket);
      setTickets([created, ...tickets]);
      toast.success("Ticket added!");
    } catch {
      toast.error("Failed to create ticket");
    }
  };

  const handleEditTicket = async (updatedTicket) => {
    try {
      const updated = await updateTicket(updatedTicket.id, updatedTicket);
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      toast.info("Ticket updated!");
    } catch {
      toast.error("Failed to update ticket");
    }
  };

  const handleDeleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast.warn("Ticket deleted!");
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    if (onLogout) onLogout();
    toast.info("Logged out");
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">🎫 TicketSys</div>
        <ul>
          <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li className={activeSection === "tickets" ? "active" : ""} onClick={() => setActiveSection("tickets")}>Tickets</li>
          <li className={activeSection === "analytics" ? "active" : ""} onClick={() => setActiveSection("analytics")}>Analytics</li>
          <li className={activeSection === "admin" ? "active" : ""} onClick={() => setActiveSection("admin")}>Admin Panel</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <h1>Support Dashboard</h1>
          <div className="topbar-actions">
            <span className="admin-badge">Admin</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Conditional Sections */}
        {activeSection === "dashboard" && <StatsDashboard stats={stats} loading={loadingStats} />}
        {activeSection === "tickets" && (
          <section className="tickets-section">
            <div className="tickets-header">
              <h2>Tickets</h2>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-bar"
              />
            </div>
            <div className="ticket-card"><TicketForm onTicketCreated={handleAddTicket} /></div>
            <div className="ticket-card"><TicketList tickets={filteredTickets} onTicketSelect={setSelectedTicket} /></div>
          </section>
        )}
        {activeSection === "analytics" && <AnalyticsPage tickets={tickets} />}
        {activeSection === "admin" && <AdminPanel />}

      </div>

      {/* Ticket Modal */}
      {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onEdit={handleEditTicket} onDelete={handleDeleteTicket} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default DashboardPage;