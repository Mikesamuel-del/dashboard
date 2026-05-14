import React from "react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const Packages = () => {

  // ALWAYS READ USER FROM LOCALSTORAGE (SOURCE OF TRUTH)
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const realUserId =
    storedUser?._id ||
    storedUser?.id;

  const user = storedUser;

  if (!realUserId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Please log in again.
      </div>
    );
  }

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
      console.log("USER ID:", realUserId);

      const res = await fetch(
        `${API_BASE}/api/user/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: realUserId,
            packageType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        toast.error(
          data?.message || data?.error || "Purchase failed"
        );
        return;
      }

      toast.success(
        data?.message || "Package purchased"
      );

    } catch (e) {
      console.log("PACKAGE PURCHASE ERROR:", e);
      toast.error("Purchase failed");
    }
  };

  const current = (user?.package || "none").toLowerCase();

  return (
    <section className="packages-section">
      <div className="packages-section-head">
        <h2>Packages</h2>

        <p>
          Current plan:{" "}
          <strong>{(user?.package || "none").toUpperCase()}</strong>
        </p>
      </div>

      <div className="package-cards-grid">
        {packages.map((pkg) => {
          const active = current === pkg.id;

          return (
            <article
              key={pkg.id}
              className={`package-card${active ? " is-active" : ""}`}
            >
              <div className="package-card-body">
                <h3>{pkg.name}</h3>

                <p>
                  KES <strong>{pkg.price}</strong>
                </p>

                {active && <span>Active</span>}

                <ul>
                  {pkg.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              <button
                disabled={active}
                onClick={() => buy(pkg.id)}
              >
                {active ? "Active plan" : `Buy ${pkg.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Packages;
