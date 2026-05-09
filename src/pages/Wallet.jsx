import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const hasActivePackage = (pkg) => Boolean(pkg && pkg !== "none");

export default function Wallet() {
  const { user, updateUser } = useAuth();
  const userId = user?.id;

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverUser, setServerUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/user/${userId}`);
        const data = await res.json();
        setServerUser(data);
        updateUser({
          balance: data.balance,
          package: data.package,
          phone: data.phone,
          name: data.name,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, updateUser]);

  const deposit = async () => {
    if (!amount) return;
    try {
      await fetch(`${API_BASE}/api/payment/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          phone: serverUser?.phone || user?.phone,
          userId,
        }),
      });
      alert("STK Push sent. Enter PIN on your phone.");
      setAmount("");
    } catch {
      alert("Deposit failed");
    }
  };

  const withdraw = async () => {
    if (!amount) return;
    if (!hasActivePackage(serverUser?.package || user?.package)) {
      alert("Buy a package first to withdraw.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/user/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: Number(amount) }),
      });
      const data = await res.json();
      alert(data?.message || "Withdraw processed");
      setAmount("");
      // refresh balance
      try {
        const refreshRes = await fetch(`${API_BASE}/api/user/${userId}`);
        const refreshData = await refreshRes.json();
        setServerUser(refreshData);
        updateUser({
          balance: refreshData.balance,
          package: refreshData.package,
          phone: refreshData.phone,
          name: refreshData.name,
        });
      } catch {
        // ignore
      }
    } catch {
      alert("Withdraw failed");
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Wallet</h2>
          <div className="page-sub">
            Balance: <b>KES {user?.balance ?? 0}</b> • Phone: <b>{user?.phone || "-"}</b>
          </div>
        </div>
        <div className="page-actions">
          <Link className="link-btn" to="/">
            Dashboard
          </Link>
          <Link className="link-btn" to="/account">
            Account
          </Link>
        </div>
      </div>

      {loading && !serverUser ? <p>Loading...</p> : null}

      <div className="auth-card" style={{ maxWidth: 520, margin: "12px auto" }}>
        <h3 style={{ marginTop: 0 }}>Deposit / Withdraw</h3>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Deposits go to the registered phone number. Withdrawals require an active package.
        </p>

        <div className="auth-form">
          <label>
            Amount (KES)
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
          </label>

          <button type="button" onClick={deposit}>
            Deposit (STK Push)
          </button>
          <button type="button" onClick={withdraw} style={{ background: "#e53935" }}>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

