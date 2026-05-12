import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referredBy, setReferredBy] = useState(() => {
    try { return new URLSearchParams(location.search).get("ref") || ""; }
    catch { return ""; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, password,
          referredBy: referredBy || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Registration failed");
      setAuth({ token: data.token, user: data.user });
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.message || "Registration failed";
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="mm-auth-shell">
      <div className="mm-auth-card">
        <div className="mm-auth-brand">
          <Logo size="lg" />
          <p className="mm-auth-tagline">Join Marketminds today</p>
        </div>

        <h2 className="mm-auth-title">Create your account</h2>

        {error ? <div className="auth-error">{error}</div> : null}

        <form onSubmit={submit} className="mm-auth-form">
          <label>Full name
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name" required />
          </label>
          <label>Email
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="you@email.com" required />
          </label>
          <label>Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXX" required />
          </label>
          <label>Password
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="At least 8 characters" required minLength={8} />
          </label>
          <label>Referral code (optional)
            <input value={referredBy} onChange={(e) => setReferredBy(e.target.value)}
              placeholder="Referral code" />
          </label>

          <button disabled={loading} type="submit" className="mm-auth-btn">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mm-auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
