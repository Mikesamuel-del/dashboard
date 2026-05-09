import React from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Packages = ({ user, refresh }) => {
  const packages = [
    {
      name: "Gold",
      price: 500,
      id: "gold",
      advantages: [
        "Unlimited withdrawal",
        "Referral earn up to 3rd level",
        "Minimum withdrawal KES 2000",
        "Earn & withdraw from ALL sources",
      ],
    },
    {
      name: "Silver",
      price: 200,
      id: "silver",
      advantages: [
        "Withdrawal limit up to 100,000",
        "Referral earn up to 2nd level",
        "Minimum withdrawal KES 2500",
        "Earn from Ads, Surveys & Referrals",
      ],
    },
    {
      name: "Bronze",
      price: 100,
      id: "bronze",
      advantages: [
        "Withdrawal limit up to 20,000",
        "Referral earn up to 1st level",
        "Minimum withdrawal KES 3500",
        "Earn from referrals only",
      ],
    },
  ];

  const buy = async (packageType) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id, packageType }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        alert(data?.message || data?.error || "Purchase failed");
        return;
      }
      alert(data?.message || "Package purchased");
      refresh?.();
    } catch (e) {
      alert("Purchase failed");
    }
  };

  return (
    <div className="packages">
      {packages.map((pkg, index) => (
        <div key={index} className="package-card">
          <h3>{pkg.name}</h3>
          <p className="price">KES {pkg.price}</p>
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            Current: <b>{(user?.package || "none").toUpperCase()}</b>
          </p>

          {/* ✅ ADVANTAGES */}
          <ul>
            {pkg.advantages.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>

          <button
            className="buy-btn"
            disabled={(user?.package || "none").toLowerCase() === pkg.id}
            onClick={() => buy(pkg.id)}
          >
            {(user?.package || "none").toLowerCase() === pkg.id
              ? "Active"
              : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Packages;