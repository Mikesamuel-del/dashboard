import React from "react";
import { toast } from "react-toastify";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";
  
const userId =
    authedUser?.id || authedUser?._id;

const Packages = ({
  user,
  refresh,
  userId,
  currentPackage,
  onPurchased,
}) => {
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

  // GET REAL USER ID SAFELY
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const realUserId =
    userId ||
    user?._id ||
    user?.id ||
    storedUser?._id ||
    storedUser?.id;

  const buy = async (packageType) => {
    try {
      // DEBUG
      console.log(
        "BUY PACKAGE USER ID:",
        realUserId
      );

      if (!realUserId) {
        toast.error("User not found");
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/user/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: realUserId,
            packageType,
          }),
        }
      );

      const data = await res.json();

      if (
        !res.ok ||
        data?.success === false
      ) {
        toast.error(
          data?.message ||
            data?.error ||
            "Purchase failed"
        );
        return;
      }

      toast.success(
        data?.message ||
          "Package purchased"
      );

      // REFRESH DASHBOARD
      refresh?.();
      onPurchased?.();

    } catch (e) {
      console.log(
        "PACKAGE PURCHASE ERROR:",
        e
      );

      toast.error("Purchase failed");
    }
  };

  const current = (
    currentPackage ||
    user?.package ||
    "none"
  ).toLowerCase();

  return (
    <section
      className="packages-section"
      aria-labelledby="packages-heading"
    >
      <div className="packages-section-head">
        <h2 id="packages-heading">
          Packages
        </h2>

        <p className="packages-section-sub">
          Current plan:{" "}
          <strong>
            {(
              currentPackage ||
              user?.package ||
              "none"
            ).toUpperCase()}
          </strong>
        </p>
      </div>

      <div className="package-cards-grid">
        {packages.map((pkg) => {
          const active =
            current === pkg.id;

          return (
            <article
              key={pkg.id}
              className={`package-card${
                active
                  ? " is-active"
                  : ""
              }`}
            >
              <div className="package-card-body">
                <header className="package-card-top">
                  <h3 className="package-title">
                    {pkg.name}
                  </h3>

                  <p className="package-price">
                    <span className="package-price-label">
                      KES
                    </span>

                    <span className="package-price-value">
                      {pkg.price}
                    </span>
                  </p>

                  {active ? (
                    <span className="package-badge">
                      Active
                    </span>
                  ) : null}
                </header>

                <ul className="package-features">
                  {pkg.advantages.map(
                    (adv, i) => (
                      <li key={i}>
                        {adv}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="package-card-actions">
                <button
                  type="button"
                  className="buy-btn"
                  disabled={active}
                  onClick={() =>
                    buy(pkg.id)
                  }
                >
                  {active
                    ? "Active plan"
                    : `Buy ${pkg.name}`}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Packages;
