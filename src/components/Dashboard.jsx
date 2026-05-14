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
  const { user: authedUser, logout, updateUser } = useAuth();

  const [user, setUser] = useState(null);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  const userId = authedUser?._id || authedUser?.id;

  // 🔥 FIX: single source refresh function
  const fetchUser = async () => {
    try {
      if (!userId) return;

      const res = await fetch(`${API_BASE}/api/user/${userId}`);
      const data = await res.json();

      const fixedReferralCount =
        data.referralCount ??
        data.referrals ??
        data.referral ??
        0;

      const updatedUser = {
        ...data,
        referralCount: fixedReferralCount,
      };

      setUser(updatedUser);

      // sync global auth
      updateUser({
        balance: data.balance,
        package: data.package,
        referralCode: data.referralCode,
        referralCount: fixedReferralCount,
      });

      // sync localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      console.log("Fetch user error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // 🔥 FIX: auto refresh every 10s (THIS FIXES REFERRALS NOT UPDATING)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUser();
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleDeposit = async () => {
    if (!amount) return;

    await fetch(`${API_BASE}/api/payment/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        phone: user?.phone || authedUser?.phone,
        userId,
      }),
    });

    alert("STK Push sent. Enter PIN on your phone.");

    setAmount("");
    setShowDeposit(false);

    fetchUser(); // refresh
  };

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) return;

    const res = await fetch(`${API_BASE}/api/user/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        amount: Number(amount),
      }),
    });

    const data = await res.json();

    alert(data.message || "Withdraw processed");

    setAmount("");
    setShowWithdraw(false);

    fetchUser(); // refresh
  };

  if (!user) return <LoadingSplash />;

  /* ===== NOTIFICATIONS (UNCHANGED) ===== */
  const notifications = [];

  if ((user?.balance || 0) <= 0) {
    notifications.push({
      type: "warning",
      message: "Your account balance is zero. Deposit funds to continue earning.",
      action: "Deposit Now",
      link: "/wallet",
    });
  }

  if (!user?.package || user?.package === "none") {
    notifications.push({
      type: "danger",
      message: "You do not have an active package. Buy one to unlock earnings and withdrawals.",
      action: "Buy Package",
      link: "/packages",
    });
  }

  if (user?.package === "bronze") {
    notifications.push({
      type: "info",
      message: "Upgrade to Silver package for higher withdrawal limits and better rewards.",
      action: "Upgrade Now",
      link: "/packages",
    });
  }

  if (user?.package === "silver") {
    notifications.push({
      type: "success",
      message: "Upgrade to Gold package to enjoy full access and maximum referral benefits.",
      action: "Go Gold",
      link: "/packages",
    });
  }

  return (
    <div className="container">

      {/* ===== BRAND HERO (UNCHANGED) ===== */}
      <header className="mm-brand-hero">
        <div className="mm-brand-hero-row">
          <img
            src={require("../assets/marketminds-logo.png")}
            alt="Marketminds"
            className="mm-brand-hero-logo"
          />

          <nav className="mm-brand-hero-nav">
            <Link to="/help" className="mm-brandbar-link">
              Help Center
            </Link>

            <Link to="/account" className="mm-brandbar-link">
              Account
            </Link>

            <Link to="/wallet" className="mm-brandbar-link">
              Wallet
            </Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>

        <div className="mm-brand-hero-wordmark">
          Market<span>minds</span>
        </div>

        <p className="mm-brand-hero-tagline">
          Smart investments. Steady growth.
        </p>
      </header>

      {/* ===== NOTIFICATIONS (UNCHANGED STRUCTURE) ===== */}
      {notifications.length > 0 && (
        <div className="dashboard-alerts">
          {notifications.map((note, i) => (
            <div key={i} className={`alert ${note.type}`}>
              <span>{note.message}</span>
              <Link to={note.link}>{note.action}</Link>
            </div>
          ))}
        </div>
      )}

      {/* ===== TOP BAR (UNCHANGED) ===== */}
      <div className="top-bar">
        <h2>Account Balance</h2>

        <div className="top-sub">
          {user.name} • {user.email} • Package:{" "}
          <b>{(user.package || "none").toUpperCase()}</b>
        </div>

        <div className="balance">
          KES {user.balance ?? 0}
        </div>

        <ActionButtons
          onDepositClick={() => setShowDeposit(true)}
          onWithdrawClick={() => setShowWithdraw(true)}
        />
      </div>

      {/* ===== COMPONENTS (UNCHANGED) ===== */}
      <EarningsCard
        title="Current Balance"
        amount={user.balance ?? 0}
      />

      <ReferralBox
        referralCode={user.referralCode}
        referrals={user.referralCount ?? 0}
      />

      <Packages user={user} refresh={fetchUser} />

      {/* ===== FOOTER (UNCHANGED) ===== */}
      <footer className="mm-footer">
        <Logo size="sm" />
        <span>
          © {new Date().getFullYear()} Marketminds
        </span>
      </footer>

    </div>
  );
};

export default Dashboard;
