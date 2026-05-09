import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const badgeStyle = (t) => {
  switch (t) {
    case "deposit":
      return { background: "#dcfce7", color: "#166534" };
    case "withdraw":
      return { background: "#fee2e2", color: "#991b1b" };
    case "package_purchase":
      return { background: "#e0f2fe", color: "#075985" };
    case "referral_bonus":
      return { background: "#fef9c3", color: "#854d0e" };
    default:
      return { background: "#e2e8f0", color: "#0f172a" };
  }
};

export default function History() {
  const { user, updateUser } = useAuth();
  const userId = user?.id;

  const [serverUser, setServerUser] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const fetchAll = async () => {
    if (!userId) return;
    setError("");
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/api/user/${userId}`),
        fetch(`${API_BASE}/api/user/${userId}/transactions?limit=200&offset=0`),
      ]);

      const u = await uRes.json();
      const t = await tRes.json();

      setServerUser(u);
      updateUser({ balance: u.balance, package: u.package, phone: u.phone, name: u.name });

      setTxs(Array.isArray(t?.transactions) ? t.transactions : []);
    } catch (e) {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [userId]);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return txs;
    return txs.filter((x) => x.type === typeFilter);
  }, [txs, typeFilter]);

  const totals = useMemo(() => {
    const sum = (arr) => arr.reduce((acc, x) => acc + Number(x.amount || 0), 0);
    const deposits = txs.filter((x) => x.type === "deposit");
    const withdraws = txs.filter((x) => x.type === "withdraw");
    const packages = txs.filter((x) => x.type === "package_purchase");
    const referral = txs.filter((x) => x.type === "referral_bonus");

    return {
      depositTotal: sum(deposits),
      withdrawTotal: sum(withdraws),
      packageTotal: sum(packages),
      referralTotal: sum(referral),
    };
  }, [txs]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Earnings & Transactions</h2>
          <div className="page-sub">
            Balance: <b>KES {user?.balance ?? 0}</b> • Package:{" "}
            <b>{(user?.package || "none").toUpperCase()}</b>
          </div>
        </div>

        <div className="page-actions">
          <Link className="link-btn" to="/">
            Dashboard
          </Link>
          <Link className="link-btn" to="/wallet">
            Wallet
          </Link>
          <Link className="link-btn" to="/account">
            Account
          </Link>
        </div>
      </div>

      {error ? <div className="auth-error">{error}</div> : null}
      {loading && !serverUser ? <p>Loading...</p> : null}

      <div className="middle-section" style={{ alignItems: "stretch" }}>
        <div className="referral-box" style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0 }}>Earnings summary</h3>
          <p style={{ margin: 0 }}>
            Ads & Surveys: <b>KES {serverUser?.adsSurvey ?? 0}</b>
          </p>
          <p style={{ margin: 0 }}>
            Writing: <b>KES {serverUser?.writing ?? 0}</b>
          </p>
          <p style={{ margin: 0 }}>
            Referral: <b>KES {serverUser?.referral ?? 0}</b>
          </p>
          <hr />
          <p style={{ margin: 0 }}>
            Deposits (total): <b>KES {totals.depositTotal}</b>
          </p>
          <p style={{ margin: 0 }}>
            Withdrawals (total): <b>KES {totals.withdrawTotal}</b>
          </p>
          <p style={{ margin: 0 }}>
            Packages (spent): <b>KES {totals.packageTotal}</b>
          </p>
          <p style={{ margin: 0 }}>
            Referral bonuses (credited): <b>KES {totals.referralTotal}</b>
          </p>
        </div>

        <div className="packages" style={{ flex: 2, flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Transaction history</h3>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 14 }}>
                Filter{" "}
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdraw">Withdrawals</option>
                  <option value="package_purchase">Package purchases</option>
                  <option value="referral_bonus">Referral bonuses</option>
                </select>
              </label>
              <button className="buy-btn" onClick={fetchAll} style={{ width: "auto" }}>
                Refresh
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {filtered.length === 0 ? (
              <p style={{ opacity: 0.8 }}>No transactions yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((tx) => (
                  <div
                    key={tx._id || `${tx.type}-${tx.createdAt}-${tx.amount}`}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: 12,
                      display: "flex",
                      gap: 12,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ ...badgeStyle(tx.type), padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                          {tx.type.replace("_", " ")}
                        </span>
                        <span style={{ fontSize: 12, opacity: 0.75 }}>{formatDateTime(tx.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.9 }}>{tx.note || "-"}</div>
                      {tx.reference ? <div style={{ fontSize: 12, opacity: 0.7 }}>Ref: {tx.reference}</div> : null}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>
                        {tx.direction === "debit" ? "-" : "+"}KES {Number(tx.amount || 0)}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

