import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/user/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Reset failed");
      }

      toast.success(data.message || "Password updated");

      if (data.token && data.user) {
        setAuth({ token: data.token, user: data.user });
      }

      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set a new password</h2>
        <p style={{ marginTop: 0, color: "#475569", fontSize: 14 }}>
          Choose a strong password you haven&apos;t used elsewhere.
        </p>

        {!token ? (
          <div className="auth-error">Missing reset token in URL.</div>
        ) : null}

        <form onSubmit={submit} className="auth-form">
          <label>
            New password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirm password
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Repeat password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <button disabled={loading || !token} type="submit">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
