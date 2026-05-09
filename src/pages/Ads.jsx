import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const canAccessAdsSurvey = (pkg) => {
  const p = (pkg || "none").toLowerCase();
  return p === "gold" || p === "silver";
};

export default function Ads() {
  const { user } = useAuth();

  if (!canAccessAdsSurvey(user?.package)) {
    return (
      <div className="container">
        <h2>Upgrade required</h2>
        <p>Ads & Surveys are available on Silver or Gold packages.</p>
        <Link to="/">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Watch Ads Page</h1>
      <p>Connect your ads provider here.</p>
    </div>
  );
}