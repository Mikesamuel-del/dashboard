import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const canAccessWriting = (pkg) => (pkg || "none").toLowerCase() === "gold";

export default function Writing() {
  const { user } = useAuth();

  if (!canAccessWriting(user?.package)) {
    return (
      <div className="container">
        <h2>Upgrade required</h2>
        <p>Online Writing is available on the Gold package.</p>
        <Link to="/">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Online Writing Page</h1>
      <p>Add your writing tasks and payouts here.</p>
    </div>
  );
}