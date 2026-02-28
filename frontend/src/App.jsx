import React, { useState } from "react";
import LoginForm from "./components/AuthForm";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  // Login handler
  const handleLogin = () => {
    setLoggedIn(true);
  };

  // Logout handler
  const handleLogout = () => {
    setLoggedIn(false);
    setShowLanding(false);
  };

  // Continue from landing page
  const handleContinue = () => {
    setShowLanding(true);
  };

  // Render pages conditionally
  if (!loggedIn) return <LoginForm onLogin={handleLogin} />;
  if (!showLanding) return <LandingPage onContinue={handleContinue} />;

  // Pass logout handler to DashboardPage
  return <DashboardPage onLogout={handleLogout} />;
}

export default App;