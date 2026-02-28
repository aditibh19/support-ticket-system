import React from "react";
import "../styles/LandingPage.css";

function LandingPage({ onContinue }) {
  return (
    <div className="landing-container">
      <h1>Welcome to Support Ticket System</h1>
      <p>Manage tickets efficiently with analytics, filtering, and notifications.</p>
      <button onClick={onContinue}>Enter Dashboard</button>
    </div>
  );
}

export default LandingPage;