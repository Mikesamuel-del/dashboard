import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const canAccessAdsSurvey = (pkg) => {
  const p = (pkg || "none").toLowerCase();
  return p === "gold" || p === "silver";
};

export default function Survey() {
  const { user } = useAuth();

  if (!canAccessAdsSurvey(user?.package)) {
    return (
      <div className="container">
        <h2>Upgrade required</h2>
        <p>Surveys are available on Silver or Gold packages.</p>
        <Link to="/">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Survey Questions Page</h1>
      <p>Plug your survey provider/questions here.</p>
    </div>
  );
}