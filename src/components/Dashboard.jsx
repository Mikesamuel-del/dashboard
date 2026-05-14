import React, { useEffect, useState } from "react";
import EarningsCard from "./EarningsCard";
import ReferralBox from "./ReferralBox";
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
  const [loading, setLoading] =
    useState(true);

  const userId =
    authedUser?._id ||
    authedUser?.id;

  // FETCH USER
  const fetchUser = async () => {
    try {
      if (!userId) return;

      const res = await fetch(
        `${API_BASE}/api/user/${userId}`
      );

      const data = await res.json();

      // FIX REFERRAL COUNT
      const fixedReferralCount =
        data.referralCount ??
        data.referrals ??
        data.referral ??
        0;

      const updatedUser = {
        ...data,
        referralCount:
          fixedReferralCount,
      };

      setUser(updatedUser);

      // UPDATE AUTH
      updateUser({
        balance: data.balance,
        package: data.package,
        referralCode:
          data.referralCode,
        referralCount:
          fixedReferralCount,
      });

      // UPDATE STORAGE
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

    } catch (err) {
      console.log(
        "Fetch user error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // AUTO REFRESH
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUser();
    }, 10000);

    return () =>
      clearInterval(interval);
  }, [userId]);

  if (loading || !user)
    return <LoadingSplash />;

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

      {/* ===== HERO ===== */}
      <header className="mm-brand-hero">

        <div className="mm-brand-hero-row">

          <img
            src={require("../assets/marketminds-logo.png")}
            alt="Marketminds"
            className="mm-brand-hero-logo"
          />

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        <div className="mm-brand-hero-wordmark">
          Market<span>minds</span>
        </div>

        <p className="mm-brand-hero-tagline">
          Smart investments. Steady growth.
        </p>

      </header>

      {/* ===== ACCOUNT BAR ===== */}
      <div className="top-bar">

        <div
          className="top-bar-row"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >

          {/* USER INFO */}
          <div>

            <h2
              style={{
                marginBottom: "8px",
              }}
            >
              {user.name}
            </h2>

            <div className="top-sub">
              {user.email}
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              Package:{" "}
              <b>
                {(
                  user.package ||
                  "none"
                ).toUpperCase()}
              </b>
            </div>

          </div>

          {/* BALANCE */}
          <div
            style={{
              textAlign: "right",
            }}
          >

            <div className="balance">
              KES {user.balance ?? 0}
            </div>

            <div
              style={{
                opacity: 0.8,
                marginTop: "4px",
              }}
            >
              Current Balance
            </div>

          </div>

        </div>

        {/* ACCOUNT BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >

          <Link
            to="/wallet"
            className="link-btn"
          >
            Wallet
          </Link>

          <Link
            to="/account"
            className="link-btn"
          >
            Account
          </Link>

          <Link
            to="/help"
            className="link-btn"
          >
            Help Center
          </Link>

        </div>

      </div>

      {/* ===== TASKS BAR ===== */}
      <div className="top-bar">

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >

          {/* ADS */}
          <Link
            to={
              user?.package &&
              user?.package !== "none"
                ? "/ads"
                : "/packages"
            }
            style={{
              background:
                "linear-gradient(135deg,#0f172a,#1e3a8a)",
              color: "#fff",
              padding: "22px",
              borderRadius: "18px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            🎥 Watch Ads to Earn
          </Link>

          {/* SURVEY */}
          <Link
            to={
              user?.package &&
              user?.package !== "none"
                ? "/survey"
                : "/packages"
            }
            style={{
              background:
                "linear-gradient(135deg,#1e293b,#2563eb)",
              color: "#fff",
              padding: "22px",
              borderRadius: "18px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            📋 Survey Questions
          </Link>

          {/* WRITING */}
          <Link
            to={
              user?.package &&
              user?.package !== "none"
                ? "/writing"
                : "/packages"
            }
            style={{
              background:
                "linear-gradient(135deg,#111827,#374151)",
              color: "#fff",
              padding: "22px",
              borderRadius: "18px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            ✍️ Start Online Writing
          </Link>

        </div>

      </div>

      {/* ===== SMART NOTIFICATIONS ===== */}
      {notifications.length > 0 && (
        <div
          className="dashboard-alerts"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "20px",
            marginTop: "24px",
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
      )}

      {/* ===== COMPONENTS ===== */}

      <EarningsCard
        title="Earnings Overview"
        amount={user.balance ?? 0}
      />

      {/* REFERRALS */}
      <ReferralBox
        referralCode={
          user.referralCode
        }
        referrals={
          user.referralCount ?? 0
        }
      />

      {/* PACKAGES */}
      <Packages
        user={user}
        refresh={fetchUser}
      />

      {/* ===== FOOTER ===== */}
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
