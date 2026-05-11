import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to send reset link");
      }

      const successMessage =
        data?.message || "Password reset link sent to your email.";

      setMessage(successMessage);
      toast.success(successMessage);
    } catch (err) {
      const msg = err?.message || "Failed to send reset link";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {error ? <div className="auth-error">{error}</div> : null}
        {message ? <div className="auth-success">{message}</div> : null}

        <form onSubmit={submit} className="auth-form">
          <label>
            Email Address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              required
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-footer">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
