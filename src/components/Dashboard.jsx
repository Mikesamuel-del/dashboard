import React, { useEffect, useState } from "react";
import EarningsCard from "./EarningsCard";
import ReferralBox from "./ReferralBox";
import ActionButtons from "./ActionButtons";
import Packages from "./Packages";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const hasActivePackage = (pkg) => Boolean(pkg && pkg !== "none");

const Dashboard = () => {
  const { user: authedUser, logout, updateUser } = useAuth();
  const [user, setUser] = useState(null);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  const userId = authedUser?.id;

  // ✅ FETCH USER FROM BACKEND
  const fetchUser = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`${API_BASE}/api/user/${userId}`);
      const data = await res.json();
      setUser(data);
      updateUser({
        balance: data.balance,
        package: data.package,
        referralCode: data.referralCode,
        referralCount:
          data.referralCount ?? data.referrals ?? 0,
      });
    } catch (err) {
      console.log("Fetch user error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // ✅ HANDLE DEPOSIT (STK PUSH)
  const handleDeposit = async () => {
    if (!amount) return;

    try {
      await fetch(`${API_BASE}/api/payment/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone: user?.phone || authedUser?.phone,
          userId,
        }),
      });

      alert("STK Push sent. Enter PIN on your phone.");

      setAmount("");
      setShowDeposit(false);
    } catch (err) {
      console.log("Deposit error:", err);
      alert("Deposit failed");
    }
  };

  // ✅ HANDLE WITHDRAW (BASIC FOR NOW)
  const handleWithdraw = async () => {
    if (!amount || amount <= 0) return;

    try {
      const res = await fetch(`${API_BASE}/api/user/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: Number(amount) }),
      });

      const data = await res.json();

      alert(data.message || "Withdraw processed");

      setAmount("");
      setShowWithdraw(false);
      fetchUser(); // 🔥 refresh balance
    } catch (err) {
      console.log("Withdraw error:", err);
    }
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="container">
      {/* TOP */}
      <div className="top-bar">
        <div className="top-bar-row">
          <div>
            <h2>Account Balance</h2>
            <div className="top-sub">
              {user.name} • {user.email} • Package:{" "}
              <b>{(user.package || "none").toUpperCase()}</b>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="quick-links">
          <Link className="link-btn" to="/wallet">
            Wallet
          </Link>
          <Link className="link-btn" to="/account">
            Account
          </Link>
          <Link className="link-btn" to="/history">
            History
          </Link>
        </div>

        <div className="earnings">
          <EarningsCard title="Ads & Survey" amount={user.adsSurvey || 0} />
          <EarningsCard title="Writing" amount={user.writing || 0} />
          <EarningsCard title="Referral" amount={user.referral || 0} />
        </div>

        <div className="total">
          Total Earnings: KES{" "}
          {(user.adsSurvey || 0) +
            (user.writing || 0) +
            (user.referral || 0)}
        </div>

        <div className="balance">
          Total Balance: KES {user.balance || 0}
        </div>

        {/* WALLET BUTTONS */}
        <div className="wallet-buttons">
          <button
            className="deposit-btn"
            onClick={() => setShowDeposit(true)}
          >
            💳 Deposit (to {user.phone})
          </button>

          <button
            className="withdraw-btn"
            onClick={() => {
              if (!hasActivePackage(user.package)) {
                alert("Buy a package first to withdraw.");
                return;
              }
              setShowWithdraw(true);
            }}
          >
            💰 Withdraw
          </button>
        </div>
      </div>

      {/* MODAL */}
      {(showDeposit || showWithdraw) && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {showDeposit ? "Deposit Amount" : "Withdraw Amount"}
            </h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="modal-buttons">
              <button
                onClick={
                  showDeposit ? handleDeposit : handleWithdraw
                }
              >
                Confirm
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeposit(false);
                  setShowWithdraw(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MIDDLE */}
      <div className="middle-section">
        <ReferralBox
          referralCode={user.referralCode}
          referralCount={
            user.referralCount ?? user.referrals ?? 0
          }
        />
        <Packages user={user} refresh={fetchUser} />
      </div>

      <ActionButtons userPackage={user.package} />
    </div>
  );
};

export default Dashboard;