import React from "react";

const ReferralBox = ({ referralCode }) => {
  const refLink = `${window.location.origin}/register?ref=${referralCode || ""}`;
  const refCode = referralCode || "";

  return (
    <div className="referral-box">
      <h2>Refer to Earn</h2>

      <p>Referral Link:</p>
      <input value={refLink} readOnly />

      <p>Referral Code:</p>
      <input value={refCode} readOnly />
    </div>
  );
};

export default ReferralBox;