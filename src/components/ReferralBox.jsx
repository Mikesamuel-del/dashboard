import React, { useCallback } from "react";
import { toast } from "react-toastify";

const ReferralBox = ({ referralCode, referralCount }) => {
  const refLink = `${window.location.origin}/register?ref=${encodeURIComponent(
    referralCode || ""
  )}`;
  const refCode = referralCode || "";
  const count =
    referralCount !== undefined && referralCount !== null
      ? referralCount
      : 0;

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
      toast.error("Could not copy — try selecting the text manually.");
    }
  }, []);

  return (
    <section className="referral-card" aria-labelledby="referral-heading">
      <div className="referral-card-header">
        <div>
          <h2 id="referral-heading">Refer &amp; earn</h2>
          <p className="referral-card-sub">
            Share your code or link. When friends join with your code, your
            referral total updates automatically.
          </p>
        </div>
        <div className="referral-stat-pill" title="Total successful referrals">
          <span className="referral-stat-label">Referrals</span>
          <span className="referral-stat-value">{count}</span>
        </div>
      </div>

      <div className="referral-field">
        <div className="referral-field-head">
          <span>Referral code</span>
          <button
            type="button"
            className="referral-copy-btn"
            onClick={() => copyText("Referral code", refCode)}
          >
            Copy code
          </button>
        </div>
        <input value={refCode} readOnly aria-readOnly />
      </div>

      <div className="referral-field">
        <div className="referral-field-head">
          <span>Referral link</span>
          <button
            type="button"
            className="referral-copy-btn"
            onClick={() => copyText("Referral link", refLink)}
          >
            Copy link
          </button>
        </div>
        <input value={refLink} readOnly aria-readOnly />
      </div>
    </section>
  );
};

export default ReferralBox;
