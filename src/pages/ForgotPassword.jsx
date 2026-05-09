import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Request failed");
      }

      toast.success(data.message || "Check your email for reset instructions.");
      setEmail("");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p style={{ marginTop: 0, color: "#475569", fontSize: 14 }}>
          Enter your account email and we&apos;ll send a reset link if it exists.
        </p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              required
              autoComplete="email"
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
