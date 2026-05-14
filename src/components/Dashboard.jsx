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
  const [loading, setLoading] = useState(true);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  const userId = authedUser?._id || authedUser?.id;

  const fetchUser = async () => {
    try {
      if (!userId) return;

      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/user/${userId}`
      );

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

      // 🔥 SYNC GLOBAL AUTH STATE
      updateUser({
        balance: data.balance,
        package: data.package,
        referralCode: data.referralCode,
        referralCount: fixedReferralCount,
      });

      // 🔥 SYNC LOCALSTORAGE (IMPORTANT FOR OTHER PAGES)
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

    } catch (err) {
      console.log("Fetch user error:", err);
    } finally {
      setLoading(false);
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(amount),
            phone: user?.phone || authedUser?.phone,
            userId,
          }),
        }
      );

      alert("STK Push sent. Enter PIN on your phone.");

      setAmount("");
      setShowDeposit(false);

      fetchUser(); // 🔥 REFRESH AFTER DEPOSIT
    } catch (err) {
      console.log("Deposit error:", err);
      alert("Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/user/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      alert(data.message || "Withdraw processed");

      setAmount("");
      setShowWithdraw(false);

      fetchUser(); // 🔥 REFRESH AFTER WITHDRAW
    } catch (err) {
      console.log("Withdraw error:", err);
    }
  };

  if (loading || !user) return <LoadingSplash />;

  /* ===== NOTIFICATIONS ===== */

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

  if (!user?.package || user?.package === "none") {
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

      {/* ===== HEADER ===== */}
      <header className="mm-brand-hero">
        <div className="mm-brand-hero-row">
          <img
            src={require("../assets/marketminds-logo.png")}
            alt="Marketminds"
            className="mm-brand-hero-logo"
          />

          <nav className="mm-brand-hero-nav">
            <Link to="/help">Help Center</Link>
            <button onClick={logout}>Logout</button>
          </nav>
        </div>

        <div className="mm-brand-hero-wordmark">
          Market<span>minds</span>
        </div>

        <p className="mm-brand-hero-tagline">
          Smart investments. Steady growth.
        </p>
      </header>

      {/* ===== ALERTS ===== */}
      {notifications.map((note, i) => (
        <div key={i} className={`alert ${note.type}`}>
          <span>{note.message}</span>
          <Link to={note.link}>{note.action}</Link>
        </div>
      ))}

      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        <h2>
          Account Balance
        </h2>

        <div>
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

      {/* ===== COMPONENTS ===== */}
      <EarningsCard
        title="Current Balance"
        amount={user.balance ?? 0}
      />

      <ReferralBox
        referralCode={user.referralCode}
        referrals={user.referralCount ?? 0}
      />

      <Packages user={user} refresh={fetchUser} />

      {/* ===== FOOTER ===== */}
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
