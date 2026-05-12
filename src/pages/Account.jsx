import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

        updateUser({
          name: data?.name,
          phone: data?.phone,
          package: data?.package,
          balance: data?.balance,
          referralCode: data?.referralCode,
          referralCount:
            data?.referralCount ?? data?.referrals ?? 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    if (userId) run();
  }, [userId, updateUser]);

  const referralCount =
    serverUser?.referralCount ??
    serverUser?.referrals ??
    user?.referralCount ??
    0;

  const copyCode = useCallback(async () => {
    const code = serverUser?.referralCode || user?.referralCode || "";

    if (!code) {
      toast.error("No referral code yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Referral code copied");
    } catch {
      toast.error("Could not copy referral code.");
    }
  }, [serverUser?.referralCode, user?.referralCode]);

  const save = async (e) => {
    e.preventDefault();

    setMsg("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Update failed");
      }

      updateUser(data.user);
      setMsg("Saved.");
    } catch (err) {
      setMsg(err?.message || "Update failed.");
    } finally {
      setSaving(false);
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
            Account
          </h2>

          <div
            className="page-sub"
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              wordBreak: "break-word",
            }}
          >
            Package:{" "}
            <b>{(user?.package || "none").toUpperCase()}</b>
            <br />
            Balance: <b>KES {user?.balance ?? 0}</b>
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

          <button
            className="logout-btn"
            onClick={logout}
            style={{
              width: "100%",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {loading && !serverUser ? <p>Loading...</p> : null}

      <div
        className="auth-card account-referral-card"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "14px auto",
          padding: "18px",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Referrals</h3>

        <p
          style={{
            marginTop: 0,
            opacity: 0.85,
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          Share your code with friends. Totals refresh whenever someone registers
          using your code.
        </p>

        <div
          className="account-referral-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div className="account-referral-stat">
            <div className="account-referral-label">
              Total referrals
            </div>

            <div className="account-referral-number">
              {referralCount}
            </div>
          </div>

          <div className="account-referral-stat">
            <div className="account-referral-label">
              Your code
            </div>

            <div
              className="account-referral-code-row"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <code
                className="account-referral-code"
                style={{
                  width: "100%",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                {serverUser?.referralCode ||
                  user?.referralCode ||
                  "—"}
              </code>

              <button
                type="button"
                className="referral-copy-btn"
                onClick={copyCode}
                style={{
                  width: "100%",
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

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
        <h3 style={{ marginTop: 0 }}>Profile</h3>

        <p
          style={{
            marginTop: 0,
            opacity: 0.85,
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          Your phone number is used for <b>deposits</b> and{" "}
          <b>withdrawals</b>.
        </p>

        {msg ? (
          <div
            className="auth-error"
            style={{
              background: "#e0f2fe",
              color: "#075985",
              borderColor: "#bae6fd",
            }}
          >
            {msg}
          </div>
        ) : null}

        <form
          className="auth-form"
          onSubmit={save}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <label>
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Email
            <input
              value={user?.email || ""}
              readOnly
              style={{ width: "100%" }}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
            }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
