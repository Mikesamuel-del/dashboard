import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Account() {
  const { user, updateUser, logout } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [serverUser, setServerUser] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      setMsg("");
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/user/${userId}`);
        const data = await res.json();
        setServerUser(data);
        setName(data?.name || "");
        setPhone(data?.phone || "");
        updateUser({ name: data?.name, phone: data?.phone, package: data?.package, balance: data?.balance });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    if (userId) run();
  }, [userId, updateUser]);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Update failed");
      updateUser(data.user);
      setMsg("Saved.");
    } catch (err) {
      setMsg(err?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Account</h2>
          <div className="page-sub">
            Package: <b>{(user?.package || "none").toUpperCase()}</b> • Balance:{" "}
            <b>KES {user?.balance ?? 0}</b>
          </div>
        </div>

        <div className="page-actions">
          <Link className="link-btn" to="/">
            Dashboard
          </Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {loading && !serverUser ? <p>Loading...</p> : null}

      <div className="auth-card" style={{ maxWidth: 520, margin: "12px auto" }}>
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Your phone number is used for <b>deposits</b> and <b>withdrawals</b>.
        </p>

        {msg ? <div className="auth-error" style={{ background: "#e0f2fe", color: "#075985", borderColor: "#bae6fd" }}>{msg}</div> : null}

        <form className="auth-form" onSubmit={save}>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Phone number
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>

          <label>
            Email
            <input value={user?.email || ""} readOnly />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

