import React, { useEffect, useState } from "react";
import EarningsCard from "./EarningsCard";
import ReferralBox from "./ReferralBox";
import ActionButtons from "./ActionButtons";
import Packages from "./Packages";
import Logo from "./Logo";
import LoadingSplash from "./LoadingSplash";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const Dashboard = () => {
  const {
    user: authedUser,
    logout,
    updateUser,
  } = useAuth();

  const [user, setUser] = useState(null);

  const [showDeposit,
    setShowDeposit] =
    useState(false);

  const [showWithdraw,
    setShowWithdraw] =
    useState(false);

  const [amount, setAmount] =
    useState("");

  const userId = authedUser?.id;

  const fetchUser = async () => {
    try {
      if (!userId) return;

      const res = await fetch(
        `${API_BASE}/api/user/${userId}`
      );

      const data = await res.json();

      setUser(data);

      updateUser({
        balance: data.balance,
        package: data.package,
        referralCode:
          data.referralCode,
        referralCount:
          data.referralCount ??
          data.referrals ??
          0,
      });
    } catch (err) {
      console.log(
        "Fetch user error:",
        err
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleDeposit = async () => {
    if (!amount) return;

    try {
      await fetch(
        `${API_BASE}/api/payment/deposit`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: Number(amount),
            phone:
              user?.phone ||
              authedUser?.phone,
            userId,
          }),
        }
      );

      alert(
        "STK Push sent. Enter PIN on your phone."
      );

      setAmount("");
      setShowDeposit(false);
    } catch (err) {
      console.log(
        "Deposit error:",
        err
      );

      alert("Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!amount || amount <= 0)
      return;

    try {
      const res = await fetch(
        `${API_BASE}/api/user/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      alert(
        data.message ||
          "Withdraw processed"
      );

      setAmount("");
      setShowWithdraw(false);

      fetchUser();
    } catch (err) {
      console.log(
        "Withdraw error:",
        err
      );
    }
  };

  if (!user) return <LoadingSplash />;

  /* ===== SMART NOTIFICATIONS ===== */

  const notifications = [];

  if ((user?.balance || 0) <= 0) {
    notifications.push({
      type: "warning",
      message:
        "Your account balance is zero. Deposit funds to continue earning.",
      action: "Deposit Now",
      link: "/wallet",
    });
  }

  if (
    !user?.package ||
    user?.package === "none"
  ) {
    notifications.push({
      type: "danger",
      message:
        "You do not have an active package. Buy one to unlock earnings and withdrawals.",
      action: "Buy Package",
      link: "/packages",
    });
  }

  if (user?.package === "bronze") {
    notifications.push({
      type: "info",
      message:
        "Upgrade to Silver package for higher withdrawal limits and better rewards.",
      action: "Upgrade Now",
      link: "/packages",
    });
  }

  if (user?.package === "silver") {
    notifications.push({
      type: "success",
      message:
        "Upgrade to Gold package to enjoy full access and maximum referral benefits.",
      action: "Go Gold",
      link: "/packages",
    });
  }

  return (
    <div className="container">
      {/* ===== BRAND HERO ===== */}

      <header className="mm-brand-hero">
        <div className="mm-brand-hero-row">
          <img
            src={require("../assets/marketminds-logo.png")}
            alt="Marketminds"
            className="mm-brand-hero-logo"
          />

          <nav className="mm-brand-hero-nav">
            <Link
              to="/help"
              className="mm-brandbar-link"
            >
              Help Center
            </Link>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </nav>
        </div>

        <div className="mm-brand-hero-wordmark">
          Market<span>minds</span>
        </div>

        <p className="mm-brand-hero-tagline">
          Smart investments. Steady
          growth.
        </p>
      </header>

      {/* ===== SMART ALERTS ===== */}

      <div
        className="dashboard-alerts"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        {notifications.map(
          (note, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                borderRadius: "14px",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                color: "#fff",
                background:
                  note.type ===
                  "warning"
                    ? "#f59e0b"
                    : note.type ===
                      "danger"
                    ? "#dc2626"
                    : note.type ===
                      "success"
                    ? "#16a34a"
                    : "#2563eb",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: "220px",
                  lineHeight: "1.5",
                }}
              >
                {note.message}
              </div>

              <Link
                to={note.link}
                style={{
                  background:
                    "#ffffff",
                  color: "#111827",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "10px",
                  textDecoration:
                    "none",
                  fontWeight: "600",
                  whiteSpace:
                    "nowrap",
                }}
              >
                {note.action}
              </Link>
            </div>
          )
        )}
      </div>

      {/* ===== TOP ===== */}

      <div className="top-bar">
        <div className="top-bar-row">
          <div>
            <h2>
              Account Balance
            </h2>

            <div className="top-sub">
              {user.name} •{" "}
              {user.email} • Package:{" "}
              <b>
                {(
                  user.package ||
                  "none"
                ).toUpperCase()}
              </b>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <Link
            className="link-btn"
            to="/wallet"
          >
            Wallet
          </Link>

          <Link
            className="link-btn"
            to="/account"
          >
            Account
          </Link>
        </div>

        <div className="balance">
          KES {user.balance ?? 0}
        </div>

        <ActionButtons
          onDepositClick={() =>
            setShowDeposit(true)
          }
          onWithdrawClick={() =>
            setShowWithdraw(true)
          }
        />
      </div>

      {/* ===== DEPOSIT MODAL ===== */}

      {showDeposit && (
        <div className="modal">
          <div className="modal-card">
            <h3>
              Deposit via M-Pesa
            </h3>

            <input
              type="number"
              placeholder="Amount (KES)"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />

            <div className="modal-actions">
              <button
                className="confirm"
                onClick={
                  handleDeposit
                }
              >
                Confirm
              </button>

              <button
                className="cancel"
                onClick={() =>
                  setShowDeposit(
                    false
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== WITHDRAW MODAL ===== */}

      {showWithdraw && (
        <div className="modal">
          <div className="modal-card">
            <h3>
              Withdraw Funds
            </h3>

            <input
              type="number"
              placeholder="Amount (KES)"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />

            <div className="modal-actions">
              <button
                className="confirm"
                onClick={
                  handleWithdraw
                }
              >
                Confirm
              </button>

              <button
                className="cancel"
                onClick={() =>
                  setShowWithdraw(
                    false
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <EarningsCard
        balance={user.balance ?? 0}
      />

      <ReferralBox
        referralCode={
          user.referralCode
        }
        referrals={
          user.referralCount ??
          user.referrals ??
          0
        }
      />

      <Packages
        userId={userId}
        currentPackage={
          user.package
        }
        onPurchased={fetchUser}
      />

      <footer className="mm-footer">
        <Logo size="sm" />

        <span>
          ©{" "}
          {new Date().getFullYear()}{" "}
          Marketminds. All rights
          reserved.
        </span>
      </footer>
    </div>
  );
};

export default Dashboard;
