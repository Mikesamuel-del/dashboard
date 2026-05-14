import React, { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

const ReferralBox = () => {
  const { user } = useAuth();

  // SAME LOGIC AS ACCOUNT PAGE (IMPORTANT)
  const referralCount =
    user?.referralCount ?? user?.referrals ?? 0;

  const referralCode = user?.referralCode || "";

  const refLink = `${window.location.origin}/register?ref=${encodeURIComponent(
    referralCode
  )}`;

  const copyText = useCallback(async (label, text) => {
    if (!text) {
      toast.error("Nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy — try manually.");
    }
  }, []);

  return (
    <section className="referral-card">
      {/* HEADER */}
      <div className="referral-header">
        <div>
          <h2>Refer & Earn</h2>
          <p>
            Share your referral code or link and earn rewards when users
            register using your code.
          </p>
        </div>

        <div className="referral-count">
          <span>Total Referrals</span>
          <h1>{referralCount}</h1>
        </div>
      </div>

      {/* CODE */}
      <div className="referral-block">
        <div className="referral-top">
          <span>Referral Code</span>
          <button onClick={() => copyText("Referral code", referralCode)}>
            Copy
          </button>
        </div>

        <input value={referralCode || "—"} readOnly />
      </div>

      {/* LINK */}
      <div className="referral-block">
        <div className="referral-top">
          <span>Referral Link</span>
          <button onClick={() => copyText("Referral link", refLink)}>
            Copy
          </button>
        </div>

        <input value={refLink || "—"} readOnly />
      </div>

      {/* GOLD + BLACK STYLES */}
      <style>{`
        .referral-card{
          background: linear-gradient(135deg,#000,#0a0a0a);
          border: 1px solid rgba(212,175,55,0.35);
          border-radius: 22px;
          padding: 24px;
          color: #fff;
          box-shadow: 0 10px 40px rgba(0,0,0,0.7);
        }

        .referral-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:20px;
          margin-bottom:22px;
        }

        .referral-header h2{
          margin:0;
          color:#d4af37;
          font-size:26px;
          letter-spacing:0.5px;
        }

        .referral-header p{
          opacity:0.75;
          max-width:420px;
          line-height:1.5;
        }

        .referral-count{
          background: linear-gradient(135deg,#d4af37,#b8860b);
          padding:18px 26px;
          border-radius:16px;
          color:#000;
          text-align:center;
          box-shadow:0 10px 25px rgba(212,175,55,0.25);
          min-width:140px;
        }

        .referral-count span{
          font-size:13px;
          font-weight:600;
        }

        .referral-count h1{
          margin:0;
          font-size:32px;
        }

        .referral-block{
          margin-top:18px;
        }

        .referral-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        }

        .referral-top span{
          font-weight:600;
          color:#d4af37;
        }

        .referral-top button{
          background:#d4af37;
          color:#000;
          border:none;
          padding:8px 14px;
          border-radius:8px;
          font-weight:700;
          cursor:pointer;
          transition:0.2s;
        }

        .referral-top button:hover{
          transform:scale(1.05);
        }

        input{
          width:100%;
          padding:14px;
          border-radius:12px;
          background:#0a0a0a;
          border:1px solid rgba(212,175,55,0.25);
          color:#fff;
          outline:none;
        }

        input:focus{
          border-color:#d4af37;
        }
      `}</style>
    </section>
  );
};

export default ReferralBox;
