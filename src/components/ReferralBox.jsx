import React, { useCallback } from "react";
import { toast } from "react-toastify";

const ReferralBox = ({ referralCode, referralCount }) => {
  const refLink = `${window.location.origin}/register?ref=${encodeURIComponent(
    referralCode || ""
  )}`;

  const refCode = referralCode || "";

  // FIX: ensure safe number
  const count = Number(referralCount) || 0;

  const copyText = useCallback(async (label, text) => {
    const value = text || "";

    if (!value) {
      toast.error("Nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
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
            register and purchase.
          </p>
        </div>

        <div className="referral-count">
          <span>Referrals</span>
          <h1>{count}</h1>
        </div>
      </div>

      {/* CODE */}
      <div className="referral-block">
        <div className="referral-top">
          <span>Referral Code</span>
          <button onClick={() => copyText("Referral code", refCode)}>
            Copy
          </button>
        </div>

        <input value={refCode} readOnly />
      </div>

      {/* LINK */}
      <div className="referral-block">
        <div className="referral-top">
          <span>Referral Link</span>
          <button onClick={() => copyText("Referral link", refLink)}>
            Copy
          </button>
        </div>

        <input value={refLink} readOnly />
      </div>

      {/* STYLES */}
      <style>{`
        .referral-card{
          background: linear-gradient(135deg,#000,#111);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 22px;
          padding: 24px;
          color: #fff;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .referral-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:22px;
          flex-wrap:wrap;
          gap:20px;
        }

        .referral-header h2{
          margin:0;
          color:#d4af37;
          font-size:26px;
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
          text-align:center;
          min-width:130px;
          color:#000;
          box-shadow:0 10px 25px rgba(212,175,55,0.25);
        }

        .referral-count span{
          font-size:13px;
          font-weight:600;
        }

        .referral-count h1{
          margin:0;
          font-size:30px;
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
        }

        input{
          width:100%;
          padding:14px;
          border-radius:12px;
          border:1px solid rgba(212,175,55,0.25);
          background:#0a0a0a;
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
