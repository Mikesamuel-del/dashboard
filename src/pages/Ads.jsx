import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const canAccessAdsSurvey = (pkg) => {
  const p = (pkg || "none").toLowerCase();
  return p === "gold" || p === "silver";
};

/* ===== FAKE ADS (replace later with real ad network) ===== */
const ADS = [
  {
    id: 1,
    title: "Learn how to earn online safely",
    description:
      "Watch this short advert about digital income opportunities.",
    reward: 5,
  },
  {
    id: 2,
    title: "Best mobile deals in Kenya",
    description:
      "Discover affordable smartphones and bundles.",
    reward: 5,
  },
  {
    id: 3,
    title: "Financial tips for beginners",
    description:
      "Improve your saving habits and financial knowledge.",
    reward: 5,
  },
  {
    id: 4,
    title: "Online business guide",
    description:
      "Start your first online business today.",
    reward: 5,
  },
];

export default function Ads() {
  const { user, updateUser } = useAuth();

  const [watched, setWatched] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  if (!canAccessAdsSurvey(user?.package)) {
    return (
      <div className="container">
        <h2>Upgrade Required</h2>
        <p>
          Ads & Surveys are available on Silver or Gold packages.
        </p>
        <Link to="/">← Go back to Dashboard</Link>
      </div>
    );
  }

  const watchAd = async (ad) => {
    if (watched.includes(ad.id)) {
      alert("You already watched this ad.");
      return;
    }

    setLoadingId(ad.id);

    try {
      // OPTIONAL backend tracking
      await fetch(
        `${API_BASE}/api/user/ad-reward`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            reward: ad.reward,
          }),
        }
      ).catch(() => {});

      const newBalance =
        Number(user?.balance || 0) +
        ad.reward;

      updateUser({
        balance: newBalance,
      });

      setWatched((prev) => [
        ...prev,
        ad.id,
      ]);

      alert(
        `You earned KES ${ad.reward}`
      );
    } catch (err) {
      console.log(err);
      alert("Failed to process reward");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "16px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <Link to="/">← Back to Dashboard</Link>

      <h1 style={{ marginTop: "10px" }}>
        Watch Ads & Earn
      </h1>

      <p style={{ opacity: 0.8 }}>
        Watch ads and earn KES 5 per ad.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {ADS.map((ad) => {
          const isWatched =
            watched.includes(ad.id);

          return (
            <div
              key={ad.id}
              style={{
                padding: "16px",
                borderRadius: "14px",
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3>{ad.title}</h3>

              <p style={{ opacity: 0.8 }}>
                {ad.description}
              </p>

              <p>
                Reward:{" "}
                <b>KES {ad.reward}</b>
              </p>

              <button
                onClick={() =>
                  watchAd(ad)
                }
                disabled={
                  isWatched ||
                  loadingId === ad.id
                }
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: isWatched
                    ? "#555"
                    : "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {loadingId === ad.id
                  ? "Watching..."
                  : isWatched
                  ? "Completed"
                  : "Watch Ad"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
