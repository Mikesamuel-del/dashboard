import React from "react";

const EarningsCard = ({ title, amount }) => {
  return (
    <div
      className="card"
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        marginTop: "18px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "#6b7280",
          fontWeight: "500",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          marginTop: "12px",
          fontSize: "32px",
          color: "#111827",
        }}
      >
        KES {amount}
      </h3>
    </div>
  );
};

export default EarningsCard;
