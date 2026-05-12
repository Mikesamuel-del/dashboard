import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

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
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

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
      if (!res.ok || !data?.success) throw new Error(data?.message || "Reset failed");
      toast.success(data.message || "Password updated");
      if (data.token && data.user) setAuth({ token: data.token, user: data.user });
      navigate("/", { replace: true });
    } catch (err) { toast.error(err?.message || "Reset failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="mm-auth-shell">
      <div className="mm-auth-card">
        <div className="mm-auth-brand">
          <Logo size="lg" />
          <p className="mm-auth-tagline">Set a new Marketminds password</p>
        </div>

        <h2 className="mm-auth-title">New password</h2>
        <p className="mm-auth-sub">Choose a strong password you haven&apos;t used elsewhere.</p>

        {!token ? <div className="auth-error">Missing reset token in URL.</div> : null}

        <form onSubmit={submit} className="mm-auth-form">
          <label>New password
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="At least 8 characters" required minLength={8}
              autoComplete="new-password" />
          </label>
          <label>Confirm password
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              type="password" placeholder="Repeat password" required minLength={8}
              autoComplete="new-password" />
          </label>
          <button disabled={loading} type="submit" className="mm-auth-btn">
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>

        <p className="mm-auth-footer">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
