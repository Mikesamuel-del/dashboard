import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo";

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
      if (!res.ok || !data?.success) throw new Error(data?.message || "Request failed");
      toast.success(data.message || "Check your email for reset instructions.");
      setEmail("");
    } catch (err) { toast.error(err?.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="mm-auth-shell">
      <div className="mm-auth-card">
        <div className="mm-auth-brand">
          <Logo size="lg" />
          <p className="mm-auth-tagline">Recover your Marketminds account</p>
        </div>

        <h2 className="mm-auth-title">Forgot password</h2>
        <p className="mm-auth-sub">
          Enter your account email and we&apos;ll send a reset link if it exists.
        </p>

        <form onSubmit={submit} className="mm-auth-form">
          <label>Email
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="you@email.com" required autoComplete="email" />
          </label>
          <button disabled={loading} type="submit" className="mm-auth-btn">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mm-auth-footer">
          Remember your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
