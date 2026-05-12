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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      alert(data?.message || "Withdraw processed");

      setAmount("");

      try {
        const refreshRes = await fetch(
          `${API_BASE}/api/user/${userId}`
        );

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
    <div
      className="container"
      style={{
        padding: "14px",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        className="page-header"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          alignItems: "stretch",
        }}
      >
        <div>
          <h2
            style={{
              marginBottom: "6px",
              fontSize: "1.5rem",
            }}
          >
            Wallet
          </h2>

          <div
            className="page-sub"
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              wordBreak: "break-word",
            }}
          >
            Balance: <b>KES {user?.balance ?? 0}</b>
            <br />
            Phone: <b>{user?.phone || "-"}</b>
          </div>
        </div>

        <div
          className="page-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          <Link
            className="link-btn"
            to="/"
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            Dashboard
          </Link>

          <Link
            className="link-btn"
            to="/account"
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            Account
          </Link>
        </div>
      </div>

      {loading && !serverUser ? <p>Loading...</p> : null}

      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "14px auto",
          padding: "18px",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Deposit / Withdraw
        </h3>

        <p
          style={{
            marginTop: 0,
            opacity: 0.85,
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          Deposits go to the registered phone number.
          Withdrawals require an active package.
        </p>

        <div
          className="auth-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <label>
            Amount (KES)

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              style={{ width: "100%" }}
            />
          </label>

          <button
            type="button"
            onClick={deposit}
            style={{
              width: "100%",
            }}
          >
            Deposit (STK Push)
          </button>

          <button
            type="button"
            onClick={withdraw}
            style={{
              background: "#e53935",
              width: "100%",
            }}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
