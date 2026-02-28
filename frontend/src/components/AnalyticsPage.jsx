// AnalyticsPage.jsx
import React, { useMemo } from "react";
import StatsDashboard from "./StatsDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Helper: count tickets by a field
const countBy = (tickets, field, values) =>
  values.map(
    (val) => tickets.filter((t) => (t[field] || "").toLowerCase() === val).length
  );

function AnalyticsPage({ tickets }) {
  // -------------------------
  // Stats calculation
  // -------------------------
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => (t.status || "").toLowerCase() === "open").length;

  // Calculate dynamic average tickets per day
  let avgPerDay = 0;
  if (tickets.length) {
    const dates = tickets
      .map((t) => new Date(t.created_at))
      .sort((a, b) => a - b);
    const daysSpan =
      (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24) + 1;
    avgPerDay = (tickets.length / daysSpan).toFixed(1);
  }

  const stats = {
    total_tickets: totalTickets,
    open_tickets: openTickets,
    avg_tickets_per_day: avgPerDay,
  };

  // -------------------------
  // Chart options
  // -------------------------
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // -------------------------
  // Chart: Tickets by Category
  // -------------------------
  const categoryData = useMemo(() => {
    const categories = ["technical", "billing", "general"];
    return {
      labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [
        {
          label: "Tickets by Category",
          data: countBy(tickets, "category", categories),
          backgroundColor: ["#3b82f6", "#f97316", "#6b7280"],
        },
      ],
    };
  }, [tickets]);

  // -------------------------
  // Chart: Tickets by Priority
  // -------------------------
  const priorityData = useMemo(() => {
    const priorities = ["high", "medium", "low"];
    return {
      labels: priorities.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
      datasets: [
        {
          label: "Tickets by Priority",
          data: countBy(tickets, "priority", priorities),
          backgroundColor: ["#ef4444", "#facc15", "#16a34a"],
        },
      ],
    };
  }, [tickets]);

  // -------------------------
  // Chart: Tickets Over Time
  // -------------------------
  const timeData = useMemo(() => {
    const counts = {};
    tickets.forEach((t) => {
      const created = t.created_at ? new Date(t.created_at) : new Date();
      const day = created.toISOString().split("T")[0]; // YYYY-MM-DD
      counts[day] = (counts[day] || 0) + 1;
    });

    const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
    const data = labels.map((d) => counts[d]);

    return {
      labels,
      datasets: [
        {
          label: "Tickets Over Time",
          data,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.3)",
          tension: 0.3,
        },
      ],
    };
  }, [tickets]);

  return (
    <div className="analytics-page">
      <h2>Ticket Analytics</h2>
      <StatsDashboard stats={stats} loading={false} />

      <div className="charts-container" style={{ display: "grid", gap: "2rem" }}>
        <div className="chart-card">
          <h4>Tickets by Category</h4>
          {tickets.length ? <Bar data={categoryData} options={commonOptions} /> : <p>No data</p>}
        </div>

        <div className="chart-card">
          <h4>Tickets by Priority</h4>
          {tickets.length ? <Bar data={priorityData} options={commonOptions} /> : <p>No data</p>}
        </div>

        <div className="chart-card">
          <h4>Tickets Over Time</h4>
          {tickets.length ? <Line data={timeData} options={commonOptions} /> : <p>No data</p>}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;