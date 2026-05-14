import React, { useCallback } from "react";
import { toast } from "react-toastify";

const ReferralBox = ({
  referralCode,
  referralCount,
}) => {

  const refLink = `${window.location.origin}/register?ref=${encodeURIComponent(
    referralCode || ""
  )}`;

  const refCode =
    referralCode || "";

  // FIX REFERRAL COUNT
  const count =
    Number(referralCount) ||
    0;

  const copyText = useCallback(
    async (label, text) => {
      const value = text || "";

      if (!value) {
        toast.error(
          "Nothing to copy yet."
        );
        return;
      }

      try {
        await navigator.clipboard.writeText(
          value
        );

        toast.success(
          `${label} copied`
        );

      } catch {

        toast.error(
          "Could not copy — try selecting the text manually."
        );

      }
    },
    []
  );

  return (
    <section
      className="referral-card"
      aria-labelledby="referral-heading"
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#111827)",
        borderRadius: "24px",
        padding: "24px",
        marginTop: "24px",
        color: "#fff",
        border:
          "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 12px 35px rgba(0,0,0,0.25)",
      }}
    >

      {/* HEADER */}
      <div
        className="referral-card-header"
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >

        <div>

          <h2
            id="referral-heading"
            style={{
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Refer & Earn
          </h2>

          <p
            className="referral-card-sub"
            style={{
              margin: 0,
              opacity: 0.8,
              lineHeight: "1.6",
            }}
          >
            Share your referral code
            or link. When friends
            buy packages using your
            referral, your total
            referrals update
            automatically.
          </p>

        </div>

        {/* REFERRAL COUNT */}
        <div
          className="referral-stat-pill"
          title="Total successful referrals"
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            padding:
              "16px 22px",
            borderRadius:
              "18px",
            minWidth: "120px",
            textAlign: "center",
            boxShadow:
              "0 10px 25px rgba(37,99,235,0.35)",
          }}
        >

          <div
            className="referral-stat-label"
            style={{
              fontSize: "13px",
              opacity: 0.9,
              marginBottom: "6px",
            }}
          >
            Referrals
          </div>

          <div
            className="referral-stat-value"
            style={{
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            {count}
          </div>

        </div>

      </div>

      {/* REFERRAL CODE */}
      <div
        className="referral-field"
        style={{
          marginBottom: "22px",
        }}
      >

        <div
          className="referral-field-head"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "10px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >

          <span
            style={{
              fontWeight: "600",
            }}
          >
            Referral Code
          </span>

          <button
            type="button"
            className="referral-copy-btn"
            onClick={() =>
              copyText(
                "Referral code",
                refCode
              )
            }
            style={{
              background:
                "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding:
                "10px 16px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Copy Code
          </button>

        </div>

        <input
          value={refCode}
          readOnly
          aria-readOnly
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border:
              "1px solid rgba(255,255,255,0.1)",
            background:
              "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: "15px",
            boxSizing:
              "border-box",
          }}
        />

      </div>

      {/* REFERRAL LINK */}
      <div className="referral-field">

        <div
          className="referral-field-head"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "10px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >

          <span
            style={{
              fontWeight: "600",
            }}
          >
            Referral Link
          </span>

          <button
            type="button"
            className="referral-copy-btn"
            onClick={() =>
              copyText(
                "Referral link",
                refLink
              )
            }
            style={{
              background:
                "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding:
                "10px 16px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Copy Link
          </button>

        </div>

        <input
          value={refLink}
          readOnly
          aria-readOnly
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border:
              "1px solid rgba(255,255,255,0.1)",
            background:
              "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: "15px",
            boxSizing:
              "border-box",
          }}
        />

      </div>

    </section>
  );
};

export default ReferralBox;
